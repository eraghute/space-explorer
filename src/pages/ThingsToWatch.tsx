import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CalendarNavigation from "../components/CalendarNavigation";
import SpaceEventCalendarView from "../components/SpaceEventCalendarView";
import SpaceEventDetailsDialog from "../components/SpaceEventDetailsDialog";
import { fetchNearEarthCloseApproaches } from "../api/nasaNeoApi";
import { curatedSpaceEvents } from "../data/curatedSpaceEvents";
import type {
  CalendarView,
  EventCategory,
  EventTimeFilter,
  SpaceEvent,
} from "../interface/spaceEventModel";
import {
  filterSpaceEvents,
  addCalendarDays,
  getCalendarRange,
  getPeriodLabel,
  navigateCalendarDate,
  selectEventsInRange,
  toDateKey,
} from "../utils/spaceEventCalendar";
import { eventCategoryPresentation } from "../utils/spaceEventPresentation";
import "../App.css";

const CATEGORY_OPTIONS: { value: EventCategory; label: string }[] = [
  { value: "eclipse", label: eventCategoryPresentation.eclipse.label },
  {
    value: "meteor-shower",
    label: eventCategoryPresentation["meteor-shower"].label,
  },
  {
    value: "planetary-conjunction",
    label: eventCategoryPresentation["planetary-conjunction"].label,
  },
  {
    value: "planetary-opposition",
    label: eventCategoryPresentation["planetary-opposition"].label,
  },
  {
    value: "asteroid-close-approach",
    label: eventCategoryPresentation["asteroid-close-approach"].label,
  },
  { value: "other", label: eventCategoryPresentation.other.label },
];

function ThingsToWatch() {
  const [todayKey] = useState(() => toDateKey(new Date()));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [view, setView] = useState<CalendarView>("monthly");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [timeFilter, setTimeFilter] = useState<EventTimeFilter>("all");
  const [selectedEvent, setSelectedEvent] = useState<SpaceEvent | null>(null);

  const apiStartDate = todayKey;
  const apiEndDate = addCalendarDays(todayKey, 6);
  const {
    data: closeApproachResult,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["space-events-neows", apiStartDate, apiEndDate],
    queryFn: ({ signal }) =>
      fetchNearEarthCloseApproaches(apiStartDate, apiEndDate, signal),
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
    retry: false,
  });

  const calendarRange = useMemo(
    () => getCalendarRange(selectedDate, view),
    [selectedDate, view],
  );
  const eventsForRange = useMemo(() => {
    const allEvents = [
      ...curatedSpaceEvents,
      ...(closeApproachResult?.events ?? []),
    ];
    return selectEventsInRange(allEvents, calendarRange).sort((left, right) =>
      left.startDate.localeCompare(right.startDate),
    );
  }, [
    calendarRange,
    closeApproachResult?.events,
  ]);

  const filteredEvents = useMemo(
    () =>
      filterSpaceEvents(eventsForRange, {
        query: search,
        category,
        time: timeFilter,
        today: todayKey,
      }),
    [eventsForRange, search, category, timeFilter, todayKey],
  );

  const periodLabel = getPeriodLabel(selectedDate, view);
  const filtersAreActive =
    search.length > 0 || category !== "all" || timeFilter !== "all";

  const closeDetails = useCallback(() => setSelectedEvent(null), []);
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setTimeFilter("all");
  };

  return (
    <main className="container py-5 things-to-watch-page">
      <header className="hero-section text-center things-to-watch-hero">
        <span className="eyebrow">THE NIGHT SKY • YOUR CALENDAR</span>
        <h1 className="display-3 fw-bold mt-3">Things to Watch</h1>
        <p className="hero-subtitle mx-auto">
          A guide to notable celestial events, with dates and observing notes
          from astronomy sources.
        </p>
      </header>

      <section className="events-source-note" aria-label="Event data sources">
        <span className="events-source-orbit" aria-hidden="true">✦</span>
        <div>
          <strong>Verified predictions, clearly labeled.</strong>
          <p>
            Eclipses and selected meteor peaks are curated from NASA sources;
            asteroid close approaches come live from NASA's NeoWs feed. The
            event source period is shown in each detail view.
          </p>
        </div>
      </section>

      <CalendarNavigation
        view={view}
        periodLabel={periodLabel}
        isToday={selectedDate === todayKey}
        onViewChange={setView}
        onMove={(direction) =>
          setSelectedDate((date) => navigateCalendarDate(date, view, direction))
        }
        onToday={() => setSelectedDate(todayKey)}
      />

      <section className="events-filter-panel" aria-label="Search and filter events">
        <div className="events-search-control">
          <label htmlFor="events-search">Search events</label>
          <input
            id="events-search"
            className="form-control"
            type="search"
            value={search}
            placeholder="Event name or object"
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="events-category">Category</label>
          <select
            id="events-category"
            className="form-select"
            value={category}
            onChange={(event) => {
              const value = event.target.value;
              setCategory(
                value === "all" || isEventCategory(value) ? value : "all",
              );
            }}
          >
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="events-time-filter">Date range</label>
          <select
            id="events-time-filter"
            className="form-select"
            value={timeFilter}
            onChange={(event) =>
              setTimeFilter(
                isEventTimeFilter(event.target.value)
                  ? event.target.value
                  : "all",
              )
            }
          >
            <option value="all">Past and upcoming</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <button
          className="events-clear-button"
          type="button"
          onClick={clearFilters}
          disabled={!filtersAreActive}
        >
          Clear filters
        </button>
      </section>

      <div className="events-results-heading">
        <h2>{view === "yearly" ? `Year at a glance` : "Sky events"}</h2>
        <span aria-live="polite">
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"} in this view
        </span>
      </div>

      {isLoading && (
        <p className="events-data-status" role="status">
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          Loading NASA near-Earth object data…
        </p>
      )}
      {isError && (
        <div className="events-api-warning" role="alert">
          <strong>Live asteroid data is temporarily unavailable.</strong>{" "}
          {error instanceof Error
            ? error.message
            : "Please try again later."}{" "}
          Curated eclipse and meteor-shower entries are still available.
          <button
            className="events-api-retry"
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying…" : "Retry live data"}
          </button>
        </div>
      )}
      <p className="events-api-note">
        Live asteroid results cover {apiStartDate} through {apiEndDate} only
        (NASA's seven-day feed), and this calendar shows only approaches within
        0.05 AU. Far-future close approaches are not inferred. The public
        DEMO_KEY is rate-limited; results are cached for six hours.
      </p>
      {closeApproachResult && (
        <p className="events-api-note">
          NASA NeoWs returned {closeApproachResult.sourceRecordCount} near-Earth
          object records for its feed window; the calendar filters these to
          close approaches within 0.05 AU.
        </p>
      )}

      {filteredEvents.length === 0 && !isLoading && (
        <div className="events-empty-state">
          <span aria-hidden="true">✦</span>
          <h3>No events match this view</h3>
          <p>
            Try another date, broaden your filters, or check back when more
            verified predictions are available for this period.
          </p>
          {filtersAreActive && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>
      )}
      <SpaceEventCalendarView
        dateKey={selectedDate}
        view={view}
        events={filteredEvents}
        todayKey={todayKey}
        onSelectDate={(date) => {
          setSelectedDate(date);
          setView(view === "yearly" ? "monthly" : "daily");
        }}
        onSelectEvent={setSelectedEvent}
      />

      <footer className="events-page-footnote">
        <p>
          Times retain the time standard specified by the source (NASA eclipse
          times use TD; NASA close-approach epochs use UTC), not a guessed local
          timezone;
          meteor-shower entries give a local peak night rather than a fabricated
          global time. Visibility is not personalized to your location.
        </p>
        <p>
          Planetary conjunction and opposition predictions are not included yet
          because this version does not have a verified, maintained event
          calendar for those categories.
        </p>
      </footer>

      {selectedEvent && (
        <SpaceEventDetailsDialog
          event={selectedEvent}
          onClose={closeDetails}
        />
      )}
    </main>
  );
}

function isEventCategory(value: string): value is EventCategory {
  return CATEGORY_OPTIONS.some((item) => item.value === value);
}

function isEventTimeFilter(value: string): value is EventTimeFilter {
  return value === "all" || value === "upcoming" || value === "past";
}

export default ThingsToWatch;
