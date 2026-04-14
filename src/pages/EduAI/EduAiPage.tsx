import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Flex,
  Grid,
  Input,
  Spin,
  Tag,
  Typography,
  theme,
} from "antd";
import { Send, Sparkles, Trash2 } from "lucide-react";
import Markdown from "react-markdown";
import {
  useMessagesQuery,
  useSendMessageMutation,
  useStartSessionMutation,
  useEndSessionMutation,
  useSessionsQuery,
} from "@/features/chat/hooks";
import type { ChatMessageItem } from "@/features/chat/types";
import SessionHistory from "@/pages/EduAI/components/SessionHistory";

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

  const sessionsQuery = useSessionsQuery();
  const sessions = sessionsQuery.data ?? [];
  const activeSession = sessions.find((s) => s.isActive) ?? null;
  const sessionId = selectedSessionId ?? activeSession?.sessionId ?? null;
  const isViewingOldSession = sessionId !== null && sessionId !== activeSession?.sessionId;

  const messagesQuery = useMessagesQuery(sessionId);
  const messages = messagesQuery.data ?? [];

  const startSession = useStartSessionMutation();
  const sendMessage = useSendMessageMutation();
  const endSessionMut = useEndSessionMutation();
  const isLoading = sendMessage.isPending;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setError(null);

    if (isViewingOldSession) setSelectedSessionId(null);

    try {
      let sid = activeSession?.sessionId ?? null;
      if (!sid) {
        const session = await startSession.mutateAsync();
        sid = session.sessionId;
        setSelectedSessionId(null);
      }

      setInput("");
      await sendMessage.mutateAsync({ sessionId: sid, message: trimmed });
    } catch {
      setError("Mesaj gonderilemedi. Lutfen tekrar deneyin.");
    }
  };

  const handleNewChat = async () => {
    if (activeSession) await endSessionMut.mutateAsync(activeSession.sessionId);
    setSelectedSessionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
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
        <Flex
          align="center"
          justify="space-between"
          style={{ padding: `12px ${padding}px`, borderBottom: `1px solid ${token.colorBorderSecondary}` }}
        >
          <Flex align="center" gap={10}>
            <Sparkles size={20} />
            <Typography.Title level={4} style={{ margin: 0 }}>EduAI Asistan</Typography.Title>
            {isViewingOldSession && <Tag color="default">Gecmis sohbet</Tag>}
          </Flex>
          {activeSession && (
            <Button type="text" icon={<Trash2 size={16} />} onClick={handleNewChat} loading={endSessionMut.isPending}>
              Yeni Sohbet
            </Button>
          )}
        </Flex>

        <div style={{ flex: 1, overflowY: "auto", padding }}>
          {messages.length === 0 && !isLoading ? (
            <WelcomeView onQuickPrompt={(p) => { setInput(p); inputRef.current?.focus(); }} />
          ) : (
            <Flex vertical gap={16} style={{ maxWidth: 760, margin: "0 auto" }}>
              {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
              {isLoading && (
                <Flex gap={8} align="center" style={{ paddingLeft: 4 }}>
                  <Spin size="small" />
                  <Typography.Text type="secondary">EduAI dusunuyor...</Typography.Text>
                </Flex>
              )}
              <div ref={messagesEndRef} />
            </Flex>
          )}
        </div>

        <div style={{ padding: `12px ${padding}px 16px`, borderTop: `1px solid ${token.colorBorderSecondary}` }}>
          {error && (
            <Alert message={error} type="error" closable onClose={() => setError(null)}
              style={{ maxWidth: 760, margin: "0 auto 8px" }} />
          )}
          <Flex gap={8} style={{ maxWidth: 760, margin: "0 auto" }}>
            <Input
              ref={inputRef as never}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sorunuzu yazin..."
              size="large"
              disabled={isLoading}
              style={{ borderRadius: 12 }}
            />
            <Button
              type="primary"
              size="large"
              icon={<Send size={18} />}
              onClick={handleSend}
              loading={isLoading}
              disabled={!input.trim()}
              style={{ borderRadius: 12, minWidth: 48 }}
            />
          </Flex>
        </div>
      </Flex>
    </Flex>
  );
}

function MessageBubble({ message }: { message: ChatMessageItem }) {
  const { token } = theme.useToken();
  const isUser = message.senderType === "user";

  return (
    <Flex justify={isUser ? "flex-end" : "flex-start"}>
      <div
        style={{
          maxWidth: "80%",
          padding: "10px 14px",
          borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          background: isUser ? token.colorPrimary : token.colorBgContainer,
          color: isUser ? "#fff" : token.colorText,
          border: isUser ? "none" : `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        {isUser ? (
          <Typography.Text style={{ color: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {message.content}
          </Typography.Text>
        ) : (
          <div className="markdown-body" style={{ wordBreak: "break-word" }}>
            <Markdown>{message.content}</Markdown>
          </div>
        )}
        {!isUser && message.intentDetected && (
          <div style={{ marginTop: 6 }}>
            <Tag color="blue" style={{ fontSize: 11 }}>{message.intentDetected}</Tag>
          </div>
        )}
      </div>
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
      <Typography.Text type="secondary" style={{ fontSize: 16, textAlign: "center", maxWidth: 480 }}>
        Kampus yasami, dersler, sinavlar, burslar ve daha fazlasi hakkinda sorularinizi yanitliyorum.
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
