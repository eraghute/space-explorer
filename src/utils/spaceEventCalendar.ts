import type {
  CalendarRange,
  CalendarView,
  EventCategory,
  EventTimeFilter,
  SpaceEvent,
} from "../interface/spaceEventModel";

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromKey(dateKey: string): Date {
  if (!isDateKey(dateKey)) {
    throw new RangeError(`Invalid calendar date: ${dateKey}`);
  }
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addCalendarDays(dateKey: string, days: number): string {
  if (!Number.isInteger(days)) {
    throw new RangeError("Calendar day offset must be an integer.");
  }
  const date = dateFromKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function isDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function navigateCalendarDate(
  dateKey: string,
  view: CalendarView,
  direction: -1 | 1,
): string {
  const date = dateFromKey(dateKey);
  if (view === "daily") return addCalendarDays(dateKey, direction);
  if (view === "weekly") return addCalendarDays(dateKey, direction * 7);
  if (view === "monthly") {
    const day = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + direction);
    date.setDate(Math.min(day, daysInMonth(date.getFullYear(), date.getMonth())));
  }
  if (view === "yearly") {
    const month = date.getMonth();
    const day = date.getDate();
    date.setDate(1);
    date.setFullYear(date.getFullYear() + direction);
    date.setMonth(month);
    date.setDate(Math.min(day, daysInMonth(date.getFullYear(), month)));
  }
  return toDateKey(date);
}

export function getCalendarRange(
  dateKey: string,
  view: CalendarView,
): CalendarRange {
  const date = dateFromKey(dateKey);
  if (view === "daily") {
    return { startDate: dateKey, endDate: dateKey };
  }
  if (view === "weekly") {
    const mondayOffset = (date.getDay() + 6) % 7;
    date.setDate(date.getDate() - mondayOffset);
    const startDate = toDateKey(date);
    date.setDate(date.getDate() + 6);
    return { startDate, endDate: toDateKey(date) };
  }
  if (view === "monthly") {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      startDate: toDateKey(new Date(year, month, 1)),
      endDate: toDateKey(new Date(year, month + 1, 0)),
    };
  }
  return {
    startDate: toDateKey(new Date(date.getFullYear(), 0, 1)),
    endDate: toDateKey(new Date(date.getFullYear(), 11, 31)),
  };
}

export function getMonthGridDates(dateKey: string): string[] {
  const date = dateFromKey(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const cellCount =
    Math.ceil((mondayOffset + daysInMonth(year, month)) / 7) * 7;
  return Array.from({ length: cellCount }, (_, index) => {
    const cell = new Date(year, month, 1 - mondayOffset + index);
    return toDateKey(cell);
  });
}

export function selectEventsInRange(
  events: readonly SpaceEvent[],
  range: CalendarRange,
): SpaceEvent[] {
  return events.filter((event) => {
    if (!isDateKey(event.startDate)) return false;
    const endDate = event.endDate ?? event.startDate;
    if (!isDateKey(endDate) || endDate < event.startDate) return false;
    return event.startDate <= range.endDate && endDate >= range.startDate;
  });
}

export function filterSpaceEvents(
  events: readonly SpaceEvent[],
  options: {
    query?: string;
    category?: EventCategory | "all";
    time?: EventTimeFilter;
    today: string;
  },
): SpaceEvent[] {
  const query = options.query?.trim().toLocaleLowerCase() ?? "";
  const category = options.category ?? "all";
  const time = options.time ?? "all";

  return events.filter((event) => {
    if (!isDateKey(event.startDate)) return false;
    const endDate = event.endDate ?? event.startDate;
    if (!isDateKey(endDate) || endDate < event.startDate) return false;
    if (category !== "all" && event.category !== category) return false;

    const searchableText = [
      event.title,
      event.summary,
      ...(Array.isArray(event.objects) ? event.objects : []),
    ]
      .filter((value): value is string => typeof value === "string")
      .join(" ")
      .toLocaleLowerCase();
    if (query && !searchableText.includes(query)) return false;
    if (time === "upcoming" && endDate < options.today) return false;
    if (time === "past" && endDate >= options.today) return false;
    return true;
  });
}

export function formatDateKey(dateKey: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateFromKey(dateKey));
}

export function getPeriodLabel(dateKey: string, view: CalendarView): string {
  const date = dateFromKey(dateKey);
  if (view === "daily") return formatDateKey(dateKey, { weekday: "long" });
  if (view === "weekly") {
    const { startDate, endDate } = getCalendarRange(dateKey, "weekly");
    return `${formatDateKey(startDate, { month: "short" })} – ${formatDateKey(
      endDate,
      { month: "short", year: "numeric" },
    )}`;
  }
  if (view === "monthly") {
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      year: "numeric",
    }).format(date);
  }
  return String(date.getFullYear());
}

export function getMonthName(year: number, month: number): string {
  return new Intl.DateTimeFormat(undefined, { month: "long" }).format(
    new Date(year, month, 1),
  );
}

export function isDateWithinMonth(dateKey: string, year: number, month: number): boolean {
  const date = dateFromKey(dateKey);
  return date.getFullYear() === year && date.getMonth() === month;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
