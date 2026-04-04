import { CalendarOutlined, TeamOutlined } from "@ant-design/icons";
import { Alert, Button, Descriptions, Drawer, Flex, Grid, Spin, Tag, Typography } from "antd";
import { useGroupDetailQuery } from "@/features/groups/hooks";
import type { AppGroup } from "@/features/groups/types";

interface GroupDetailDialogProps {
  actingGroupId?: string;
  errorMessage?: string | null;
  group?: AppGroup | null;
  groupId: string | null;
  onClose: () => void;
  onToggleMembership: (group: AppGroup) => void;
}

export default function GroupDetailDialog({
  actingGroupId,
  errorMessage,
  group: previewGroup,
  groupId,
  onClose,
  onToggleMembership,
}: GroupDetailDialogProps) {
  const screens = Grid.useBreakpoint();
  const groupQuery = useGroupDetailQuery(groupId ?? undefined, Boolean(groupId) && !previewGroup);
  const group = previewGroup ?? groupQuery.data;
  const queryError = !previewGroup && groupQuery.error instanceof Error ? groupQuery.error : null;
  const isLoading = !previewGroup && groupQuery.isLoading;

  return (
    <Drawer
      destroyOnHidden
      open={Boolean(groupId)}
      onClose={onClose}
      title={group?.name ?? "Grup Detayı"}
      width={screens.md ? 480 : "100%"}
    >
      {isLoading && (
        <Flex justify="center" style={{ padding: 32 }}>
          <Spin />
        </Flex>
      )}

      {queryError && <Alert type="error" showIcon message={queryError.message} />}

      {group && (
        <Flex vertical gap={16}>
          <Flex gap={8}>
            <Tag color="blue">{group.category}</Tag>
            {group.isMember && <Tag color="success">Üye</Tag>}
          </Flex>

          <Typography.Paragraph type="secondary" style={{ lineHeight: 1.7, marginBottom: 0 }}>
            {group.description}
          </Typography.Paragraph>

          <Descriptions
            column={1}
            items={[
              {
                label: (
                  <>
                    <TeamOutlined style={{ marginRight: 6 }} />
                    Üye sayısı
                  </>
                ),
                children: `${group.memberCount} üye`,
              },
              {
                label: (
                  <>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    Kurucu
                  </>
                ),
                children: group.creatorName,
              },
            ]}
            size="small"
          />

          {errorMessage && <Alert type="error" showIcon message={errorMessage} />}

          <Button
            type={group.isMember ? "default" : "primary"}
            loading={actingGroupId === group.id}
            onClick={() => onToggleMembership(group)}
          >
            {actingGroupId === group.id ? "İşleniyor" : group.isMember ? "Ayrıl" : "Katıl"}
          </Button>
        </Flex>
      )}
    </Drawer>
  );
}
