import { useEffect, useRef } from "react";
import type { SpaceEvent } from "../interface/spaceEventModel";
import {
  confidencePresentation,
  eventCategoryPresentation,
} from "../utils/spaceEventPresentation";
import { formatDateKey } from "../utils/spaceEventCalendar";

interface SpaceEventDetailsDialogProps {
  event: SpaceEvent;
  onClose: () => void;
}

export default function SpaceEventDetailsDialog({
  event,
  onClose,
}: SpaceEventDetailsDialogProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const category = eventCategoryPresentation[event.category];
  const displayEndDate =
    event.endDate && event.endDate !== event.startDate
      ? ` – ${formatDateKey(event.endDate)}`
      : "";
  const timeLabel =
    event.time && event.timeZoneLabel
      ? `${event.time} ${event.timeZoneLabel}`
      : event.timeDescription;

  useEffect(() => {
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="space-event-dialog-backdrop"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="space-event-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="space-event-dialog-title"
        aria-describedby="space-event-dialog-summary"
      >
        <div className="space-event-dialog-header">
          <div>
            <span className={`space-event-category space-event-category--${event.category}`}>
              <span aria-hidden="true">{category.icon}</span> {category.label}
            </span>
            <h2 id="space-event-dialog-title">{event.title}</h2>
          </div>
          <button
            ref={closeButtonRef}
            className="events-icon-button"
            type="button"
            aria-label="Close event details"
            onClick={onClose}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="space-event-dialog-body">
          <p id="space-event-dialog-summary">{event.summary}</p>
          <dl className="space-event-detail-grid">
            <div>
              <dt>
                {event.timeZoneLabel === "UTC"
                  ? "Date (UTC)"
                  : event.timeZoneLabel?.startsWith("TD ")
                    ? "Date (TD)"
                    : "Date"}
              </dt>
              <dd>
                {formatDateKey(event.startDate)}
                {displayEndDate}
              </dd>
            </div>
            {timeLabel && (
              <div>
                <dt>Time</dt>
                <dd>{timeLabel}</dd>
              </div>
            )}
            <div>
              <dt>Prediction status</dt>
              <dd>{confidencePresentation[event.confidence]}</dd>
            </div>
            <div>
              <dt>Visibility</dt>
              <dd>{event.visibility}</dd>
            </div>
            <div>
              <dt>Objects</dt>
              <dd>
                {event.objects && event.objects.length > 0
                  ? event.objects.join(", ")
                  : "Not specified"}
              </dd>
            </div>
            <div>
              <dt>Source period</dt>
              <dd>{event.predictionPeriod}</dd>
            </div>
          </dl>

          <section>
            <h3>Why it’s interesting</h3>
            <p>{event.whyInteresting}</p>
          </section>
          <section>
            <h3>How to observe</h3>
            <p>{event.viewingGuidance}</p>
          </section>
          {event.details && (
            <section>
              <h3>More detail</h3>
              <p>{event.details}</p>
            </section>
          )}
          <p className="space-event-visibility-note">
            {event.visibilityScope === "worldwide"
              ? "The event itself is global; observing it may still depend on local sky conditions."
              : event.visibilityScope === "regional"
                ? "Visibility is limited to the regions described above."
                : "Visibility depends on the observer's location and sky conditions; this page does not determine your local view."}
          </p>
        </div>

        <footer className="space-event-dialog-footer">
          <span>{event.sourceAttribution}</span>
          <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
            Open authoritative source
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </footer>
      </section>
    </div>
  );
}
