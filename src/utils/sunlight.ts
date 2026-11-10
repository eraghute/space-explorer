export type SunlightCondition = "daylight" | "twilight" | "nighttime";

export function classifySunlight(
  solarElevationDegrees: number,
): SunlightCondition {
  if (solarElevationDegrees >= 0) return "daylight";
  if (solarElevationDegrees >= -6) return "twilight";
  return "nighttime";
}
