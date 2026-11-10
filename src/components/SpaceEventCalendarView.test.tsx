import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CalendarView, SpaceEvent } from "../interface/spaceEventModel";
import SpaceEventCalendarView from "./SpaceEventCalendarView";

const event: SpaceEvent = {
  id: "meteor-peak",
  title: "Eta Aquariid Meteor Shower",
  category: "meteor-shower",
  startDate: "2027-05-05",
  endDate: "2027-05-06",
  timeDescription: "Peak night, local dates",
  summary: "Predicted peak night.",
  whyInteresting: "Earth crosses a debris stream.",
  viewingGuidance: "Look from a dark place.",
  visibility: "Depends on location.",
  visibilityScope: "location-dependent",
  objects: ["Eta Aquariids"],
  confidence: "predicted-peak",
  sourceUrl: "https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/",
  sourceAttribution: "NASA Science",
  predictionPeriod: "2027",
};

describe("SpaceEventCalendarView", () => {
  it.each([
    ["daily", "2027-05-05"],
    ["weekly", "2027-05-06"],
    ["monthly", "2027-05-15"],
    ["yearly", "2027-07-01"],
  ] as const)(
    "shows matching events in the %s view",
    (view: CalendarView, dateKey: string) => {
      render(
        <SpaceEventCalendarView
          view={view}
          dateKey={dateKey}
          todayKey="2027-01-01"
          events={[event]}
          onSelectDate={() => undefined}
          onSelectEvent={() => undefined}
        />,
      );

      expect(
        screen.getAllByRole("button", {
          name: "View details for Eta Aquariid Meteor Shower",
        }).length,
      ).toBeGreaterThan(0);
    },
  );
});
