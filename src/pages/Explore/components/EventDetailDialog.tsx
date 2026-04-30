import {
  CalendarOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Alert, Button, Descriptions, Drawer, Flex, Grid, Popconfirm, Spin, Tag, Typography } from "antd";
import { useAuthStore } from "@/store/authStore";
import { useEventDetailQuery } from "@/features/events/hooks";
import type { AppEvent } from "@/features/events/types";
import { formatEventDateTime, isEventFull } from "@/features/events/utils";

interface EventDetailDialogProps {
  actingEventId?: string;
  errorMessage?: string | null;
  event?: AppEvent | null;
  eventId: string | null;
  isDeleting?: boolean;
  onClose: () => void;
  onDelete?: (event: AppEvent) => void;
  onEdit?: (event: AppEvent) => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function EventDetailDialog({
  actingEventId,
  errorMessage,
  event: previewEvent,
  eventId,
  isDeleting = false,
  onClose,
  onDelete,
  onEdit,
  onToggleRegistration,
}: EventDetailDialogProps) {
  const screens = Grid.useBreakpoint();
  const currentUser = useAuthStore((state) => state.user);
  const eventQuery = useEventDetailQuery(eventId ?? undefined, Boolean(eventId) && !previewEvent);
  const event = previewEvent ?? eventQuery.data;
  const queryError = !previewEvent && eventQuery.error instanceof Error ? eventQuery.error : null;
  const isLoading = !previewEvent && eventQuery.isLoading;
  const full = event ? isEventFull(event) : false;
  const isActionDisabled = !event || actingEventId === event.id || (!event.isRegistered && full);
  const canManage = Boolean(
    event &&
      currentUser &&
      (event.creatorUserId === currentUser.id ||
        currentUser.role === "admin" ||
        currentUser.role === "moderatör"),
  );

  return (
    <Drawer
      destroyOnHidden
      open={Boolean(eventId)}
      onClose={onClose}
      title={event?.title ?? "Etkinlik Detayı"}
      width={screens.md ? 520 : "100%"}
    >
      {isLoading ? (
        <Flex justify="center" style={{ padding: 32 }}>
          <Spin />
        </Flex>
      ) : null}

      {queryError ? <Alert type="error" showIcon message={queryError.message} /> : null}

      {event ? (
        <Flex vertical gap={16}>
          <Flex gap={8} wrap="wrap">
            <Tag color="blue">{event.category}</Tag>
            {event.groupName ? <Tag>{event.groupName}</Tag> : null}
            {event.isRegistered ? <Tag color="success">Kayıtlı</Tag> : null}
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

          {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}

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

          {canManage ? (
            <Flex gap={12}>
              <Button icon={<EditOutlined />} onClick={() => onEdit?.(event)} style={{ flex: 1 }}>
                Düzenle
              </Button>
              <Popconfirm
                title="Etkinlik silinsin mi?"
                description="Bu işlem geri alınamaz."
                okText="Sil"
                cancelText="Vazgeç"
                onConfirm={() => onDelete?.(event)}
              >
                <Button danger icon={<DeleteOutlined />} loading={isDeleting} style={{ flex: 1 }}>
                  Sil
                </Button>
              </Popconfirm>
            </Flex>
          ) : null}
        </Flex>
      ) : null}
    </Drawer>
  );
}
