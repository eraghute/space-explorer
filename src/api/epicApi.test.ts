import { describe, it, expect, vi } from "vitest";
import { fetchEpicImages, getEpicImageUrl } from "./epicApi";

describe("getEpicImageUrl", () => {
  it("returns the correct URL for a known EPIC image ID", () => {
    const mockEpicImage = {
      identifier: "20261014001752",
      caption:
        "This image was taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft",
      image: "epic_1b_20261014001752",
      version: "04",
      centroid_coordinates: {
        lat: 1.311035,
        lon: 166.589355,
      },
      dscovr_j2000_position: {
        x: -1515132.618751,
        y: -354199.727228,
        z: 39726.584288,
      },
      lunar_j2000_position: {
        x: -203576.157397,
        y: -299926.293759,
        z: -168714.016126,
      },
      sun_j2000_position: {
        x: -139972255.66229,
        y: -47517504.59984,
        z: -20597429.199931,
      },
      attitude_quaternions: {
        q0: -0.263314,
        q1: -0.017974,
        q2: 0.113778,
        q3: 0.957806,
      },
      date: "2026-10-14 00:13:03",
      coords: {
        centroid_coordinates: {
          lat: 1.311035,
          lon: 166.589355,
        },
        dscovr_j2000_position: {
          x: -1515132.618751,
          y: -354199.727228,
          z: 39726.584288,
        },
        lunar_j2000_position: {
          x: -203576.157397,
          y: -299926.293759,
          z: -168714.016126,
        },
        sun_j2000_position: {
          x: -139972255.66229,
          y: -47517504.59984,
          z: -20597429.199931,
        },
        attitude_quaternions: {
          q0: -0.263314,
          q1: -0.017974,
          q2: 0.113778,
          q3: 0.957806,
        },
      },
    };
    expect(getEpicImageUrl(mockEpicImage)).toBe(
      "https://api.nasa.gov/EPIC/archive/natural/2026/10/14/png/epic_1b_20261014001752.png?api_key=DEMO_KEY",
    );
  });
});

describe("fetchEpicImages", () => {
  it("returns the correct image data when the API request succeeds", async () => {
    const mockResponse = [
      {
        identifier: "20261014001752",
        image: "epic_1b_20261014001752",
      },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }),
    );
    const result = await fetchEpicImages();

    expect(result).toEqual(mockResponse);
  });

  it("returns error when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );
    await expect(fetchEpicImages()).rejects.toThrow(
      "Failed to fetch EPIC images",
    );
  });
});
