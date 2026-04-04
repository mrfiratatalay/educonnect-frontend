import { Card, CardContent } from "@/components/ui/card";
import type { AppEvent } from "@/features/events/types";
import EventCard from "@/pages/Explore/components/EventCard";

interface EventGridProps {
  events: AppEvent[];
  actingEventId?: string;
  errorMessage?: string;
  isLoading: boolean;
  onOpen: (eventId: string) => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function EventGrid({
  events,
  actingEventId,
  errorMessage,
  isLoading,
  onOpen,
  onToggleRegistration,
}: EventGridProps) {
  if (isLoading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Etkinlikler yukleniyor...</CardContent></Card>;
  }

  if (errorMessage) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{errorMessage}</CardContent></Card>;
  }

  if (events.length === 0) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Aramana uygun etkinlik bulunamadi.</CardContent></Card>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          isActing={actingEventId === event.id}
          onOpen={onOpen}
          onToggleRegistration={onToggleRegistration}
        />
      ))}
    </div>
  );
}
