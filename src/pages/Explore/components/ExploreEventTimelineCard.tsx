import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { Button, Card, Empty, Flex, Timeline, Typography, theme } from "antd";
import type { AppEvent } from "@/features/events/types";
import { formatEventDateTime, formatEventTime } from "@/features/events/utils";

interface ExploreEventTimelineCardProps {
  events: AppEvent[];
  onOpen: (eventId: string) => void;
}

export default function ExploreEventTimelineCard({
  events,
  onOpen,
}: ExploreEventTimelineCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      title="Yaklaşan Etkinlikler"
      style={{ borderColor: token.colorBorderSecondary }}
      styles={{ body: { padding: 20 } }}
    >
      {events.length === 0 ? (
        <Empty
          description="Yaklaşan etkinlik bulunamadı."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <Timeline
          items={events.map((event) => ({
            color: event.isRegistered ? "green" : "blue",
            title: formatEventDateTime(event.startDate),
            content: (
              <Flex vertical gap={6}>
                <Typography.Text strong>{event.title}</Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 6 }} />
                  {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  <EnvironmentOutlined style={{ marginRight: 6 }} />
                  {event.location}
                </Typography.Text>
                <Button onClick={() => onOpen(event.id)} size="small" type="link">
                  Detayı Aç
                </Button>
              </Flex>
            ),
            icon: <CalendarOutlined style={{ color: token.colorPrimary }} />,
          }))}
          variant="outlined"
        />
      )}
    </Card>
  );
}
