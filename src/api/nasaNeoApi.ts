import type { SpaceEvent } from "../interface/spaceEventModel";
import { isDateKey } from "../utils/spaceEventCalendar";

const NEO_FEED_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const NASA_DEMO_KEY = "DEMO_KEY";
const MAX_FEED_DAYS = 7;
const MAX_CLOSE_APPROACH_AU = 0.05;

export interface NeoFeedResult {
  events: SpaceEvent[];
  sourceRecordCount: number;
}

export async function fetchNearEarthCloseApproaches(
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
): Promise<NeoFeedResult> {
  if (!isDateKey(startDate) || !isDateKey(endDate) || endDate < startDate) {
    throw new RangeError("Near-Earth object dates must be valid and ordered.");
  }
  const dayCount =
    (Date.parse(`${endDate}T00:00:00Z`) -
      Date.parse(`${startDate}T00:00:00Z`)) /
      (24 * 60 * 60 * 1000) +
    1;
  if (dayCount > MAX_FEED_DAYS) {
    throw new RangeError("NASA's NeoWs feed supports requests of up to seven days.");
  }

  const url = new URL(NEO_FEED_URL);
  url.search = new URLSearchParams({
    start_date: startDate,
    end_date: endDate,
    api_key: NASA_DEMO_KEY,
  }).toString();

  const response = await fetch(url, { signal });
  if (!response.ok) {
    const reason =
      response.status === 429
        ? "NASA NeoWs request limit reached. Try again later."
        : `NASA NeoWs request failed (${response.status}).`;
    throw new Error(reason);
  }

  const payload: unknown = await response.json();
  if (!isRecord(payload) || !isRecord(payload.near_earth_objects)) {
    throw new Error("NASA NeoWs returned an invalid object feed.");
  }

  const objectRecords = Object.values(payload.near_earth_objects).flatMap(
    (records) => (isUnknownArray(records) ? records : []),
  );
  const events = objectRecords
    .map(parseNearEarthObject)
    .filter((event): event is SpaceEvent => event !== null)
    .sort((left, right) => left.startDate.localeCompare(right.startDate));

  return {
    events,
    sourceRecordCount:
      typeof payload.element_count === "number"
        ? payload.element_count
        : objectRecords.length,
  };
}

function parseNearEarthObject(value: unknown): SpaceEvent | null {
  if (
    !isRecord(value) ||
    typeof value.name !== "string" ||
    typeof value.nasa_jpl_url !== "string" ||
    !Array.isArray(value.close_approach_data)
  ) {
    return null;
  }

  const earthApproach = value.close_approach_data.find(
    (approach: unknown) =>
      isRecord(approach) && approach.orbiting_body === "Earth",
  );
  if (!isRecord(earthApproach) || !isRecord(earthApproach.miss_distance)) {
    return null;
  }

  const distanceAu = readFiniteNumber(
    earthApproach.miss_distance.astronomical,
  );
  const epoch = readFiniteNumber(earthApproach.epoch_date_close_approach);
  if (
    distanceAu === null ||
    distanceAu <= 0 ||
    distanceAu > MAX_CLOSE_APPROACH_AU ||
    epoch === null
  ) {
    return null;
  }

  const approachInstant = new Date(epoch);
  if (!Number.isFinite(approachInstant.getTime())) return null;
  const isoInstant = approachInstant.toISOString();
  const startDate = isoInstant.slice(0, 10);
  const time = isoInstant.slice(11, 16);
  if (!isDateKey(startDate)) return null;

  const lunarDistances = readFiniteNumber(earthApproach.miss_distance.lunar);
  const relativeVelocity = isRecord(earthApproach.relative_velocity)
    ? readFiniteNumber(earthApproach.relative_velocity.kilometers_per_second)
    : null;
  const distanceDescription =
    lunarDistances === null
      ? `${distanceAu.toFixed(5)} AU`
      : `${distanceAu.toFixed(5)} AU (${lunarDistances.toFixed(1)} lunar distances)`;
  const velocityDescription =
    relativeVelocity === null
      ? ""
      : ` Relative speed: ${relativeVelocity.toFixed(2)} km/s.`;
  const sourceUrl = safeJplUrl(value.nasa_jpl_url);
  const id =
    typeof value.id === "string"
      ? value.id
      : typeof value.neo_reference_id === "string"
        ? value.neo_reference_id
        : `${startDate}-${value.name}`;

  return {
    id: `neo-${id}-${startDate}`,
    title: `${value.name} close approach`,
    category: "asteroid-close-approach",
    startDate,
    time,
    timeZoneLabel: "UTC",
    summary: `NASA predicts this object's closest approach to Earth at ${distanceDescription}.`,
    whyInteresting:
      "A close approach is an opportunity to track a small Solar System body and refine its orbit. A close-approach listing does not mean the object is expected to impact Earth.",
    viewingGuidance:
      "The feed does not establish naked-eye visibility. Observability depends on the object's brightness, position, and local sky conditions; follow an observatory's guidance.",
    visibility:
      "The orbital close approach is a global event. Whether the object can be observed depends on its position and local sky conditions.",
    visibilityScope: "worldwide",
    objects: [value.name],
    confidence: "approximate",
    sourceUrl,
    sourceAttribution: "NASA Near Earth Object Web Service (NeoWs)",
    predictionPeriod: "NASA NeoWs seven-day feed",
    details: `Nominal miss distance: ${distanceDescription}.${velocityDescription} Time is shown in UTC from NASA's close-approach epoch.`,
  };
}

function readFiniteNumber(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

function safeJplUrl(value: string): string {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "ssd.jpl.nasa.gov"
      ? url.toString()
      : "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html";
  } catch {
    return "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}
