import type {
  CalendarRange,
  CalendarView,
  SpaceEvent,
} from "../interface/spaceEventModel";
import {
  dateFromKey,
  formatDateKey,
  getCalendarRange,
  getMonthGridDates,
  getMonthName,
  isDateWithinMonth,
  selectEventsInRange,
} from "../utils/spaceEventCalendar";
import SpaceEventCard from "./SpaceEventCard";

interface SpaceEventCalendarViewProps {
  dateKey: string;
  view: CalendarView;
  events: readonly SpaceEvent[];
  todayKey: string;
  onSelectDate: (dateKey: string) => void;
  onSelectEvent: (event: SpaceEvent) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function SpaceEventCalendarView({
  dateKey,
  view,
  events,
  todayKey,
  onSelectDate,
  onSelectEvent,
}: SpaceEventCalendarViewProps) {
  if (view === "daily") {
    return (
      <section className="events-list-view" aria-label="Events for the selected day">
        <h3>{formatDateKey(dateKey, { weekday: "long" })}</h3>
        {events.length === 0 ? (
          <p className="events-empty-inline">No matching events on this date.</p>
        ) : (
          events.map((event) => (
            <SpaceEventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
            />
          ))
        )}
      </section>
    );
  }

  if (view === "weekly") {
    const range = getCalendarRange(dateKey, "weekly");
    const days = getDateKeys(range);
    return (
      <section className="events-week-view" aria-label="Events for the selected week">
        {days.map((day) => {
          const dayEvents = eventsOnDate(events, day);
          return (
            <div className="events-week-day" key={day}>
              <button
                className="events-day-heading"
                type="button"
                onClick={() => onSelectDate(day)}
              >
                <span>{formatDateKey(day, { weekday: "long" })}</span>
                <span>{formatDateKey(day, { month: "short", day: "numeric" })}</span>
              </button>
              {dayEvents.length === 0 ? (
                <p className="events-empty-inline">No matching events</p>
              ) : (
                <div className="events-week-items">
                  {dayEvents.map((event) => (
                    <SpaceEventCard
                      key={`${event.id}-${day}`}
                      event={event}
                      onSelect={onSelectEvent}
                      compact
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    );
  }

  if (view === "monthly") {
    const gridDates = getMonthGridDates(dateKey);
    const selectedDate = dateFromKey(dateKey);
    return (
      <section className="events-month-view" aria-label="Monthly calendar">
        <div className="events-month-grid">
          {WEEKDAYS.map((weekday) => (
            <div className="events-weekday-heading" key={weekday}>
              {weekday}
            </div>
          ))}
          {gridDates.map((day) => {
            const dayEvents = eventsOnDate(events, day);
            const inMonth = isDateWithinMonth(
              day,
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
            );
            const today = day === todayKey;
            return (
              <div
                className={`events-month-cell${inMonth ? "" : " is-outside-month"}${today ? " is-today" : ""}`}
                key={day}
              >
                <button
                  className="events-month-date"
                  type="button"
                  aria-label={`Show events on ${formatDateKey(day)}`}
                  onClick={() => onSelectDate(day)}
                >
                  {dateFromKey(day).getDate()}
                </button>
                <div className="events-month-items">
                  {dayEvents.slice(0, 3).map((event) => (
                    <SpaceEventCard
                      key={`${event.id}-${day}`}
                      event={event}
                      onSelect={onSelectEvent}
                      compact
                    />
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="events-more-count">
                      +{dayEvents.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  const year = dateFromKey(dateKey).getFullYear();
  return (
    <section className="events-year-view" aria-label={`Events overview for ${year}`}>
      {Array.from({ length: 12 }, (_, month) => {
        const monthStart = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const monthRange = getCalendarRange(monthStart, "monthly");
        const monthEvents = selectEventsInRange(events, monthRange);
        return (
          <article className="events-year-month" key={month}>
            <button
              className="events-year-month-button"
              type="button"
              onClick={() => onSelectDate(monthStart)}
            >
              <span>{getMonthName(year, month)}</span>
              <span className="events-month-count">
                {monthEvents.length} {monthEvents.length === 1 ? "event" : "events"}
              </span>
            </button>
            {monthEvents.length === 0 ? (
              <p className="events-empty-inline">No listed events</p>
            ) : (
              <div className="events-year-items">
                {monthEvents.slice(0, 3).map((event) => (
                  <SpaceEventCard
                    key={event.id}
                    event={event}
                    onSelect={onSelectEvent}
                    compact
                  />
                ))}
                {monthEvents.length > 3 && (
                  <span className="events-more-count">
                    +{monthEvents.length - 3} more
                  </span>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

function eventsOnDate(
  events: readonly SpaceEvent[],
  dateKey: string,
): SpaceEvent[] {
  return selectEventsInRange(events, { startDate: dateKey, endDate: dateKey });
}

function getDateKeys(range: CalendarRange): string[] {
  const start = dateFromKey(range.startDate);
  const end = dateFromKey(range.endDate);
  const days: string[] = [];
  for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, "0");
    const day = String(current.getDate()).padStart(2, "0");
    days.push(`${year}-${month}-${day}`);
  }
  return days;
}
