import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Avatar,
  Button,
  Flex,
  Grid,
  Input,
  Tag,
  Typography,
  theme,
} from "antd";
import { Send, Sparkles, Trash2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useStartSessionMutation,
  useEndSessionMutation,
  useSessionsQuery,
} from "@/features/chat/hooks";
import type { ChatMessageItem, ConfidenceBand } from "@/features/chat/types";
import { normalizeExternalHref } from "@/features/chat/linkUtils";
import SessionHistory from "@/pages/EduAI/components/SessionHistory";

const EMPTY_MESSAGES: ChatMessageItem[] = [];

const QUICK_PROMPTS = [
  "Vize sınavları ne zaman başlıyor?",
  "Burs başvurusu nasıl yapılır?",
  "Bu hafta kampüste etkinlik var mı?",
  "Not ortalaması nasıl hesaplanır?",
];

export default function EduAiPage() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState(searchParams.get("prompt") ?? "");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [pendingUserMessages, setPendingUserMessages] = useState<ChatMessageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sessionsQuery = useSessionsQuery();
  const sessions = sessionsQuery.data ?? [];
  const activeSession = sessions.find((s) => s.isActive) ?? null;
  const sessionId = selectedSessionId ?? activeSession?.sessionId ?? null;
  const isViewingOldSession = sessionId !== null && sessionId !== activeSession?.sessionId;

  const messagesQuery = useMessagesQuery(sessionId);
  const messages = messagesQuery.data ?? EMPTY_MESSAGES;
  const visibleMessages = [...messages, ...pendingUserMessages];
  const isWaitingForBot =
    pendingUserMessages.length > 0 &&
    visibleMessages[visibleMessages.length - 1]?.senderType === "user";

  const startSession = useStartSessionMutation();
  const sendMessage = useSendMessageMutation();
  const endSessionMut = useEndSessionMutation();
  const isLoading = startSession.isPending || sendMessage.isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, isLoading]);

  useEffect(() => {
    if (pendingUserMessages.length === 0) return;

    setPendingUserMessages((current) => {
      const next = current.filter(
        (pending) =>
          !messages.some(
            (message) =>
              message.senderType === "user" &&
              message.content.trim() === pending.content.trim(),
          ),
      );

      return next.length === current.length ? current : next;
    });
  }, [messages, pendingUserMessages.length]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    if (isViewingOldSession) setSelectedSessionId(null);

    try {
      const optimisticMessage: ChatMessageItem = {
        id: `pending-${Date.now()}`,
        senderType: "user",
        content: trimmed,
        intentDetected: null,
        confidence: null,
        timestampUtc: new Date().toISOString(),
      };

      setPendingUserMessages((current) => [...current, optimisticMessage]);
      setInput("");

      let sid = activeSession?.sessionId ?? null;
      if (!sid) {
        const session = await startSession.mutateAsync();
        sid = session.sessionId;
        setSelectedSessionId(null);
      }
      await sendMessage.mutateAsync({ sessionId: sid, message: trimmed });
    } catch {
      setPendingUserMessages((current) =>
        current.filter((message) => message.content.trim() !== trimmed),
      );
      setError("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleNewChat = async () => {
    if (activeSession) await endSessionMut.mutateAsync(activeSession.sessionId);
    setSelectedSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const padding = screens.xs ? 16 : 24;

  return (
    <Flex style={{ height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {screens.md && (
        <SessionHistory
          sessions={sessions}
          activeSessionId={sessionId}
          onSelectSession={setSelectedSessionId}
          onNewChat={handleNewChat}
        />
      )}

      <Flex vertical style={{ flex: 1, overflow: "hidden" }}>
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          style={{
            padding: `12px ${padding}px`,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          <Flex align="center" gap={10}>
            <Sparkles size={20} />
            <Typography.Title level={4} style={{ margin: 0 }}>
              EduAI Asistan
            </Typography.Title>
            {isViewingOldSession && <Tag color="default">Geçmiş sohbet</Tag>}
          </Flex>
          {activeSession && (
            <Button
              type="text"
              icon={<Trash2 size={16} />}
              onClick={() => void handleNewChat()}
              loading={endSessionMut.isPending}
            >
              Yeni Sohbet
            </Button>
          )}
        </Flex>

        {/* Message area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `${padding}px`,
            background: token.colorBgLayout,
          }}
        >
          {messagesQuery.isError && (
            <Alert
              type="error"
              showIcon
              message="Sohbet geçmişi yüklenemedi."
              style={{ maxWidth: 760, margin: "0 auto 12px" }}
            />
          )}

          {visibleMessages.length === 0 && !isLoading ? (
            <WelcomeView
              onQuickPrompt={(p) => {
                setInput(p);
                inputRef.current?.focus();
              }}
            />
          ) : (
            <Flex vertical style={{ maxWidth: 760, margin: "0 auto", gap: 2 }}>
              {visibleMessages.map((msg, index) => {
                const prev = visibleMessages[index - 1];
                const next = visibleMessages[index + 1];
                const isFirstInGroup = !prev || prev.senderType !== msg.senderType;
                const isLastInGroup = !next || next.senderType !== msg.senderType;
                const isPending = msg.id.startsWith("pending-");

                return (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                    isPending={isPending}
                  />
                );
              })}

              {/* Bot yazıyor göstergesi */}
              {isWaitingForBot && (
                <Flex gap={8} align="flex-end" style={{ marginBottom: 8, marginTop: 4 }}>
                  <BotAvatar />
                  <TypingIndicator />
                </Flex>
              )}

              <div ref={messagesEndRef} />
            </Flex>
          )}
        </div>

        {/* Composer */}
        <div
          style={{
            padding: `12px ${padding}px 16px`,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            flexShrink: 0,
          }}
        >
          {error && (
            <Alert
              message={error}
              type="error"
              closable
              onClose={() => setError(null)}
              style={{ maxWidth: 760, margin: "0 auto 8px" }}
            />
          )}
          <Flex gap={8} style={{ maxWidth: 760, margin: "0 auto" }} align="flex-end">
            <Input.TextArea
              ref={inputRef as never}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sorunuzu yazın... (Enter: gönder, Shift+Enter: yeni satır)"
              autoSize={{ minRows: 1, maxRows: 6 }}
              style={{ borderRadius: 20, resize: "none", flex: 1 }}
              disabled={isLoading}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<Send size={16} />}
              onClick={() => void handleSend()}
              loading={isLoading}
              disabled={!input.trim()}
              style={{ flexShrink: 0 }}
            />
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
}

function BotAvatar() {
  const { token } = theme.useToken();
  return (
    <Avatar
      size={32}
      style={{
        background: token.colorPrimaryBg,
        color: token.colorPrimary,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      icon={<Sparkles size={16} />}
    />
  );
}

function TypingIndicator() {
  const { token } = theme.useToken();
  return (
    <div
      style={{
        padding: "10px 16px",
        borderRadius: "18px 18px 18px 4px",
        background: token.colorBgContainer,
        border: `1px solid ${token.colorBorderSecondary}`,
        display: "flex",
        gap: 4,
        alignItems: "center",
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: token.colorTextQuaternary,
            display: "inline-block",
            animation: `eduai-typing 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes eduai-typing {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function MessageBubble({
  message,
  isFirstInGroup,
  isLastInGroup,
  isPending,
}: {
  message: ChatMessageItem;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  isPending: boolean;
}) {
  const { token } = theme.useToken();
  const isUser = message.senderType === "user";
  const confidenceTag = getConfidenceTag(message.confidenceBand ?? null);

  const borderRadius = isUser
    ? `18px 18px ${isLastInGroup ? 4 : 18}px 18px`
    : `18px 18px 18px ${isLastInGroup ? 4 : 18}px`;

  return (
    <Flex
      justify={isUser ? "flex-end" : "flex-start"}
      style={{ width: "100%", marginBottom: isLastInGroup ? 8 : 2 }}
    >
      <Flex
        gap={8}
        align="flex-end"
        style={{ maxWidth: "80%", flexDirection: isUser ? "row-reverse" : "row" }}
      >
        {/* Bot avatar — sadece son mesajda göster */}
        {!isUser && (
          <div style={{ width: 32, flexShrink: 0 }}>
            {isLastInGroup && <BotAvatar />}
          </div>
        )}

        <Flex vertical gap={4} style={{ alignItems: isUser ? "flex-end" : "flex-start" }}>
          <div
            style={{
              padding: "10px 14px",
              borderRadius,
              background: isUser ? token.colorPrimary : token.colorBgContainer,
              color: isUser ? "#fff" : token.colorText,
              border: isUser ? "none" : `1px solid ${token.colorBorderSecondary}`,
              opacity: isPending ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {isUser ? (
              <Typography.Text
                style={{
                  color: "rgba(255,255,255,0.95)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontSize: 15,
                }}
              >
                {message.content}
              </Typography.Text>
            ) : (
              <>
                <div className="markdown-body" style={{ wordBreak: "break-word", fontSize: 15 }}>
                  <Markdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ href, children, ...props }) => (
                        <a
                          {...props}
                          href={normalizeExternalHref(href)}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {children}
                        </a>
                      ),
                    }}
                  >
                    {message.content}
                  </Markdown>
                </div>

                <Flex gap={6} wrap style={{ marginTop: 6 }}>
                  {message.intentDetected && (
                    <Tag color="blue">{message.intentDetected}</Tag>
                  )}
                  {confidenceTag && (
                    <Tag color={confidenceTag.color}>{confidenceTag.label}</Tag>
                  )}
                  {message.kbHit && <Tag color="green">KB bağlı</Tag>}
                  {message.isFallback && <Tag color="orange">Fallback</Tag>}
                  {message.modelUsed && <Tag>{message.modelUsed}</Tag>}
                </Flex>

                {message.needsReview && (
                  <Alert
                    type="warning"
                    showIcon
                    style={{ marginTop: 8 }}
                    message="Bu cevap düşük güven sinyali taşıyor. Resmî kaynağı kontrol etmeniz daha güvenli olur."
                  />
                )}
              </>
            )}
          </div>

          {/* Zaman damgası — sadece grup sonunda */}
          {isLastInGroup && !isPending && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 11, paddingInline: 2 }}
            >
              {formatMessageTime(message.timestampUtc)}
            </Typography.Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

function WelcomeView({ onQuickPrompt }: { onQuickPrompt: (p: string) => void }) {
  const screens = Grid.useBreakpoint();

  return (
    <Flex vertical align="center" justify="center" gap={24} style={{ minHeight: "60vh" }}>
      <Sparkles size={48} strokeWidth={1.5} />
      <Typography.Title level={screens.xs ? 3 : 2} style={{ margin: 0, textAlign: "center" }}>
        EduAI Asistan
      </Typography.Title>
      <Typography.Text
        type="secondary"
        style={{ fontSize: 16, textAlign: "center", maxWidth: 480 }}
      >
        Kampüs yaşamı, dersler, sınavlar, burslar ve daha fazlası hakkında sorularınızı yanıtlıyorum.
      </Typography.Text>
      <Flex gap={8} wrap justify="center" style={{ maxWidth: 520 }}>
        {QUICK_PROMPTS.map((p) => (
          <Button key={p} shape="round" onClick={() => onQuickPrompt(p)} style={{ fontWeight: 500 }}>
            {p}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
}

function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDay = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

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

function getConfidenceTag(confidenceBand: ConfidenceBand | null) {
  switch (confidenceBand) {
    case "high":
      return { color: "green", label: "Yüksek güven" };
    case "medium":
      return { color: "gold", label: "Orta güven" };
    case "low":
      return { color: "red", label: "Düşük güven" };
    default:
      return null;
  }
}
