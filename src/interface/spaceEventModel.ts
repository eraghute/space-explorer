export type EventCategory =
  | "eclipse"
  | "meteor-shower"
  | "planetary-conjunction"
  | "planetary-opposition"
  | "asteroid-close-approach"
  | "other";

export type EventConfidence =
  | "confirmed"
  | "approximate"
  | "predicted-peak";

export type VisibilityScope =
  | "worldwide"
  | "regional"
  | "location-dependent";

export interface SpaceEvent {
  id: string;
  title: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  time?: string;
  timeZoneLabel?: string;
  timeDescription?: string;
  summary: string;
  whyInteresting: string;
  viewingGuidance: string;
  visibility: string;
  visibilityScope: VisibilityScope;
  objects?: string[];
  confidence: EventConfidence;
  sourceUrl: string;
  sourceAttribution: string;
  predictionPeriod: string;
  details?: string;
}

export type CalendarView = "daily" | "weekly" | "monthly" | "yearly";

export type EventTimeFilter = "all" | "upcoming" | "past";

export interface CalendarRange {
  startDate: string;
  endDate: string;
}
