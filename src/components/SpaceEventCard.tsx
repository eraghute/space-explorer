import type { SpaceEvent } from "../interface/spaceEventModel";
import {
  confidencePresentation,
  eventCategoryPresentation,
} from "../utils/spaceEventPresentation";

interface SpaceEventCardProps {
  event: SpaceEvent;
  onSelect: (event: SpaceEvent) => void;
  compact?: boolean;
}

export default function SpaceEventCard({
  event,
  onSelect,
  compact = false,
}: SpaceEventCardProps) {
  const category = eventCategoryPresentation[event.category];

  return (
    <button
      className={`space-event-card${compact ? " space-event-card--compact" : ""}`}
      type="button"
      onClick={() => onSelect(event)}
      aria-label={`View details for ${event.title}`}
      aria-haspopup="dialog"
    >
      <span
        className={`space-event-category space-event-category--${event.category}`}
      >
        <span aria-hidden="true">{category.icon}</span> {category.label}
      </span>
      <span className="space-event-card-title">{event.title}</span>
      {!compact && <span className="space-event-card-summary">{event.summary}</span>}
      <span className="space-event-confidence">
        {confidencePresentation[event.confidence]}
      </span>
    </button>
  );
}
