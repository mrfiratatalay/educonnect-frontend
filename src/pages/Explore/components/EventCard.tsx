import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppEvent } from "@/features/events/types";
import {
  formatEventDayLabel,
  formatEventTime,
  isEventFull,
} from "@/features/events/utils";

interface EventCardProps {
  event: AppEvent;
  isActing: boolean;
  onOpen: (eventId: string) => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function EventCard({
  event,
  isActing,
  onOpen,
  onToggleRegistration,
}: EventCardProps) {
  const full = isEventFull(event);
  const isActionDisabled = isActing || (!event.isRegistered && full);

  return (
    <Card
      className="cursor-pointer overflow-hidden border border-border/60 transition-shadow hover:shadow-md"
      onClick={() => onOpen(event.id)}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="text-[10px] font-semibold uppercase">
              {formatEventDayLabel(event.startDate).split(" ")[1]}
            </span>
            <span className="text-lg font-bold leading-none">
              {formatEventDayLabel(event.startDate).split(" ")[0]}
            </span>
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold">{event.title}</h3>
              {event.isRegistered && <Badge variant="success">Kayitli</Badge>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-[10px]">
                {event.category}
              </Badge>
              {event.groupName && (
                <Badge variant="outline" className="text-[10px]">
                  {event.groupName}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {event.description}
        </p>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {event.location}
          </p>
          <p className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {event.participantCount}/{event.maxParticipants} katilimci
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            Duzenleyen: {event.creatorName}
          </p>
        </div>

        <Button
          variant={event.isRegistered ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={isActionDisabled}
          onClick={(clickedEvent) => {
            clickedEvent.stopPropagation();
            onToggleRegistration(event);
          }}
        >
          {isActing
            ? "Isleniyor"
            : event.isRegistered
              ? "Kaydi Iptal Et"
              : full
                ? "Kontenjan Dolu"
                : "Kayit Ol"}
        </Button>
      </CardContent>
    </Card>
  );
}
