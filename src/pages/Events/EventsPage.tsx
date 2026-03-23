import { useState } from "react";
import { Calendar, MapPin, Users, Clock, CalendarDays, LayoutGrid } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockEvents } from "@/data/mock";
import { cn } from "@/lib/utils";

export default function EventsPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [events, setEvents] = useState(mockEvents);

  const toggleRegistration = (id: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              isRegistered: !e.isRegistered,
              currentParticipants: e.isRegistered
                ? e.currentParticipants - 1
                : e.currentParticipants + 1,
            }
          : e,
      ),
    );
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const fillPercent = (current: number, max: number) =>
    Math.round((current / max) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Etkinlikler</h1>
          <p className="text-muted-foreground mt-1">
            Kampüste ve çevresinde düzenlenen etkinlikleri keşfet
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("grid")}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <CalendarDays className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={cn(
          view === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-4",
        )}
      >
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            {view === "grid" && event.imageUrl && (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-40 object-cover"
              />
            )}
            <CardContent className={cn("space-y-3", view === "grid" ? "p-4" : "p-5")}>
              {view === "list" && (
                <div className="flex items-start gap-4">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-24 h-24 rounded-xl object-cover shrink-0 hidden sm:block"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <Button
                        variant={event.isRegistered ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleRegistration(event.id)}
                        className="shrink-0"
                      >
                        {event.isRegistered ? "İptal" : "Katıl"}
                      </Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.currentParticipants}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {view === "grid" && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                    {event.isRegistered && (
                      <Badge variant="success" className="shrink-0">Kayıtlı</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(event.startDate)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {formatTime(event.startDate)} - {formatTime(event.endDate)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.location}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">
                        {event.currentParticipants}/{event.maxParticipants} katılımcı
                      </span>
                      <span className="font-medium">
                        %{fillPercent(event.currentParticipants, event.maxParticipants)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{
                          width: `${fillPercent(event.currentParticipants, event.maxParticipants)}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant={event.isRegistered ? "outline" : "default"}
                    size="sm"
                    className="w-full"
                    onClick={() => toggleRegistration(event.id)}
                  >
                    {event.isRegistered ? "Kaydı İptal Et" : "Katıl"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
