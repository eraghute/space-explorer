import { describe, expect, it } from "vitest";
import type { SpaceEvent } from "../interface/spaceEventModel";
import {
  filterSpaceEvents,
  getCalendarRange,
  getMonthGridDates,
  isDateKey,
  navigateCalendarDate,
  selectEventsInRange,
} from "./spaceEventCalendar";

const events: SpaceEvent[] = [
  {
    id: "cross-year-shower",
    title: "Quadrantid Meteor Shower",
    category: "meteor-shower",
    startDate: "2026-12-31",
    endDate: "2027-01-01",
    summary: "Peak night for this meteor shower.",
    whyInteresting: "A recurring meteor shower.",
    viewingGuidance: "Find a dark sky.",
    visibility: "Location dependent.",
    visibilityScope: "location-dependent",
    objects: ["Quadrantids"],
    confidence: "predicted-peak",
    sourceUrl: "https://example.org/source",
    sourceAttribution: "Example source",
    predictionPeriod: "2026–2027",
  },
  {
    id: "mars",
    title: "Mars Retrograde",
    category: "other",
    startDate: "2027-01-10",
    summary: "Mars appears to reverse direction.",
    whyInteresting: "A perspective effect.",
    viewingGuidance: "Look before dawn.",
    visibility: "Depends on location.",
    visibilityScope: "location-dependent",
    confidence: "approximate",
    sourceUrl: "https://example.org/mars",
    sourceAttribution: "Example source",
    predictionPeriod: "2027",
  },
  {
    id: "eclipse",
    title: "Lunar Eclipse",
    category: "eclipse",
    startDate: "2027-08-17",
    summary: "A lunar eclipse.",
    whyInteresting: "Earth's shadow crosses the Moon.",
    viewingGuidance: "Observe the Moon.",
    visibility: "Regional.",
    visibilityScope: "regional",
    confidence: "confirmed",
    sourceUrl: "https://example.org/eclipse",
    sourceAttribution: "Example source",
    predictionPeriod: "2027",
  },
];

describe("navigateCalendarDate", () => {
  it("moves daily and weekly dates across month and year boundaries", () => {
    expect(navigateCalendarDate("2026-12-31", "daily", 1)).toBe("2027-01-01");
    expect(navigateCalendarDate("2026-12-28", "weekly", 1)).toBe("2027-01-04");
  });

  it("clamps month movement to the last valid day", () => {
    expect(navigateCalendarDate("2027-01-31", "monthly", 1)).toBe("2027-02-28");
    expect(navigateCalendarDate("2028-01-31", "monthly", 1)).toBe("2028-02-29");
  });

  it("handles leap-day navigation between years", () => {
    expect(navigateCalendarDate("2028-02-29", "yearly", 1)).toBe("2029-02-28");
    expect(navigateCalendarDate("2027-12-31", "yearly", 1)).toBe("2028-12-31");
  });
});

describe("calendar event ranges", () => {
  it("uses Monday-to-Sunday weeks and correct calendar period boundaries", () => {
    expect(getCalendarRange("2027-01-01", "weekly")).toEqual({
      startDate: "2026-12-28",
      endDate: "2027-01-03",
    });
    expect(getCalendarRange("2028-02-12", "monthly")).toEqual({
      startDate: "2028-02-01",
      endDate: "2028-02-29",
    });
    expect(getCalendarRange("2028-02-12", "yearly")).toEqual({
      startDate: "2028-01-01",
      endDate: "2028-12-31",
    });
  });

  it("includes events in the correct daily, weekly, monthly, and yearly views", () => {
    const views = [
      getCalendarRange("2027-01-01", "daily"),
      getCalendarRange("2027-01-02", "weekly"),
      getCalendarRange("2027-01-15", "monthly"),
      getCalendarRange("2027-06-01", "yearly"),
    ];
    for (const range of views) {
      expect(selectEventsInRange(events, range).map((event) => event.id)).toContain(
        "cross-year-shower",
      );
    }
    expect(
      selectEventsInRange(events, getCalendarRange("2027-01-10", "daily")).map(
        (event) => event.id,
      ),
    ).toContain("mars");
  });

  it("builds a complete month grid across month and year boundaries", () => {
    const grid = getMonthGridDates("2027-01-15");
    expect(grid[0]).toBe("2026-12-28");
    expect(grid.at(-1)).toBe("2027-01-31");
    expect(grid).toHaveLength(35);
  });
});

describe("filterSpaceEvents", () => {
  it("combines search, category, and upcoming or past date filters", () => {
    expect(
      filterSpaceEvents(events, {
        query: "quadrantids",
        category: "meteor-shower",
        time: "upcoming",
        today: "2027-01-01",
      }).map((event) => event.id),
    ).toEqual(["cross-year-shower"]);
    expect(
      filterSpaceEvents(events, {
        category: "eclipse",
        time: "past",
        today: "2027-08-18",
      }).map((event) => event.id),
    ).toEqual(["eclipse"]);
  });

  it("searches event titles and celestial objects and tolerates missing optional fields", () => {
    expect(
      filterSpaceEvents(events, {
        query: "mars",
        today: "2027-01-01",
      }).map((event) => event.id),
    ).toEqual(["mars"]);
    expect(
      filterSpaceEvents(events, {
        query: "lunar",
        today: "2027-01-01",
      }).map((event) => event.id),
    ).toEqual(["eclipse"]);
  });

  it("drops invalid event dates and returns an empty result when nothing matches", () => {
    const invalidEvent = {
      ...events[0],
      id: "invalid",
      startDate: "2027-02-30",
      endDate: "not-a-date",
    };
    expect(
      filterSpaceEvents([invalidEvent], {
        today: "2027-01-01",
      }),
    ).toEqual([]);
    expect(
      filterSpaceEvents([], {
        today: "2027-01-01",
      }),
    ).toEqual([]);
    expect(isDateKey("2028-02-29")).toBe(true);
    expect(isDateKey("2027-02-29")).toBe(false);
  });
});
