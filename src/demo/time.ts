const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

interface Offset {
  days?: number;
  hours?: number;
  minutes?: number;
}

function offsetMs({ days = 0, hours = 0, minutes = 0 }: Offset) {
  return days * DAY + hours * HOUR + minutes * MINUTE;
}

export function nowIso() {
  return new Date().toISOString();
}

export function isoAgo(offset: Offset) {
  return new Date(Date.now() - offsetMs(offset)).toISOString();
}

/** A local wall-clock time `days` from today, e.g. an event at 18:30. */
export function isoAtLocal(days: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

/** Days until the next given weekday (0 = Sunday ... 6 = Saturday), at least 2. */
export function daysUntilWeekday(weekday: number) {
  const today = new Date().getDay();
  const days = (weekday - today + 7) % 7;
  return days < 2 ? days + 7 : days;
}

const DATE_FIELD = /(AtUtc|DateUtc|UntilUtc)$/;

/**
 * Moves every stored timestamp forward by `deltaMs`. Runs when the demo is
 * reopened later, so seeded "2 hours ago" posts and "next week" events keep
 * their distance to today and the demo never looks stale.
 */
export function shiftDates(value: unknown, deltaMs: number): void {
  if (Array.isArray(value)) {
    value.forEach((item) => shiftDates(item, deltaMs));
    return;
  }
  if (!value || typeof value !== "object") {
    return;
  }
  const record = value as Record<string, unknown>;
  for (const [key, field] of Object.entries(record)) {
    if (typeof field === "string" && DATE_FIELD.test(key)) {
      const time = Date.parse(field);
      if (!Number.isNaN(time)) {
        record[key] = new Date(time + deltaMs).toISOString();
      }
    } else if (field && typeof field === "object") {
      shiftDates(field, deltaMs);
    }
  }
}
