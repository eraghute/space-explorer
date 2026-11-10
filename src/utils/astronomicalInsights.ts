import * as SunCalc from "suncalc";
import { classifySunlight, type SunlightCondition } from "./sunlight";

export interface GeographicCoordinates {
  latitude: number;
  longitude: number;
}

export interface AstronomicalInsights {
  calculatedAt: Date;
  solar: {
    sunrise: Date | null;
    sunset: Date | null;
    sunriseOrSunsetNote: string | null;
    altitudeDegrees: number;
    azimuthDegrees: number;
    sunlightCondition: SunlightCondition;
  };
  lunar: {
    phase: string;
    illuminatedPercent: number;
    moonrise: Date | null;
    moonset: Date | null;
    moonriseOrMoonsetNote: string | null;
  };
}

const moonPhaseNames = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
] as const;

function isValidDate(date: Date): boolean {
  return Number.isFinite(date.getTime());
}

function calculateSunriseOrSunsetNote(
  times: SunCalc.SunTimes,
): string | null {
  if (times.alwaysUp) {
    return "The Sun stays above the horizon during this solar day (polar day).";
  }

  if (times.alwaysDown) {
    return "The Sun stays below the horizon during this solar day (polar night).";
  }

  if (!times.sunrise || !times.sunset) {
    return "Sunrise or sunset does not occur during this solar day.";
  }

  return null;
}

function calculateMoonriseOrMoonsetNote(
  times: SunCalc.MoonTimes,
): string | null {
  if (times.alwaysUp) {
    return "The Moon stays above the horizon throughout this solar day.";
  }

  if (times.alwaysDown) {
    return "The Moon stays below the horizon throughout this solar day.";
  }

  if (!times.rise && !times.set) {
    return "No moonrise or moonset is calculated during this solar day.";
  }

  if (!times.rise) {
    return "No moonrise is calculated during this solar day.";
  }

  if (!times.set) {
    return "No moonset is calculated during this solar day.";
  }

  return null;
}

export function calculateAstronomicalInsights(
  coordinates: GeographicCoordinates,
  date: Date,
): AstronomicalInsights {
  const { latitude, longitude } = coordinates;

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new RangeError("Coordinates must be valid latitude and longitude.");
  }

  if (!isValidDate(date)) {
    throw new RangeError("A valid date is required for astronomical calculations.");
  }

  const solarPosition = SunCalc.getPosition(date, latitude, longitude);
  const solarTimes = SunCalc.getTimes(date, latitude, longitude);
  const lunarIllumination = SunCalc.getMoonIllumination(date);
  const lunarTimes = SunCalc.getMoonTimes(date, latitude, longitude);
  const phaseIndex = Math.round(lunarIllumination.phase * moonPhaseNames.length);

  return {
    calculatedAt: new Date(date.getTime()),
    solar: {
      sunrise: solarTimes.sunrise ?? null,
      sunset: solarTimes.sunset ?? null,
      sunriseOrSunsetNote: calculateSunriseOrSunsetNote(solarTimes),
      altitudeDegrees: solarPosition.altitude,
      azimuthDegrees: solarPosition.azimuth,
      sunlightCondition: classifySunlight(solarPosition.altitude),
    },
    lunar: {
      phase: moonPhaseNames[phaseIndex % moonPhaseNames.length],
      illuminatedPercent: Math.round(lunarIllumination.fraction * 100),
      moonrise: lunarTimes.rise ?? null,
      moonset: lunarTimes.set ?? null,
      moonriseOrMoonsetNote: calculateMoonriseOrMoonsetNote(lunarTimes),
    },
  };
}

export function formatAstronomicalTime(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

export function getMoonEventDescription(
  event: "moonrise" | "moonset",
  note: string | null,
): string {
  if (note?.includes("above the horizon")) {
    return "Moon stays above the horizon";
  }

  if (note?.includes("below the horizon")) {
    return "Moon stays below the horizon";
  }

  if (event === "moonrise") {
    return "No moonrise this solar day";
  }

  return "No moonset this solar day";
}
