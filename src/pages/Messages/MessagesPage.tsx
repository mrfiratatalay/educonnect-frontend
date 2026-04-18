import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Modal,
  Skeleton,
  Typography,
  theme,
} from "antd";
import { SquarePen } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  useConversationsQuery,
  useInfiniteMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useUserSearchQuery,
} from "@/features/messages/hooks";
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
  const [newConvOpen, setNewConvOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [composerText, setComposerText] = useState("");
  const withUserHandled = useRef<string | null>(null);
  const draftSeedHandled = useRef<string | null>(null);

  const conversationsQuery = useConversationsQuery(isAuthenticated);
  const startMutation = useStartConversationMutation();
  const sendMutation = useSendMessageMutation();

  const withUser = searchParams.get("with");
  const conversationParam = searchParams.get("conversation");
  const productId = searchParams.get("productId");
  const productTitle = searchParams.get("productTitle");
  const draftSeed = productTitle
    ? `Merhaba, ${productTitle} ilaninizla ilgileniyorum. Urun hala uygun mu?`
    : "";

  useEffect(() => {
    if (conversationParam && conversationParam !== selectedId) {
      setSelectedId(conversationParam);
    }
  }, [conversationParam, selectedId]);

  useEffect(() => {
    if (!draftSeed || draftSeedHandled.current === draftSeed) {
      return;
    }

    draftSeedHandled.current = draftSeed;
    setComposerText((current) => (current.trim().length > 0 ? current : draftSeed));
  }, [draftSeed]);

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
        const nextParams = new URLSearchParams();
        nextParams.set("conversation", res.conversationId);
        if (productId) nextParams.set("productId", productId);
        if (productTitle) nextParams.set("productTitle", productTitle);
        setSearchParams(nextParams, { replace: true });
      })
      .catch(() => {
        withUserHandled.current = null;
      });
  }, [withUser, isAuthenticated, user?.id, startMutation, setSearchParams, productId, productTitle]);

  const messagesQuery = useInfiniteMessagesQuery(
    selectedId ?? undefined,
    Boolean(selectedId),
  );

  const conversations = conversationsQuery.data ?? [];
  const selected = conversations.find((c) => c.id === selectedId);
  const messages = messagesQuery.data?.messages ?? [];

  function handleSelectConversation(id: string) {
    setSelectedId(id);
    const nextParams = new URLSearchParams();
    nextParams.set("conversation", id);
    if (productId) nextParams.set("productId", productId);
    if (productTitle) nextParams.set("productTitle", productTitle);
    setSearchParams(nextParams, { replace: true });
  }

  async function handleSend(text: string) {
    if (!selectedId) return;
    await sendMutation.mutateAsync({ conversationId: selectedId, content: text });
  }

  async function handleStartConversation(otherUserId: string) {
    const res = await startMutation.mutateAsync(otherUserId);
    setSelectedId(res.conversationId);
    const nextParams = new URLSearchParams();
    nextParams.set("conversation", res.conversationId);
    if (productId) nextParams.set("productId", productId);
    if (productTitle) nextParams.set("productTitle", productTitle);
    setSearchParams(nextParams, { replace: true });
    setNewConvOpen(false);
    setSearchQ("");
  }

  if (!isAuthenticated) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Alert type="info" showIcon message="Mesajlar için giriş yapmalisiniz." />
      </Flex>
    );
  }

  return (
    <>
      <Flex
        style={{
          minHeight: "calc(100vh - 64px)",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* Sol panel — konuşma listesi */}
        <Flex
          vertical
          style={{
            width: 340,
            flexShrink: 0,
            borderRight: `1px solid ${token.colorBorderSecondary}`,
            background: token.colorBgContainer,
          }}
        >
          <Flex
            align="center"
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Typography.Title level={4} style={{ margin: 0, flex: 1 }}>
              Mesajlar
            </Typography.Title>
            <Button
              type="text"
              shape="circle"
              icon={<SquarePen size={20} />}
              onClick={() => setNewConvOpen(true)}
              title="Yeni mesaj"
            />
          </Flex>

          <ConversationList
            items={conversations}
            selectedId={selectedId}
            onSelect={handleSelectConversation}
            isLoading={conversationsQuery.isLoading}
          />
        </Flex>

        {/* Sağ panel — mesaj thread */}
        <Flex vertical style={{ flex: 1, minWidth: 0, background: token.colorBgContainer }}>
          {!selectedId ? (
            <Flex align="center" justify="center" style={{ flex: 1, padding: 32 }}>
              <Typography.Text type="secondary">
                Bir konusma secin veya yeni mesaj baslatin.
              </Typography.Text>
            </Flex>
          ) : (
            <>
              <Flex
                align="center"
                gap={12}
                style={{
                  padding: "12px 16px",
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  flexShrink: 0,
                }}
              >
                <Avatar src={selected?.otherUserAvatarUrl ?? undefined} size={40}>
                  {selected?.otherUserName.charAt(0) ?? "?"}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <Typography.Text strong style={{ fontSize: 16 }}>
                    {selected?.otherUserName ?? "Kullanıcı"}
                  </Typography.Text>
                </div>
              </Flex>

              {messagesQuery.isError ? (
                <Alert
                  type="error"
                  showIcon
                  message="Mesajlar yüklenemedi."
                  style={{ margin: 16 }}
                />
              ) : (
                <>
                  {productTitle ? (
                    <div style={{ padding: "12px 16px 0" }}>
                      <Card size="small" styles={{ body: { padding: 12 } }}>
                        <Typography.Text strong style={{ display: "block" }}>
                          Ilan baglami
                        </Typography.Text>
                        <Typography.Text type="secondary">
                          Bu konusma su ilan için acildi: {productTitle}
                        </Typography.Text>
                      </Card>
                    </div>
                  ) : null}
                  <MessageThread
                    messages={messages}
                    currentUserId={user?.id}
                    otherUserName={selected?.otherUserName ?? ""}
                    otherAvatarUrl={selected?.otherUserAvatarUrl}
                    isLoading={messagesQuery.isLoading}
                    hasOlderMessages={messagesQuery.data?.hasOlderMessages ?? false}
                    isFetchingOlder={messagesQuery.isFetchingNextPage}
                    onLoadOlder={() => void messagesQuery.fetchNextPage()}
                  />
                </>
              )}

              <MessageComposer
                isSending={sendMutation.isPending}
                onSend={handleSend}
                disabled={!selectedId}
                value={composerText}
                onValueChange={setComposerText}
              />
            </>
          )}
        </Flex>
      </Flex>

      {/* Yeni konuşma modalı */}
      <NewConversationModal
        open={newConvOpen}
        onClose={() => {
          setNewConvOpen(false);
          setSearchQ("");
        }}
        searchQ={searchQ}
        onSearchChange={setSearchQ}
        onSelect={handleStartConversation}
        isStarting={startMutation.isPending}
      />
    </>
  );
}

function NewConversationModal({
  open,
  onClose,
  searchQ,
  onSearchChange,
  onSelect,
  isStarting,
}: {
  open: boolean;
  onClose: () => void;
  searchQ: string;
  onSearchChange: (q: string) => void;
  onSelect: (userId: string) => Promise<void>;
  isStarting: boolean;
}) {
  const { token } = theme.useToken();
  const searchQuery = useUserSearchQuery(searchQ);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Yeni mesaj"
      footer={null}
      destroyOnClose
    >
      <Flex vertical gap={12}>
        <Input
          autoFocus
          placeholder="Kullanıcı ara..."
          value={searchQ}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
        />

        {searchQ.trim().length < 2 ? (
          <Typography.Text type="secondary" style={{ fontSize: 13, textAlign: "center" }}>
            En az 2 karakter yazin.
          </Typography.Text>
        ) : searchQuery.isLoading ? (
          <Flex vertical gap={8}>
            <Skeleton active avatar paragraph={{ rows: 0 }} />
            <Skeleton active avatar paragraph={{ rows: 0 }} />
          </Flex>
        ) : searchQuery.data && searchQuery.data.length > 0 ? (
          <Flex vertical>
            {searchQuery.data.map((u) => (
              <button
                key={u.id}
                type="button"
                disabled={isStarting}
                onClick={() => void onSelect(u.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  border: "none",
                  borderRadius: 8,
                  background: "transparent",
                  cursor: isStarting ? "not-allowed" : "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    token.colorFillTertiary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <Avatar src={u.avatarUrl ?? undefined} size={40}>
                  {u.fullName.charAt(0)}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <Typography.Text strong ellipsis style={{ display: "block" }}>
                    {u.fullName}
                  </Typography.Text>
                  {u.department && (
                    <Typography.Text type="secondary" ellipsis style={{ fontSize: 13, display: "block" }}>
                      {u.department}
                      {u.universityName ? ` · ${u.universityName}` : ""}
                    </Typography.Text>
                  )}
                </div>
              </button>
            ))}
          </Flex>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<Typography.Text type="secondary">Kullanıcı bulunamadi</Typography.Text>}
          />
        )}
      </Flex>
    </Modal>
  );
}
