import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchNearEarthCloseApproaches } from "./nasaNeoApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

const nearEarthObject = {
  id: "543210",
  neo_reference_id: "543210",
  name: "(2027 AB)",
  nasa_jpl_url: "https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=543210",
  is_potentially_hazardous_asteroid: true,
  close_approach_data: [
    {
      epoch_date_close_approach: 1_798_000_000_000,
      orbiting_body: "Earth",
      miss_distance: {
        astronomical: "0.0125",
        lunar: "4.86",
      },
      relative_velocity: { kilometers_per_second: "8.7" },
    },
  ],
};

describe("fetchNearEarthCloseApproaches", () => {
  it("parses close approaches and labels the API epoch as UTC", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        element_count: 1,
        near_earth_objects: { "2027-01-03": [nearEarthObject] },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchNearEarthCloseApproaches(
      "2027-01-01",
      "2027-01-07",
    );

    expect(result.events).toHaveLength(1);
    expect(result.events[0]).toMatchObject({
      title: "(2027 AB) close approach",
      category: "asteroid-close-approach",
      timeZoneLabel: "UTC",
      objects: ["(2027 AB)"],
    });
    expect(result.events[0].details).toContain("4.9 lunar distances");
    expect(result.events[0].whyInteresting).toContain(
      "does not mean the object is expected to impact Earth",
    );
    expect(result.sourceRecordCount).toBe(1);

    const requestUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestUrl.searchParams.get("start_date")).toBe("2027-01-01");
    expect(requestUrl.searchParams.get("end_date")).toBe("2027-01-07");
    expect(requestUrl.searchParams.get("api_key")).toBe("DEMO_KEY");
  });

  it("excludes objects outside the close-approach threshold and malformed rows", async () => {
    const distantObject = {
      ...nearEarthObject,
      id: "distant",
      close_approach_data: [
        {
          ...nearEarthObject.close_approach_data[0],
          miss_distance: { astronomical: "0.06", lunar: "23.4" },
        },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          near_earth_objects: {
            "2027-01-01": [distantObject, null, { name: "incomplete" }],
          },
        }),
      }),
    );

    await expect(
      fetchNearEarthCloseApproaches("2027-01-01", "2027-01-07"),
    ).resolves.toMatchObject({ events: [], sourceRecordCount: 3 });
  });

  it("handles empty results and reports service or rate-limit errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ near_earth_objects: {} }),
      }),
    );
    await expect(
      fetchNearEarthCloseApproaches("2027-01-01", "2027-01-07"),
    ).resolves.toMatchObject({ events: [], sourceRecordCount: 0 });

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 429 }),
    );
    await expect(
      fetchNearEarthCloseApproaches("2027-01-01", "2027-01-07"),
    ).rejects.toThrow("request limit reached");
  });

  it("rejects invalid and overlong ranges without a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchNearEarthCloseApproaches("2027-02-30", "2027-03-01"),
    ).rejects.toThrow(RangeError);
    await expect(
      fetchNearEarthCloseApproaches("2027-01-01", "2027-01-08"),
    ).rejects.toThrow("up to seven days");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
