import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { Maximize2, Send, Sparkles, SquarePen, X } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useStartSessionMutation,
  useSessionsQuery,
  useEndSessionMutation,
} from "@/features/chat/hooks";
import type { ChatMessageItem, ConfidenceBand } from "@/features/chat/types";
import { normalizeExternalHref } from "@/features/chat/linkUtils";

const EMPTY_MESSAGES: ChatMessageItem[] = [];

const QUICK_PROMPTS = [
  "Vize ne zaman?",
  "Burs başvurusu?",
  "Etkinlikler?",
];

interface EduAiPanelProps {
  onClose?: () => void;
}

export default function EduAiPanel({ onClose }: EduAiPanelProps) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [pendingUserMessages, setPendingUserMessages] = useState<ChatMessageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sessionsQuery = useSessionsQuery();
  const activeSession = sessionsQuery.data?.find((s) => s.isActive) ?? null;
  const sessionId = activeSession?.sessionId ?? null;

  const messagesQuery = useMessagesQuery(sessionId);
  const messages = messagesQuery.data ?? EMPTY_MESSAGES;
  const visibleMessages = [...messages, ...pendingUserMessages];

  const startSession = useStartSessionMutation();
  const endSession = useEndSessionMutation();
  const sendMessage = useSendMessageMutation();
  const isLoading = sendMessage.isPending;

  const handleNewChat = async () => {
    if (sessionId) {
      await endSession.mutateAsync(sessionId);
    }
    setInput("");
    setPendingUserMessages([]);
    setError(null);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
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

      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await startSession.mutateAsync();
        currentSessionId = session.sessionId;
      }
      await sendMessage.mutateAsync({ sessionId: currentSessionId, message: trimmed });
    } catch {
      setPendingUserMessages((current) =>
        current.filter((message) => message.content.trim() !== trimmed),
      );
      setError("Mesaj gönderilemedi.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 24,
        boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
        overflow: "hidden",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Flex align="center" gap={8}>
          <Sparkles size={16} />
          <Typography.Text strong>EduAI</Typography.Text>
        </Flex>
        <Flex gap={2}>
          <Button
            type="text"
            size="small"
            icon={<SquarePen size={14} />}
            title="Yeni sohbet"
            disabled={!sessionId || endSession.isPending}
            onClick={handleNewChat}
          />
          <Button
            type="text"
            size="small"
            icon={<Maximize2 size={14} />}
            onClick={() => { onClose?.(); navigate("/edu-ai"); }}
          />
          <Button
            type="text"
            size="small"
            icon={<X size={14} />}
            onClick={onClose}
          />
        </Flex>
      </Flex>

      <div
        ref={scrollRef}
        style={{
          height: screens.xs ? 280 : 320,
          overflowY: "auto",
          padding: 12,
        }}
      >
        {messagesQuery.isError && (
          <Alert
            type="error"
            showIcon
            style={{ marginBottom: 8 }}
            message="EduAI geçmişi yüklenemedi."
          />
        )}

        {visibleMessages.length === 0 && !isLoading ? (
          <Flex vertical align="center" justify="center" gap={12} style={{ height: "100%" }}>
            <Sparkles size={28} strokeWidth={1.5} />
            <Typography.Text type="secondary" style={{ textAlign: "center" }}>
              Merhaba. Size nasıl yardımcı olabilirim?
            </Typography.Text>
            <Flex gap={6} wrap justify="center">
              {QUICK_PROMPTS.map((p) => (
                <Button
                  key={p}
                  size="small"
                  shape="round"
                  onClick={() => { setInput(p); }}
                >
                  {p}
                </Button>
              ))}
            </Flex>
          </Flex>
        ) : (
          <Flex vertical gap={10}>
            {visibleMessages.map((msg) => (
              <PanelBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <Flex gap={6} align="center">
                <Spin size="small" />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Düşünüyor...
                </Typography.Text>
              </Flex>
            )}
          </Flex>
        )}
      </div>

      <div style={{ padding: "8px 12px 12px", borderTop: `1px solid ${token.colorBorderSecondary}` }}>
        {error && <Alert message={error} type="error" closable onClose={() => setError(null)} style={{ marginBottom: 6 }} />}
        <Flex gap={6}>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Sorunuzu yazın..."
            size="middle"
            style={{ borderRadius: 10 }}
          />
          <Button
            type="primary"
            icon={<Send size={14} />}
            onClick={handleSend}
            loading={isLoading}
            disabled={!input.trim()}
            style={{ borderRadius: 10 }}
          />
        </Flex>
      </div>
    </Card>
  );
}

function PanelBubble({ message }: { message: ChatMessageItem }) {
  const { token } = theme.useToken();
  const isUser = message.senderType === "user";
  const confidenceTag = getConfidenceTag(message.confidenceBand ?? null);

  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"}>
      <div
        style={{
          maxWidth: "85%",
          padding: "8px 12px",
          borderRadius: isUser ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
          background: isUser ? token.colorPrimary : token.colorBgContainer,
          color: isUser ? "#fff" : token.colorText,
          border: isUser ? "none" : `1px solid ${token.colorBorderSecondary}`,
          fontSize: 13,
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {message.content}
          </span>
        ) : (
          <>
            <div className="markdown-body" style={{ wordBreak: "break-word", fontSize: 13 }}>
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
            <Flex gap={4} wrap style={{ marginTop: 6 }}>
              {message.intentDetected && (
                <Tag color="blue" style={{ fontSize: 10, lineHeight: "16px" }}>
                  {message.intentDetected}
                </Tag>
              )}
              {confidenceTag && (
                <Tag color={confidenceTag.color} style={{ fontSize: 10, lineHeight: "16px" }}>
                  {confidenceTag.label}
                </Tag>
              )}
              {message.kbHit && (
                <Tag color="green" style={{ fontSize: 10, lineHeight: "16px" }}>
                  KB
                </Tag>
              )}
              {message.isFallback && (
                <Tag color="orange" style={{ fontSize: 10, lineHeight: "16px" }}>
                  fallback
                </Tag>
              )}
            </Flex>
            {message.needsReview && (
              <Typography.Text type="warning" style={{ display: "block", marginTop: 6, fontSize: 11 }}>
                Bu cevap düşük güven sinyali taşıyor.
              </Typography.Text>
            )}
          </>
        )}
      </div>
    </Flex>
  );
}

function getConfidenceTag(confidenceBand: ConfidenceBand | null) {
  switch (confidenceBand) {
    case "high":
      return { color: "green", label: "yüksek güven" };
    case "medium":
      return { color: "gold", label: "orta güven" };
    case "low":
      return { color: "red", label: "düşük güven" };
    default:
      return null;
  }
}
