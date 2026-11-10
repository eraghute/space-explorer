import type { EventCategory, EventConfidence } from "../interface/spaceEventModel";

export const eventCategoryPresentation: Record<
  EventCategory,
  { label: string; icon: string }
> = {
  eclipse: { label: "Eclipse", icon: "🌘" },
  "meteor-shower": { label: "Meteor shower", icon: "☄️" },
  "planetary-conjunction": { label: "Conjunction", icon: "🪐" },
  "planetary-opposition": { label: "Opposition", icon: "🔭" },
  "asteroid-close-approach": { label: "Asteroid close approach", icon: "🛰️" },
  other: { label: "Notable event", icon: "✨" },
};

export const confidencePresentation: Record<EventConfidence, string> = {
  confirmed: "Confirmed prediction",
  approximate: "Approximate",
  "predicted-peak": "Predicted peak",
};
