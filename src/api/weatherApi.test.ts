import { describe, it, expect, vi } from "vitest";
import {
  fetchLondonWeather,
  getWeatherDescription,
  getWeatherIcon,
} from "./weatherApi";

describe("getWeatherDescription", () => {
  it("returns the correct description for a known weather code", () => {
    expect(getWeatherDescription(0)).toBe("Clear sky");
  });

  it("returns a fallback for an unknown weather code", () => {
    expect(getWeatherDescription(5325)).toBe("Unknown conditions");
  });
});

describe("getWeatherIcon", () => {
  it("returns the correct description for a known weather code", () => {
    expect(getWeatherIcon(64)).toBe("🌧️");
  });

  it("returns a fallback for an unknown weather code", () => {
    expect(getWeatherIcon(4)).toBe("🌡️");
  });
});

describe("fetchLondonWeather", () => {
  it("returns weather data when the API request succeeds", async () => {
    const mockResponse = {
      current: {
        time: "2026-10-16T18:00",
        interval: 900,
        temperature_2m: 13.4,
        relative_humidity_2m: 52,
        weather_code: 0,
      },
    };

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }),
    );

    const result = await fetchLondonWeather();

    expect(result).toEqual(mockResponse);
  });

  it("returns error when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );
    await expect(fetchLondonWeather()).rejects.toThrow(
      "Failed to fetch London weather",
    );
  });
});
