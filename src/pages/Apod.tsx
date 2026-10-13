import { fetchImageByDate } from "../api/nasaApi";
import { useQuery } from "@tanstack/react-query";
import { fetchLondonWeather } from "../api/weatherApi";
import { useState } from "react";
import "../App.css";

function Apod() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const today = new Date();

  const maxDate = today.toISOString().split("T")[0];

  const minDate = new Date(today.getTime() - 24 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  function stripHtml(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    return doc.body.textContent || "";
  }

  const {
    data: weather,
    isLoading: isWeatherLoading,
    isFetching: isWeatherFetching,
    isError: isWeatherError,
    error: weatherError,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ["london-weather"],
    queryFn: fetchLondonWeather,
    // staleTime: 3 * 1000,
    // enabled: false,
  });
  const {
    data: image,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["nasa-image", selectedDate],
    queryFn: () => fetchImageByDate(selectedDate),
    // staleTime: 2 * 1000,
    // refetchInterval: 5000,
  });

  if (isLoading) {
    return (
      <div className="bg-dark text-white min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-dark text-white min-vh-100 p-5">
        <div className="alert alert-danger">
          {error instanceof Error ? error.message : "Something went wrong"}
        </div>
      </div>
    );
  }

  if (!image) {
    return null;
  }

  return (
    <>
      <div>
        {weather?.current && (
          <div className="container mt-3">
            <div className="alert alert-info">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0">London Weather</h5>

                <button
                  className="btn btn-sm btn-outline-dark"
                  onClick={() => refetchWeather()}
                  disabled={isWeatherFetching}
                >
                  {isWeatherFetching ? "Refreshing..." : "↻ Refresh Weather"}
                </button>
              </div>

              <p className="mt-3 mb-1">
                Temperature: {weather.current.temperature_2m}°C
              </p>

              <p className="mb-0">
                Humidity: {weather.current.relative_humidity_2m}%
              </p>
            </div>
          </div>
        )}

        {isWeatherError && (
          <div className="container mt-3">
            <div className="alert alert-danger" role="alert">
              {weatherError instanceof Error
                ? weatherError.message
                : "Unable to fetch London weather data."}
            </div>
          </div>
        )}
        <main className="container py-5">
          <div className="hero-section text-center">
            <span className="eyebrow">NASA • ASTRONOMY PICTURE OF THE DAY</span>

            <h1 className="display-3 fw-bold mt-3">NASA's Image of the Day</h1>

            <p className="hero-subtitle mx-auto">
              Explore a new view of the universe, captured by NASA and shared
              with the world.
            </p>

            <p className="lead text-secondary">{image.title}</p>
          </div>

          <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
            <input
              type="date"
              className="form-control date-picker"
              value={selectedDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <button
              className="btn btn-outline-light refresh-btn"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              {isFetching ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
          <div className="nasa-card">
            {image.media_type === "image" ? (
              <img
                src={image.hdurl}
                className="nasa-image"
                alt={image.alt || image.title}
              />
            ) : (
              <div className="nasa-video-placeholder">
                <p className="mb-3">
                  This Astronomy Picture of the Day is a video.
                </p>

                <a
                  href={image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light"
                >
                  ▶ Watch on NASA
                </a>
              </div>
            )}

            <div className="nasa-card-body">
              <div className="nasa-meta mb-4">
                <span className="date-value">{image.date}</span>

                {image.credit && (
                  <span className="credit-text">
                    Credit: {stripHtml(image.credit)}
                  </span>
                )}
              </div>

              <h2 className="nasa-title">{image.title}</h2>

              <p className="nasa-description">{stripHtml(image.explanation)}</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Apod;
