import { Avatar, Empty, Flex, Skeleton, Typography, theme } from "antd";
import type { ConversationSummary } from "@/features/messages/types";

interface ConversationListProps {
  items: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export default function ConversationList({
  items,
  selectedId,
  onSelect,
  isLoading,
}: ConversationListProps) {
  const { token } = theme.useToken();

  if (isLoading) {
    return (
      <Flex vertical gap={8} style={{ padding: 16 }}>
        <Skeleton active avatar title={{ width: "60%" }} paragraph={{ rows: 1 }} />
        <Skeleton active avatar title={{ width: "55%" }} paragraph={{ rows: 1 }} />
        <Skeleton active avatar title={{ width: "70%" }} paragraph={{ rows: 1 }} />
      </Flex>
    );
  }

  if (items.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Typography.Text type="secondary">Henuz konusma yok</Typography.Text>
        }
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <Flex vertical style={{ overflow: "auto", flex: 1 }}>
      {items.map((c) => {
        const active = c.id === selectedId;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect(c.id)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 16px",
              border: "none",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
              background: active ? token.colorPrimaryBg : "transparent",
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
            }}
          >
            <Avatar src={c.otherUserAvatarUrl ?? undefined} size={48}>
              {c.otherUserName.charAt(0)}
            </Avatar>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Flex justify="space-between" align="center" gap={4}>
                <Typography.Text strong ellipsis style={{ display: "block", fontSize: 15 }}>
                  {c.otherUserName}
                </Typography.Text>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 12, flexShrink: 0 }}
                >
                  {formatRelativeTime(c.lastMessageAtUtc)}
                </Typography.Text>
              </Flex>
              {c.lastMessagePreview ? (
                <Typography.Text type="secondary" ellipsis style={{ fontSize: 13, display: "block" }}>
                  {c.lastMessagePreview}
                </Typography.Text>
              ) : null}
            </div>
          </button>
        );
      })}
    </Flex>
  );
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "az önce";
  if (diffMin < 60) return `${diffMin}dk`;
  if (diffHour < 24) return `${diffHour}s`;
  if (diffDay < 7) return `${diffDay}g`;

  return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}
