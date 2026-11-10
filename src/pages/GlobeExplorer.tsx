import { useEffect, useRef, useState } from "react";
import type {
  ScreenSpaceEventHandler,
  Viewer,
} from "cesium";
import {
  calculateAstronomicalInsights,
  formatAstronomicalTime,
  getMoonEventDescription,
  type AstronomicalInsights,
  type GeographicCoordinates,
} from "../utils/astronomicalInsights";
import type { SunlightCondition } from "../utils/sunlight";

function formatCoordinate(value: number, positive: string, negative: string) {
  const direction = value < 0 ? negative : positive;
  return `${Math.abs(value).toFixed(4)}° ${direction}`;
}

const sunlightLabels: Record<SunlightCondition, string> = {
  daylight: "Daylight",
  twilight: "Twilight",
  nighttime: "Nighttime",
};

function GlobeExplorer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedCoordinatesRef = useRef<GeographicCoordinates | null>(null);
  const [coordinates, setCoordinates] = useState<GeographicCoordinates | null>(
    null,
  );
  const [insights, setInsights] = useState<AstronomicalInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isActive = true;
    let viewer: Viewer | undefined;
    let eventHandler: ScreenSpaceEventHandler | undefined;
    let insightsTimer: number | undefined;
    const container = containerRef.current;

    async function initializeGlobe() {
      if (!container) {
        setError("The globe could not be initialized. Please try again.");
        return;
      }

      try {
        const Cesium = await import("cesium");
        if (!isActive) return;

        viewer = new Cesium.Viewer(container, {
          animation: false,
          baseLayerPicker: false,
          baseLayer: new Cesium.ImageryLayer(
            new Cesium.WebMapTileServiceImageryProvider({
              url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi",
              layer: "BlueMarble_NextGeneration",
              style: "default",
              format: "image/jpeg",
              tileMatrixSetID: "GoogleMapsCompatible_Level8",
              maximumLevel: 8,
              credit: new Cesium.Credit("NASA EOSDIS GIBS"),
            }),
          ),
          fullscreenButton: false,
          geocoder: false,
          homeButton: false,
          infoBox: false,
          navigationHelpButton: false,
          scene3DOnly: true,
          selectionIndicator: false,
          showRenderLoopErrors: false,
          timeline: false,
        });
        const activeViewer = viewer;

        viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
        viewer.scene.light = new Cesium.SunLight();
        viewer.scene.globe.enableLighting = true;
        viewer.scene.globe.dynamicAtmosphereLighting = true;
        viewer.scene.globe.dynamicAtmosphereLightingFromSun = true;
        viewer.scene.globe.showGroundAtmosphere = true;
        viewer.scene.globe.vertexShadowDarkness = 0.05;
        viewer.scene.globe.lightingFadeOutDistance = 0;
        viewer.scene.globe.lightingFadeInDistance = 1;
        viewer.scene.atmosphere.dynamicLighting =
          Cesium.DynamicAtmosphereLightingType.SUNLIGHT;

        eventHandler = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas,
        );
        eventHandler.setInputAction(
          (event: ScreenSpaceEventHandler.PositionedEvent) => {
            const cartesian = activeViewer.camera.pickEllipsoid(
              event.position,
              activeViewer.scene.globe.ellipsoid,
            );
            if (!cartesian) return;

            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const selectedCoordinates = {
              latitude: Cesium.Math.toDegrees(cartographic.latitude),
              longitude: Cesium.Math.toDegrees(cartographic.longitude),
            };
            selectedCoordinatesRef.current = selectedCoordinates;
            setCoordinates(selectedCoordinates);
            setInsights(
              calculateAstronomicalInsights(selectedCoordinates, new Date()),
            );
            activeViewer.entities.removeById("selected-location");
            activeViewer.entities.add({
              id: "selected-location",
              position: cartesian,
              point: {
                pixelSize: 12,
                color: Cesium.Color.fromCssColorString("#ffd166"),
                outlineColor: Cesium.Color.fromCssColorString("#102033"),
                outlineWidth: 3,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
              },
            });
          },
          Cesium.ScreenSpaceEventType.LEFT_CLICK,
        );

        insightsTimer = window.setInterval(() => {
          const selected = selectedCoordinatesRef.current;
          if (selected && isActive) {
            setInsights(calculateAstronomicalInsights(selected, new Date()));
          }
        }, 60_000);

        viewer.scene.renderError.addEventListener(() => {
          if (isActive) {
            setError("The globe encountered a rendering problem. Please retry.");
          }
        });

        setIsLoading(false);
      } catch {
        if (isActive) {
          setError("The 3D globe could not be loaded. Please try again.");
        }
      }
    }

    void initializeGlobe();

    return () => {
      isActive = false;
      if (insightsTimer !== undefined) {
        window.clearInterval(insightsTimer);
      }
      eventHandler?.destroy();
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  }, [attempt]);

  function retryInitialization() {
    setError(null);
    setIsLoading(true);
    setCoordinates(null);
    setInsights(null);
    selectedCoordinatesRef.current = null;
    setAttempt((current) => current + 1);
  }

  return (
    <main className="container globe-page py-4 py-md-5">
      <header className="mb-4">
        <p className="eyebrow mb-2">INTERACTIVE EARTH</p>
        <h1 className="fw-bold">Globe Explorer</h1>
        <p className="text-secondary mb-0">
          Drag to rotate the globe, scroll or pinch to zoom, and select a point
          on Earth to see its coordinates.
        </p>
      </header>

      <section aria-label="Interactive Earth globe">
        <div className="globe-viewer" ref={containerRef}>
          {isLoading && !error && (
            <div className="globe-status" role="status">
              <span className="spinner-border" aria-hidden="true" />
              <span>Loading the 3D Earth globe…</span>
            </div>
          )}
          {error && (
            <div className="globe-status" role="alert">
              <p className="mb-0">{error}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={retryInitialization}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </section>

      <p className="globe-location mt-3 mb-1" aria-live="polite">
        {coordinates
          ? `Selected location: ${formatCoordinate(coordinates.latitude, "N", "S")}, ${formatCoordinate(coordinates.longitude, "E", "W")}`
          : "Select a point on the globe to display its latitude and longitude."}
      </p>
      {insights && (
        <section className="astronomy-panel mt-4" aria-labelledby="insights-title">
          <header className="astronomy-panel-header">
            <div>
              <p className="eyebrow mb-2">THE SKY AT YOUR SELECTED LOCATION</p>
              <h2 className="h3 mb-1" id="insights-title">
                Astronomical Insights
              </h2>
              <p className="text-secondary mb-0">
                Calculated for{" "}
                {formatAstronomicalTime(insights.calculatedAt)} UTC
              </p>
            </div>
            <span
              className={`globe-condition globe-condition--${insights.solar.sunlightCondition}`}
              aria-live="polite"
            >
              {sunlightLabels[insights.solar.sunlightCondition]} now
            </span>
          </header>

          <div className="row g-4 mt-1">
            <section className="col-12 col-lg-6" aria-labelledby="sun-title">
              <div className="astronomy-section h-100">
                <h3 className="h5" id="sun-title">
                  Sun &amp; daylight
                </h3>
                <p className="astronomy-explanation">
                  Solar altitude is the Sun’s angle above the horizon. Azimuth
                  is its compass direction, measured clockwise from north.
                </p>
                <dl className="astronomy-metrics">
                  <div>
                    <dt>Sunrise</dt>
                    <dd>
                      {insights.solar.sunrise
                        ? `${formatAstronomicalTime(insights.solar.sunrise)} UTC`
                        : insights.solar.sunriseOrSunsetNote}
                    </dd>
                  </div>
                  <div>
                    <dt>Sunset</dt>
                    <dd>
                      {insights.solar.sunset
                        ? `${formatAstronomicalTime(insights.solar.sunset)} UTC`
                        : insights.solar.sunriseOrSunsetNote}
                    </dd>
                  </div>
                  <div>
                    <dt>Solar altitude</dt>
                    <dd>{insights.solar.altitudeDegrees.toFixed(1)}°</dd>
                  </div>
                  <div>
                    <dt>Solar azimuth</dt>
                    <dd>{insights.solar.azimuthDegrees.toFixed(1)}°</dd>
                  </div>
                </dl>
                <p className="astronomy-footnote mb-0">
                  Altitude: degrees above the horizon (negative means below).
                  Azimuth: degrees clockwise from true north.
                </p>
              </div>
            </section>

            <section className="col-12 col-lg-6" aria-labelledby="moon-title">
              <div className="astronomy-section h-100">
                <h3 className="h5" id="moon-title">
                  Moon
                </h3>
                <p className="astronomy-explanation">
                  Phase and illumination describe how much of the Moon’s
                  visible disk is lit by the Sun.
                </p>
                <dl className="astronomy-metrics">
                  <div>
                    <dt>Current phase</dt>
                    <dd>{insights.lunar.phase}</dd>
                  </div>
                  <div>
                    <dt>Illuminated</dt>
                    <dd>About {insights.lunar.illuminatedPercent}%</dd>
                  </div>
                  <div>
                    <dt>Moonrise</dt>
                    <dd>
                      {insights.lunar.moonrise
                        ? `${formatAstronomicalTime(insights.lunar.moonrise)} UTC`
                        : getMoonEventDescription(
                            "moonrise",
                            insights.lunar.moonriseOrMoonsetNote,
                          )}
                    </dd>
                  </div>
                  <div>
                    <dt>Moonset</dt>
                    <dd>
                      {insights.lunar.moonset
                        ? `${formatAstronomicalTime(insights.lunar.moonset)} UTC`
                        : getMoonEventDescription(
                            "moonset",
                            insights.lunar.moonriseOrMoonsetNote,
                          )}
                    </dd>
                  </div>
                </dl>
                {insights.lunar.moonriseOrMoonsetNote && (
                  <p className="astronomy-footnote mb-0">
                    {insights.lunar.moonriseOrMoonsetNote}
                  </p>
                )}
              </div>
            </section>
          </div>

          <p className="astronomy-time-note mb-0">
            Astronomical values and rise/set times are approximate. Times are
            shown in UTC; sunrise, sunset, moonrise and moonset refer to this
            location’s local solar day. Civil timezone information is
            unavailable, so local clock times are not shown.
          </p>
        </section>
      )}
      <p className="small text-secondary mt-2 mb-0">
        Imagery:{" "}
        <a
          href="https://gibs.earthdata.nasa.gov/"
          target="_blank"
          rel="noreferrer"
        >
          NASA Blue Marble via EOSDIS GIBS
        </a>
        .
      </p>
    </main>
  );
}

export default GlobeExplorer;
