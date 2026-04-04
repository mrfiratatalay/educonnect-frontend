import type { AppEvent } from "@/features/events/types";

export function formatEventDayLabel(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

export function formatEventTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatEventDateTime(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getUpcomingEvents(events: AppEvent[], limit = 3) {
  return events
    .filter((event) => new Date(event.endDate).getTime() >= Date.now())
    .slice(0, limit);
}

export function isEventFull(event: AppEvent) {
  return event.participantCount >= event.maxParticipants;
}
