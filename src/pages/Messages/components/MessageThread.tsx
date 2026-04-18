import { useEffect, useRef } from "react";
import { Avatar, Button, Flex, Skeleton, Typography, theme } from "antd";
import type { DirectMessageItem } from "@/features/messages/types";

interface MessageThreadProps {
  messages: DirectMessageItem[];
  currentUserId: string | undefined;
  otherUserName: string;
  otherAvatarUrl?: string | null;
  isLoading: boolean;
  hasOlderMessages?: boolean;
  isFetchingOlder?: boolean;
  onLoadOlder?: () => void;
}

export default function MessageThread({
  messages,
  currentUserId,
  otherUserName,
  otherAvatarUrl,
  isLoading,
  hasOlderMessages = false,
  isFetchingOlder = false,
  onLoadOlder,
}: MessageThreadProps) {
  const { token } = theme.useToken();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevLengthRef.current = messages.length;
  }, [messages.length]);

  if (isLoading) {
    return (
      <Flex vertical gap={12} style={{ padding: 16, flex: 1 }}>
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 1 }} />
        <Skeleton active paragraph={{ rows: 3 }} />
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      style={{
        flex: 1,
        overflow: "auto",
        padding: "12px 16px",
        background: token.colorBgLayout,
        gap: 2,
      }}
    >
      {hasOlderMessages && (
        <Flex justify="center" style={{ marginBottom: 8 }}>
          <Button
            size="small"
            loading={isFetchingOlder}
            onClick={onLoadOlder}
            style={{ borderRadius: 99 }}
          >
            Daha eski mesajlar
          </Button>
        </Flex>
      )}

      {messages.map((m, index) => {
        const mine = m.senderUserId === currentUserId;
        const isOptimistic = m.senderUserId === "__optimistic__";
        const prevMsg = messages[index - 1];
        const nextMsg = messages[index + 1];
        const isFirstInGroup =
          !prevMsg || prevMsg.senderUserId !== m.senderUserId;
        const isLastInGroup =
          !nextMsg || nextMsg.senderUserId !== m.senderUserId;

        return (
          <Flex
            key={m.id}
            justify={mine || isOptimistic ? "flex-end" : "flex-start"}
            style={{
              width: "100%",
              marginBottom: isLastInGroup ? 8 : 2,
            }}
          >
            <Flex
              gap={8}
              align="flex-end"
              style={{
                maxWidth: "72%",
                flexDirection: mine || isOptimistic ? "row-reverse" : "row",
              }}
            >
              {!(mine || isOptimistic) ? (
                <div style={{ width: 32, flexShrink: 0 }}>
                  {isLastInGroup && (
                    <Avatar src={otherAvatarUrl ?? undefined} size={32}>
                      {otherUserName.charAt(0)}
                    </Avatar>
                  )}
                </div>
              ) : null}

              <Flex vertical gap={2} style={{ alignItems: mine || isOptimistic ? "flex-end" : "flex-start" }}>
                <div
                  style={{
                    padding: "9px 14px",
                    borderRadius: isFirstInGroup && isLastInGroup
                      ? 18
                      : mine || isOptimistic
                      ? `18px 18px ${isLastInGroup ? 4 : 18}px ${isFirstInGroup ? 18 : 18}px`
                      : `18px 18px ${isLastInGroup ? 4 : 18}px ${isFirstInGroup ? 18 : 18}px`,
                    background: mine || isOptimistic
                      ? isOptimistic
                        ? token.colorPrimaryBorderHover
                        : token.colorPrimary
                      : token.colorBgContainer,
                    color: mine || isOptimistic ? "#fff" : token.colorText,
                    border: mine || isOptimistic
                      ? "none"
                      : `1px solid ${token.colorBorderSecondary}`,
                    opacity: isOptimistic ? 0.7 : 1,
                  }}
                >
                  <Typography.Text
                    style={{
                      color: mine || isOptimistic ? "rgba(255,255,255,0.95)" : undefined,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontSize: 15,
                    }}
                  >
                    {m.content}
                  </Typography.Text>
                </div>

                {isLastInGroup && (
                  <Typography.Text
                    type="secondary"
                    style={{ fontSize: 11, paddingInline: 2 }}
                  >
                    {formatMessageTime(m.sentAtUtc)}
                  </Typography.Text>
                )}
              </Flex>
            </Flex>
          </Flex>
        );
      })}

      <div ref={bottomRef} />
    </Flex>
  );
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDay = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDay === 0) {
    return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  if (diffDay < 7) {
    return date.toLocaleDateString("tr-TR", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
