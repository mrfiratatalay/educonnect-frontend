import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppEvent } from "@/features/events/types";
import {
  formatEventDayLabel,
  formatEventTime,
  isEventFull,
} from "@/features/events/utils";

interface DashboardUpcomingEventsCardProps {
  events: AppEvent[];
  errorMessage?: string;
  isLoading: boolean;
}

export default function DashboardUpcomingEventsCard({
  events,
  errorMessage,
  isLoading,
}: DashboardUpcomingEventsCardProps) {
  return (
    <Card className="hover:shadow-none">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-5 w-5 text-primary" />
          Yaklasan Etkinlikler
        </CardTitle>
        <Link to="/explore?tab=events">
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            Tumunu Gor <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="space-y-2">
        {isLoading && (
          <div className="rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
            Etkinlikler yukleniyor...
          </div>
        )}

        {!isLoading && !errorMessage && events.length === 0 && (
          <div className="rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
            Yaklasan etkinlik bulunmuyor.
          </div>
        )}

        {events.map((event) => (
          <Link to="/explore?tab=events" key={event.id}>
            <div className="flex cursor-pointer items-center gap-4 rounded-xl bg-secondary/40 p-3 transition-colors hover:bg-secondary/70">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="text-[10px] font-semibold uppercase">
                  {formatEventDayLabel(event.startDate).split(" ")[1]}
                </span>
                <span className="text-lg font-bold leading-none">
                  {formatEventDayLabel(event.startDate).split(" ")[0]}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <div className="mt-0.5 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatEventTime(event.startDate)}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </span>
                </div>
              </div>

              {event.isRegistered ? (
                <Badge variant="success" className="shrink-0 text-[10px]">
                  Kayitli
                </Badge>
              ) : (
                <Badge variant="outline" className="shrink-0 text-[10px]">
                  {isEventFull(event) ? "Dolu" : "Acik"}
                </Badge>
              )}
            </div>
          </Link>
        ))}

        {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
      </CardContent>
    </Card>
  );
}
