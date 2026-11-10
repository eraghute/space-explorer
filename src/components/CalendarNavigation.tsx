import type { CalendarView } from "../interface/spaceEventModel";

interface CalendarNavigationProps {
  view: CalendarView;
  periodLabel: string;
  isToday: boolean;
  onViewChange: (view: CalendarView) => void;
  onMove: (direction: -1 | 1) => void;
  onToday: () => void;
}

const views: { value: CalendarView; label: string }[] = [
  { value: "daily", label: "Day" },
  { value: "weekly", label: "Week" },
  { value: "monthly", label: "Month" },
  { value: "yearly", label: "Year" },
];

export default function CalendarNavigation({
  view,
  periodLabel,
  isToday,
  onViewChange,
  onMove,
  onToday,
}: CalendarNavigationProps) {
  return (
    <section className="events-calendar-toolbar" aria-label="Calendar controls">
      <div className="events-period-navigation">
        <button
          className="events-icon-button"
          type="button"
          aria-label={`Previous ${view} period`}
          onClick={() => onMove(-1)}
        >
          <span aria-hidden="true">←</span>
        </button>
        <h2 className="events-period-title" aria-live="polite">
          {periodLabel}
        </h2>
        <button
          className="events-icon-button"
          type="button"
          aria-label={`Next ${view} period`}
          onClick={() => onMove(1)}
        >
          <span aria-hidden="true">→</span>
        </button>
        <button
          className="events-today-button"
          type="button"
          onClick={onToday}
          disabled={isToday}
        >
          Today
        </button>
      </div>

      <div className="events-view-switcher" role="group" aria-label="Calendar view">
        {views.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`events-view-button${view === item.value ? " is-active" : ""}`}
            aria-pressed={view === item.value}
            onClick={() => onViewChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
