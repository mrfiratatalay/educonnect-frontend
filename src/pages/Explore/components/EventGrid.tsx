import { Alert, Card, Col, Empty, Row, Skeleton } from "antd";
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
    return (
      <Row gutter={[16, 16]}>
        {[0, 1, 2].map((item) => (
          <Col key={item} xs={24} sm={12} xl={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} title={{ width: "52%" }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (errorMessage) {
    return <Alert type="error" showIcon message={errorMessage} />;
  }

  if (events.length === 0) {
    return <Empty description="Aramana uygun etkinlik bulunamadı." />;
  }

  return (
    <Row gutter={[16, 16]}>
      {events.map((event) => (
        <Col key={event.id} xs={24} sm={12} xl={8}>
          <EventCard
            event={event}
            isActing={actingEventId === event.id}
            onOpen={onOpen}
            onToggleRegistration={onToggleRegistration}
          />
        </Col>
      ))}
    </Row>
  );
}
