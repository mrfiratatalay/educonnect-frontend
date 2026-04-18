import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  Skeleton,
  Typography,
  theme,
} from "antd";
import {
  ArrowLeft,
  Maximize2,
  MessageSquarePlus,
  Search,
  SendHorizontal,
  X,
} from "lucide-react";
import {
  useConversationsQuery,
  useInfiniteMessagesQuery,
  useSendMessageMutation,
  useStartConversationMutation,
  useUserSearchQuery,
} from "@/features/messages/hooks";
import { useAuthStore } from "@/store/authStore";
import type { ConversationSummary } from "@/features/messages/types";

interface MessagesLauncherPanelProps {
  onClose: () => void;
  onExpand: () => void;
}

const panelShadow =
  "0 24px 80px rgba(15, 23, 42, 0.18), 0 10px 32px rgba(15, 23, 42, 0.08)";

type PanelView = "list" | "thread" | "search";

export default function MessagesLauncherPanel({
  onClose,
  onExpand,
}: MessagesLauncherPanelProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [view, setView] = useState<PanelView>("list");
  const [selectedConv, setSelectedConv] = useState<ConversationSummary | null>(null);
  const [searchQ, setSearchQ] = useState("");

  const conversationsQuery = useConversationsQuery(isAuthenticated);
  const startMutation = useStartConversationMutation();

  function handleSelectConv(conv: ConversationSummary) {
    setSelectedConv(conv);
    setView("thread");
  }

  async function handleStartConv(
    userId: string,
    userName: string,
    avatarUrl?: string | null,
  ) {
    const res = await startMutation.mutateAsync(userId);
    // Konuşmalar refetch olana kadar geçici bir conv objesi kullan
    const syntheticConv: ConversationSummary = {
      id: res.conversationId,
      otherUserId: userId,
      otherUserName: userName,
      otherUserAvatarUrl: avatarUrl ?? null,
      lastMessagePreview: null,
      lastMessageAtUtc: new Date().toISOString(),
    };
    setSelectedConv(syntheticConv);
    setView("thread");
    setSearchQ("");
  }

  function handleExpand() {
    if (selectedConv) {
      navigate(`/messages?conversation=${selectedConv.id}`);
    } else {
      navigate("/messages");
    }
    onExpand();
  }

  function goBack() {
    setView("list");
    setSelectedConv(null);
    setSearchQ("");
  }

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 24,
        borderColor: token.colorBorderSecondary,
        background: token.colorBgContainer,
        boxShadow: panelShadow,
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "12px 14px 10px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Flex align="center" gap={6}>
          {view !== "list" && (
            <Button
              type="text"
              shape="circle"
              icon={<ArrowLeft size={18} />}
              onClick={goBack}
              style={{ width: 34, height: 34 }}
            />
          )}
          <Typography.Title level={5} style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
            {view === "thread" && selectedConv
              ? selectedConv.otherUserName
              : view === "search"
              ? "Yeni Mesaj"
              : "Sohbet"}
          </Typography.Title>
        </Flex>

        <Flex align="center" gap={2}>
          {view === "list" && (
            <Button
              type="text"
              shape="circle"
              icon={<MessageSquarePlus size={17} />}
              onClick={() => setView("search")}
              style={{ width: 34, height: 34 }}
              title="Yeni mesaj"
            />
          )}
          <Button
            type="text"
            shape="circle"
            icon={<Maximize2 size={15} />}
            onClick={handleExpand}
            style={{ width: 34, height: 34 }}
            title="Tam ekranda aç"
          />
          <Button
            type="text"
            shape="circle"
            icon={<X size={17} />}
            onClick={onClose}
            style={{ width: 34, height: 34 }}
          />
        </Flex>
      </Flex>

      {/* Body — sabit yükseklik */}
      <div style={{ height: 440, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {view === "list" && (
          <ConversationListView
            conversations={conversationsQuery.data ?? []}
            isLoading={conversationsQuery.isLoading}
            onSelect={handleSelectConv}
          />
        )}

        {view === "search" && (
          <UserSearchView
            searchQ={searchQ}
            onSearchChange={setSearchQ}
            onSelect={handleStartConv}
            isStarting={startMutation.isPending}
          />
        )}

        {view === "thread" && selectedConv && (
          <ThreadView conv={selectedConv} />
        )}
      </div>
    </Card>
  );
}

/* ─────────────────────────────────────────────
   Konuşma Listesi
───────────────────────────────────────────── */
function ConversationListView({
  conversations,
  isLoading,
  onSelect,
}: {
  conversations: ConversationSummary[];
  isLoading: boolean;
  onSelect: (c: ConversationSummary) => void;
}) {
  const { token } = theme.useToken();

  if (isLoading) {
    return (
      <Flex vertical gap={8} style={{ padding: 14 }}>
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton active avatar paragraph={{ rows: 1 }} />
        <Skeleton active avatar paragraph={{ rows: 1 }} />
      </Flex>
    );
  }

  if (conversations.length === 0) {
    return (
      <Flex align="center" justify="center" style={{ flex: 1 }}>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Henüz konuşma yok. Yeni mesaj başlat.
            </Typography.Text>
          }
        />
      </Flex>
    );
  }

  return (
    <div style={{ overflowY: "auto", flex: 1 }}>
      {conversations.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            width: "100%",
            padding: "11px 16px",
            border: "none",
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          <Avatar src={c.otherUserAvatarUrl ?? undefined} size={44}>
            {c.otherUserName.charAt(0)}
          </Avatar>
          <div style={{ minWidth: 0, flex: 1 }}>
            <Typography.Text strong ellipsis style={{ display: "block", fontSize: 14 }}>
              {c.otherUserName}
            </Typography.Text>
            {c.lastMessagePreview && (
              <Typography.Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                {c.lastMessagePreview}
              </Typography.Text>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Kullanıcı Arama
───────────────────────────────────────────── */
function UserSearchView({
  searchQ,
  onSearchChange,
  onSelect,
  isStarting,
}: {
  searchQ: string;
  onSearchChange: (q: string) => void;
  onSelect: (userId: string, userName: string, avatarUrl?: string | null) => Promise<void>;
  isStarting: boolean;
}) {
  const { token } = theme.useToken();
  const searchQuery = useUserSearchQuery(searchQ);

  return (
    <Flex vertical style={{ flex: 1, overflow: "hidden" }}>
      <div style={{ padding: "10px 14px" }}>
        <Input
          autoFocus
          prefix={<Search size={15} style={{ color: token.colorTextTertiary }} />}
          placeholder="Kullanıcı ara..."
          value={searchQ}
          onChange={(e) => onSearchChange(e.target.value)}
          variant="filled"
          style={{ borderRadius: 20 }}
          allowClear
        />
      </div>

      <div style={{ overflowY: "auto", flex: 1, padding: "0 6px" }}>
        {searchQ.trim().length < 2 ? (
          <Flex align="center" justify="center" style={{ padding: 32 }}>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              En az 2 karakter yazın.
            </Typography.Text>
          </Flex>
        ) : searchQuery.isLoading ? (
          <Flex vertical gap={8} style={{ padding: 12 }}>
            <Skeleton active avatar paragraph={{ rows: 0 }} />
            <Skeleton active avatar paragraph={{ rows: 0 }} />
          </Flex>
        ) : searchQuery.data && searchQuery.data.length > 0 ? (
          searchQuery.data.map((u) => (
            <button
              key={u.id}
              type="button"
              disabled={isStarting}
              onClick={() => void onSelect(u.id, u.fullName, u.avatarUrl)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "9px 10px",
                border: "none",
                borderRadius: 10,
                background: "transparent",
                cursor: isStarting ? "not-allowed" : "pointer",
                textAlign: "left",
              }}
            >
              <Avatar src={u.avatarUrl ?? undefined} size={40}>
                {u.fullName.charAt(0)}
              </Avatar>
              <div style={{ minWidth: 0, flex: 1 }}>
                <Typography.Text strong ellipsis style={{ display: "block", fontSize: 14 }}>
                  {u.fullName}
                </Typography.Text>
                {u.department && (
                  <Typography.Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                    {u.department}
                  </Typography.Text>
                )}
              </div>
            </button>
          ))
        ) : (
          <Flex align="center" justify="center" style={{ padding: 32 }}>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Kullanıcı bulunamadı.
            </Typography.Text>
          </Flex>
        )}
      </div>
    </Flex>
  );
}

/* ─────────────────────────────────────────────
   Mesaj Thread
───────────────────────────────────────────── */
function ThreadView({ conv }: { conv: ConversationSummary }) {
  const { token } = theme.useToken();
  const user = useAuthStore((s) => s.user);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesQuery = useInfiniteMessagesQuery(conv.id, true);
  const sendMutation = useSendMessageMutation();
  const messages = messagesQuery.data?.messages ?? [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleSend() {
    const trimmed = text.trim();
    if (!trimmed || sendMutation.isPending) return;
    setText("");
    await sendMutation.mutateAsync({ conversationId: conv.id, content: trimmed });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <Flex vertical style={{ flex: 1, overflow: "hidden" }}>
      {/* Mesaj alanı */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px 12px",
          background: token.colorBgLayout,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {messagesQuery.isLoading ? (
          <Flex vertical gap={10} style={{ padding: 8 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
            <Skeleton active paragraph={{ rows: 1 }} />
          </Flex>
        ) : messages.length === 0 ? (
          <Flex align="center" justify="center" style={{ flex: 1 }}>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              İlk mesajı siz gönderin!
            </Typography.Text>
          </Flex>
        ) : (
          messages.map((m, index) => {
            const mine =
              m.senderUserId === user?.id || m.senderUserId === "__optimistic__";
            const isPending = m.senderUserId === "__optimistic__";
            const next = messages[index + 1];
            const isLastInGroup = !next || next.senderUserId !== m.senderUserId;

            return (
              <Flex
                key={m.id}
                justify={mine ? "flex-end" : "flex-start"}
                style={{ marginBottom: isLastInGroup ? 6 : 1 }}
              >
                <Flex
                  gap={6}
                  align="flex-end"
                  style={{
                    maxWidth: "82%",
                    flexDirection: mine ? "row-reverse" : "row",
                  }}
                >
                  {!mine && (
                    <div style={{ width: 26, flexShrink: 0 }}>
                      {isLastInGroup && (
                        <Avatar
                          src={conv.otherUserAvatarUrl ?? undefined}
                          size={26}
                        >
                          {conv.otherUserName.charAt(0)}
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div
                    style={{
                      padding: "8px 12px",
                      borderRadius: mine
                        ? `14px 14px ${isLastInGroup ? 4 : 14}px 14px`
                        : `14px 14px 14px ${isLastInGroup ? 4 : 14}px`,
                      background: mine ? token.colorPrimary : token.colorBgContainer,
                      color: mine ? "#fff" : token.colorText,
                      border: mine
                        ? "none"
                        : `1px solid ${token.colorBorderSecondary}`,
                      fontSize: 14,
                      lineHeight: 1.45,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      opacity: isPending ? 0.65 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    {m.content}
                  </div>
                </Flex>
              </Flex>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <Flex
        gap={8}
        align="flex-end"
        style={{
          padding: "10px 12px",
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          flexShrink: 0,
        }}
      >
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesaj yaz..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1, borderRadius: 16, resize: "none", fontSize: 14 }}
          disabled={sendMutation.isPending}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendHorizontal size={15} />}
          loading={sendMutation.isPending}
          disabled={!text.trim()}
          onClick={() => void handleSend()}
          style={{ flexShrink: 0 }}
        />
      </Flex>
    </Flex>
  );
}
