import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert, Avatar, Flex, Typography, theme } from "antd";
import { useAuthStore } from "@/store/authStore";
import {
  useConversationsQuery,
  useMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
} from "@/features/messages/hooks";
import { useDirectMessagesSignalR } from "@/features/messages/useDirectMessagesSignalR";
import ConversationList from "@/pages/Messages/components/ConversationList";
import MessageComposer from "@/pages/Messages/components/MessageComposer";
import MessageThread from "@/pages/Messages/components/MessageThread";

export default function MessagesPage() {
  const { token } = theme.useToken();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [selectedId, setSelectedId] = useState<string | null>(
    () => searchParams.get("conversation"),
  );
  const withUserHandled = useRef<string | null>(null);

  useDirectMessagesSignalR(isAuthenticated);

  const conversationsQuery = useConversationsQuery(isAuthenticated);
  const startMutation = useStartConversationMutation();
  const sendMutation = useSendMessageMutation();

  const withUser = searchParams.get("with");
  const conversationParam = searchParams.get("conversation");

  useEffect(() => {
    if (conversationParam && conversationParam !== selectedId) {
      setSelectedId(conversationParam);
    }
  }, [conversationParam, selectedId]);

  useEffect(() => {
    if (!withUser || !isAuthenticated || withUserHandled.current === withUser) {
      return;
    }

    if (withUser === user?.id) {
      withUserHandled.current = withUser;
      return;
    }

    withUserHandled.current = withUser;
    startMutation
      .mutateAsync(withUser)
      .then((res) => {
        setSelectedId(res.conversationId);
        setSearchParams({ conversation: res.conversationId }, { replace: true });
      })
      .catch(() => {
        withUserHandled.current = null;
      });
  }, [withUser, isAuthenticated, user?.id, startMutation, setSearchParams]);

  const messagesQuery = useMessagesQuery(selectedId ?? undefined, 1, Boolean(selectedId));

  const conversations = conversationsQuery.data ?? [];
  const selected = conversations.find((c) => c.id === selectedId);
  const messages = messagesQuery.data?.items ?? [];

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    setSearchParams({ conversation: id }, { replace: true });
  }

  async function handleSend(text: string) {
    if (!selectedId) {
      return;
    }
    await sendMutation.mutateAsync({ conversationId: selectedId, content: text });
  }

  if (!isAuthenticated) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Alert type="info" showIcon message="Mesajlar icin giris yapmalisiniz." />
      </Flex>
    );
  }

  return (
    <Flex style={{ minHeight: "calc(100vh - 64px)", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      <Flex
        vertical
        style={{
          width: 340,
          flexShrink: 0,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <Flex align="center" style={{ padding: "12px 16px", borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
          <Typography.Title level={4} style={{ margin: 0, flex: 1 }}>
            Mesajlar
          </Typography.Title>
        </Flex>
        <ConversationList
          items={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          isLoading={conversationsQuery.isLoading}
        />
      </Flex>

      <Flex vertical style={{ flex: 1, minWidth: 0, background: token.colorBgContainer }}>
        {!selectedId ? (
          <Flex align="center" justify="center" style={{ flex: 1, padding: 32 }}>
            <Typography.Text type="secondary">Bir konusma secin veya profilden mesaj baslatin.</Typography.Text>
          </Flex>
        ) : (
          <>
            <Flex
              align="center"
              gap={12}
              style={{
                padding: "12px 16px",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Avatar src={selected?.otherUserAvatarUrl ?? undefined} size={40}>
                {selected?.otherUserName.charAt(0) ?? "?"}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Typography.Text strong style={{ fontSize: 16 }}>
                  {selected?.otherUserName ?? "Kullanici"}
                </Typography.Text>
              </div>
            </Flex>

            {messagesQuery.isError ? (
              <Alert type="error" showIcon message="Mesajlar yuklenemedi." style={{ margin: 16 }} />
            ) : (
              <MessageThread
                messages={messages}
                currentUserId={user?.id}
                otherUserName={selected?.otherUserName ?? ""}
                otherAvatarUrl={selected?.otherUserAvatarUrl}
                isLoading={messagesQuery.isLoading}
              />
            )}

            <MessageComposer
              isSending={sendMutation.isPending}
              onSend={handleSend}
              disabled={!selectedId}
            />
          </>
        )}
      </Flex>
    </Flex>
  );
}
