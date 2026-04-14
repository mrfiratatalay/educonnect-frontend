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
              <Typography.Text strong ellipsis style={{ display: "block", fontSize: 15 }}>
                {c.otherUserName}
              </Typography.Text>
              {c.lastMessagePreview ? (
                <Typography.Text type="secondary" ellipsis style={{ fontSize: 13 }}>
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
