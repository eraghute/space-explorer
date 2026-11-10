import { describe, expect, it } from "vitest";
import {
  calculateAstronomicalInsights,
  formatAstronomicalTime,
  getMoonEventDescription,
} from "./astronomicalInsights";

describe("calculateAstronomicalInsights", () => {
  it("calculates solar and lunar information for a mid-latitude location", () => {
    const calculatedAt = new Date("2026-10-19T12:00:00.000Z");
    const insights = calculateAstronomicalInsights(
      { latitude: 51.5, longitude: -0.1 },
      calculatedAt,
    );

    expect(insights.calculatedAt).toEqual(calculatedAt);
    expect(insights.solar.sunrise?.toISOString()).toBe(
      "2026-10-19T06:31:06.169Z",
    );
    expect(insights.solar.sunset?.toISOString()).toBe(
      "2026-10-19T16:58:49.510Z",
    );
    expect(insights.solar.altitudeDegrees).toBeGreaterThan(0);
    expect(insights.solar.azimuthDegrees).toBeGreaterThanOrEqual(0);
    expect(insights.solar.azimuthDegrees).toBeLessThan(360);
    expect(insights.solar.sunlightCondition).toBe("daylight");
    expect(insights.lunar.moonrise).toBeInstanceOf(Date);
    expect(insights.lunar.moonset).toBeInstanceOf(Date);
    expect(insights.lunar.phase).toBe("First Quarter");
    expect(insights.lunar.illuminatedPercent).toBe(58);
    expect(insights.lunar.moonriseOrMoonsetNote).toBeNull();
  });

  it("reports nighttime and formats calculation times explicitly in UTC", () => {
    const calculatedAt = new Date("2026-10-19T00:00:00.000Z");
    const insights = calculateAstronomicalInsights(
      { latitude: 51.5, longitude: -0.1 },
      calculatedAt,
    );

    expect(insights.solar.sunlightCondition).toBe("nighttime");
    expect(formatAstronomicalTime(insights.calculatedAt)).toBe(
      "19 Oct 2026, 00:00",
    );
  });

  it("identifies polar day and polar night when sunrise and sunset do not occur", () => {
    const polarDay = calculateAstronomicalInsights(
      { latitude: 89, longitude: 0 },
      new Date("2026-06-21T12:00:00.000Z"),
    );
    const polarNight = calculateAstronomicalInsights(
      { latitude: 89, longitude: 0 },
      new Date("2026-12-21T12:00:00.000Z"),
    );

    expect(polarDay.solar.sunrise).toBeNull();
    expect(polarDay.solar.sunset).toBeNull();
    expect(polarDay.solar.sunriseOrSunsetNote).toContain("polar day");
    expect(polarNight.solar.sunrise).toBeNull();
    expect(polarNight.solar.sunset).toBeNull();
    expect(polarNight.solar.sunriseOrSunsetNote).toContain("polar night");
  });

  it("explains when lunar rise and set events are absent", () => {
    const insights = calculateAstronomicalInsights(
      { latitude: 80, longitude: 0 },
      new Date("2026-10-19T12:00:00.000Z"),
    );

    expect(insights.lunar.moonrise).toBeNull();
    expect(insights.lunar.moonset).toBeNull();
    expect(insights.lunar.moonriseOrMoonsetNote).toContain(
      "below the horizon",
    );
    expect(
      getMoonEventDescription("moonrise", insights.lunar.moonriseOrMoonsetNote),
    ).toBe("Moon stays below the horizon");
  });

  it("rejects invalid coordinates and dates", () => {
    expect(() =>
      calculateAstronomicalInsights(
        { latitude: 91, longitude: 0 },
        new Date("2026-10-19T12:00:00.000Z"),
      ),
    ).toThrow(RangeError);
    expect(() =>
      calculateAstronomicalInsights(
        { latitude: 0, longitude: Number.NaN },
        new Date("2026-10-19T12:00:00.000Z"),
      ),
    ).toThrow(RangeError);
    expect(() =>
      calculateAstronomicalInsights(
        { latitude: 0, longitude: 0 },
        new Date(Number.NaN),
      ),
    ).toThrow(RangeError);
  });
});
