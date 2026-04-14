import { useEffect, useRef } from "react";
import { Avatar, Flex, Skeleton, Typography, theme } from "antd";
import type { DirectMessageItem } from "@/features/messages/types";

interface MessageThreadProps {
  messages: DirectMessageItem[];
  currentUserId: string | undefined;
  otherUserName: string;
  otherAvatarUrl?: string | null;
  isLoading: boolean;
}

export default function MessageThread({
  messages,
  currentUserId,
  otherUserName,
  otherAvatarUrl,
  isLoading,
}: MessageThreadProps) {
  const { token } = theme.useToken();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isLoading) {
    return (
      <Flex vertical gap={12} style={{ padding: 16, flex: 1 }}>
        <Skeleton active paragraph={{ rows: 2 }} />
        <Skeleton active paragraph={{ rows: 1 }} />
      </Flex>
    );
  }

  return (
    <Flex
      vertical
      gap={8}
      style={{
        flex: 1,
        overflow: "auto",
        padding: 16,
        background: token.colorBgLayout,
      }}
    >
      {messages.map((m) => {
        const mine = m.senderUserId === currentUserId;
        return (
          <Flex
            key={m.id}
            justify={mine ? "flex-end" : "flex-start"}
            style={{ width: "100%" }}
          >
            <Flex
              gap={8}
              align="flex-end"
              style={{ maxWidth: "85%", flexDirection: mine ? "row-reverse" : "row" }}
            >
              {!mine ? (
                <Avatar src={otherAvatarUrl ?? undefined} size={32}>
                  {otherUserName.charAt(0)}
                </Avatar>
              ) : null}
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 16,
                  background: mine ? token.colorPrimary : token.colorBgContainer,
                  color: mine ? "#fff" : token.colorText,
                  border: mine ? "none" : `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Typography.Text
                  style={{
                    color: mine ? "rgba(255,255,255,0.95)" : undefined,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {m.content}
                </Typography.Text>
              </div>
            </Flex>
          </Flex>
        );
      })}
      <div ref={bottomRef} />
    </Flex>
  );
}
