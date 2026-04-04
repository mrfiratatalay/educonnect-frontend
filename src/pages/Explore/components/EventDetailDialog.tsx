import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Alert, Button, Descriptions, Drawer, Flex, Grid, Spin, Tag, Typography } from "antd";
import { useEventDetailQuery } from "@/features/events/hooks";
import type { AppEvent } from "@/features/events/types";
import { formatEventDateTime, isEventFull } from "@/features/events/utils";

interface EventDetailDialogProps {
  actingEventId?: string;
  errorMessage?: string | null;
  event?: AppEvent | null;
  eventId: string | null;
  onClose: () => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function EventDetailDialog({
  actingEventId,
  errorMessage,
  event: previewEvent,
  eventId,
  onClose,
  onToggleRegistration,
}: EventDetailDialogProps) {
  const screens = Grid.useBreakpoint();
  const eventQuery = useEventDetailQuery(eventId ?? undefined, Boolean(eventId) && !previewEvent);
  const event = previewEvent ?? eventQuery.data;
  const queryError = !previewEvent && eventQuery.error instanceof Error ? eventQuery.error : null;
  const isLoading = !previewEvent && eventQuery.isLoading;
  const full = event ? isEventFull(event) : false;
  const isActionDisabled = !event || actingEventId === event.id || (!event.isRegistered && full);

  return (
    <Drawer
      destroyOnHidden
      open={Boolean(eventId)}
      onClose={onClose}
      title={event?.title ?? "Etkinlik Detayı"}
      width={screens.md ? 520 : "100%"}
    >
      {isLoading && (
        <Flex justify="center" style={{ padding: 32 }}>
          <Spin />
        </Flex>
      )}

      {queryError && <Alert type="error" showIcon message={queryError.message} />}

      {event && (
        <Flex vertical gap={16}>
          <Flex gap={8} wrap="wrap">
            <Tag color="blue">{event.category}</Tag>
            {event.groupName && <Tag>{event.groupName}</Tag>}
            {event.isRegistered && <Tag color="success">Kayıtlı</Tag>}
          </Flex>

          <Typography.Paragraph type="secondary" style={{ lineHeight: 1.7, marginBottom: 0 }}>
            {event.description}
          </Typography.Paragraph>

          <Descriptions
            column={1}
            items={[
              {
                label: (
                  <>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    Tarih
                  </>
                ),
                children: `${formatEventDateTime(event.startDate)} - ${formatEventDateTime(event.endDate)}`,
              },
              {
                label: (
                  <>
                    <EnvironmentOutlined style={{ marginRight: 6 }} />
                    Konum
                  </>
                ),
                children: event.location,
              },
              {
                label: (
                  <>
                    <TeamOutlined style={{ marginRight: 6 }} />
                    Katılımcı
                  </>
                ),
                children: `${event.participantCount}/${event.maxParticipants}`,
              },
              {
                label: "Düzenleyen",
                children: event.creatorName,
              },
            ]}
            size="small"
          />

          {errorMessage && <Alert type="error" showIcon message={errorMessage} />}

          <Button
            type={event.isRegistered ? "default" : "primary"}
            loading={actingEventId === event.id}
            disabled={isActionDisabled}
            onClick={() => onToggleRegistration(event)}
          >
            {actingEventId === event.id
              ? "İşleniyor"
              : event.isRegistered
                ? "Kaydı İptal Et"
                : full
                  ? "Kontenjan Dolu"
                  : "Etkinliğe Kayıt Ol"}
          </Button>
        </Flex>
      )}
    </Drawer>
  );
}
