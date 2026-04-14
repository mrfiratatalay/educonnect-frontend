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
import { Maximize2, Send, Sparkles, X } from "lucide-react";
import Markdown from "react-markdown";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useStartSessionMutation,
  useSessionsQuery,
} from "@/features/chat/hooks";
import type { ChatMessageItem } from "@/features/chat/types";

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

  const sessionsQuery = useSessionsQuery();
  const activeSession = sessionsQuery.data?.find((s) => s.isActive) ?? null;
  const sessionId = activeSession?.sessionId ?? null;

  const messagesQuery = useMessagesQuery(sessionId);
  const messages = messagesQuery.data ?? [];

  const startSession = useStartSessionMutation();
  const sendMessage = useSendMessageMutation();
  const isLoading = sendMessage.isPending;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, isLoading]);

  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const session = await startSession.mutateAsync();
        currentSessionId = session.sessionId;
      }

      setInput("");
      await sendMessage.mutateAsync({ sessionId: currentSessionId, message: trimmed });
    } catch {
      setError("Mesaj gonderilemedi.");
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
        {messages.length === 0 && !isLoading ? (
          <Flex vertical align="center" justify="center" gap={12} style={{ height: "100%" }}>
            <Sparkles size={28} strokeWidth={1.5} />
            <Typography.Text type="secondary" style={{ textAlign: "center" }}>
              Merhaba! Size nasıl yardımcı olabilirim?
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
            {messages.map((msg) => (
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
            disabled={isLoading}
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
          <div className="markdown-body" style={{ wordBreak: "break-word", fontSize: 13 }}>
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        {!isUser && message.intentDetected && (
          <div style={{ marginTop: 4 }}>
            <Tag color="blue" style={{ fontSize: 10, lineHeight: "16px" }}>
              {message.intentDetected}
            </Tag>
          </div>
        )}
      </div>
    </Flex>
  );
}
