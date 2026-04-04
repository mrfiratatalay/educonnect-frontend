import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEventDetailQuery } from "@/features/events/hooks";
import type { AppEvent } from "@/features/events/types";
import {
  formatEventDateTime,
  isEventFull,
} from "@/features/events/utils";

interface EventDetailDialogProps {
  actingEventId?: string;
  errorMessage?: string | null;
  eventId: string | null;
  onClose: () => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function EventDetailDialog({
  actingEventId,
  errorMessage,
  eventId,
  onClose,
  onToggleRegistration,
}: EventDetailDialogProps) {
  const eventQuery = useEventDetailQuery(eventId ?? undefined, Boolean(eventId));
  const event = eventQuery.data;

  const full = event ? isEventFull(event) : false;
  const isActionDisabled = !event || actingEventId === event.id || (!event.isRegistered && full);

  return (
    <Dialog open={Boolean(eventId)} onOpenChange={onClose}>
      <DialogContent>
        {eventQuery.isLoading && <p className="text-sm text-muted-foreground">Etkinlik detayi yukleniyor...</p>}
        {eventQuery.error instanceof Error && <p className="text-sm text-destructive">{eventQuery.error.message}</p>}

        {event && (
          <>
            <DialogHeader>
              <DialogTitle>{event.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{event.category}</Badge>
                {event.groupName && <Badge variant="outline">{event.groupName}</Badge>}
                {event.isRegistered && <Badge variant="success">Kayitli</Badge>}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {event.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatEventDateTime(event.startDate)} - {formatEventDateTime(event.endDate)}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {event.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  {event.participantCount}/{event.maxParticipants} katilimci
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Duzenleyen: {event.creatorName}
                </p>
              </div>

              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

              <Button
                variant={event.isRegistered ? "outline" : "default"}
                className="w-full"
                disabled={isActionDisabled}
                onClick={() => onToggleRegistration(event)}
              >
                {actingEventId === event.id
                  ? "Isleniyor"
                  : event.isRegistered
                    ? "Kaydi Iptal Et"
                    : full
                      ? "Kontenjan Dolu"
                      : "Etkinlige Kayit Ol"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
