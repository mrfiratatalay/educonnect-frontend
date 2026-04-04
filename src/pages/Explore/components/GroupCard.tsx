import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Tag, Typography, theme } from "antd";
import type { AppGroup } from "@/features/groups/types";

interface GroupCardProps {
  group: AppGroup;
  isActing: boolean;
  onOpen: (groupId: string) => void;
  onToggleMembership: (group: AppGroup) => void;
}

export default function GroupCard({
  group,
  isActing,
  onOpen,
  onToggleMembership,
}: GroupCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      hoverable
      onClick={() => onOpen(group.id)}
      style={{ borderColor: token.colorBorderSecondary, height: "100%" }}
      styles={{ body: { padding: 20, height: "100%" } }}
    >
      <Flex vertical gap={16} style={{ height: "100%" }}>
        <Flex align="flex-start" justify="space-between" gap={12}>
          <Flex gap={12} style={{ minWidth: 0, flex: 1 }}>
            <Avatar
              icon={<TeamOutlined />}
              shape="square"
              size={44}
              style={{ background: token.colorPrimaryBg, color: token.colorPrimary }}
            />

            <div style={{ minWidth: 0, flex: 1 }}>
              <Typography.Text strong style={{ display: "block", fontSize: 16 }} ellipsis>
                {group.name}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                Kurucu: {group.creatorName}
              </Typography.Text>
            </div>
          </Flex>

          {group.isMember && <Tag color="success">Üye</Tag>}
        </Flex>

        <Flex gap={8} wrap="wrap">
          <Tag color="default">{group.category}</Tag>
          <Tag color="processing">{group.memberCount} üye</Tag>
        </Flex>

        <Typography.Paragraph
          type="secondary"
          ellipsis={{ rows: 3 }}
          style={{ marginBottom: 0, lineHeight: 1.7 }}
        >
          {group.description}
        </Typography.Paragraph>

        <Flex vertical gap={6} style={{ marginTop: "auto" }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            <UserOutlined style={{ marginRight: 6 }} />
            Topluluk büyüklüğü: {group.memberCount} kişi
          </Typography.Text>
        </Flex>

        <Button
          type={group.isMember ? "default" : "primary"}
          block
          loading={isActing}
          onClick={(event) => {
            event.stopPropagation();
            onToggleMembership(group);
          }}
        >
          {isActing ? "İşleniyor" : group.isMember ? "Ayrıl" : "Katıl"}
        </Button>
      </Flex>
    </Card>
  );
}
