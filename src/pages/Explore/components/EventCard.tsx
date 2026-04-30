import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Progress, Tag, Typography, theme } from "antd";
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
  const { token } = theme.useToken();
  const full = isEventFull(event);
  const isActionDisabled = isActing || (!event.isRegistered && full);
  const capacityPercent = Math.min(
    100,
    Math.round((event.participantCount / event.maxParticipants) * 100),
  );

  return (
    <Card
      hoverable
      onClick={() => onOpen(event.id)}
      style={{ borderColor: token.colorBorderSecondary, height: "100%" }}
      styles={{ body: { padding: 20, height: "100%" } }}
    >
      <Flex vertical gap={16} style={{ height: "100%" }}>
        <Flex align="flex-start" justify="space-between" gap={12}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Flex align="center" gap={8} wrap="wrap">
              <Tag color="blue" style={{ marginInlineEnd: 0 }}>
                {formatEventDayLabel(event.startDate)}
              </Tag>
              {event.isRegistered ? <Tag color="success">Kayıtlı</Tag> : null}
              {full && !event.isRegistered ? <Tag color="error">Kontenjan dolu</Tag> : null}
            </Flex>

            <Typography.Text
              strong
              style={{ display: "block", fontSize: 16, marginTop: 10 }}
              ellipsis
            >
              {event.title}
            </Typography.Text>

            <Flex gap={6} wrap="wrap" style={{ marginTop: 8 }}>
              <Tag color="default">{event.category}</Tag>
              {event.groupName ? <Tag color="processing">{event.groupName}</Tag> : null}
            </Flex>
          </div>
        </Flex>

        <Typography.Paragraph
          type="secondary"
          ellipsis={{ rows: 3 }}
          style={{ marginBottom: 0, lineHeight: 1.7 }}
        >
          {event.description}
        </Typography.Paragraph>

        <Flex vertical gap={6}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <ClockCircleOutlined style={{ marginRight: 6 }} />
            {formatEventTime(event.startDate)} - {formatEventTime(event.endDate)}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <EnvironmentOutlined style={{ marginRight: 6 }} />
            {event.location}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <TeamOutlined style={{ marginRight: 6 }} />
            {event.participantCount}/{event.maxParticipants} katılımcı
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <CalendarOutlined style={{ marginRight: 6 }} />
            Düzenleyen: {event.creatorName}
          </Typography.Text>
        </Flex>

        <div style={{ marginTop: "auto" }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            Doluluk
          </Typography.Text>
          <Progress percent={capacityPercent} showInfo={false} size="small" />
        </div>

        <Button
          type={event.isRegistered ? "default" : "primary"}
          block
          loading={isActing}
          disabled={isActionDisabled}
          onClick={(clickedEvent) => {
            clickedEvent.stopPropagation();
            onToggleRegistration(event);
          }}
        >
          {isActing
            ? "İşleniyor"
            : event.isRegistered
              ? "Kaydı İptal Et"
              : full
                ? "Kontenjan Dolu"
                : "Kayıt Ol"}
        </Button>
      </Flex>
    </Card>
  );
}
