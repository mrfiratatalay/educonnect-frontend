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
        currentUser.role === "moderator"),
  );

  return (
    <Drawer
      destroyOnHidden
      open={Boolean(eventId)}
      onClose={onClose}
      title={event?.title ?? "Etkinlik Detayi"}
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
            {event.isRegistered ? <Tag color="success">Kayitli</Tag> : null}
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
                    Katilimci
                  </>
                ),
                children: `${event.participantCount}/${event.maxParticipants}`,
              },
              {
                label: "Duzenleyen",
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
              ? "Isleniyor"
              : event.isRegistered
                ? "Kaydi Iptal Et"
                : full
                  ? "Kontenjan Dolu"
                  : "Etkinlige Kayit Ol"}
          </Button>

          {canManage ? (
            <Flex gap={12}>
              <Button icon={<EditOutlined />} onClick={() => onEdit?.(event)} style={{ flex: 1 }}>
                Duzenle
              </Button>
              <Popconfirm
                title="Etkinlik silinsin mi?"
                description="Bu islem geri alinamaz."
                okText="Sil"
                cancelText="Vazgec"
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
