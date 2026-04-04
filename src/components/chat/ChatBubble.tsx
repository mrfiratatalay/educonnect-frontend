import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, Sparkles, ThumbsUp, ThumbsDown } from "lucide-react";
import { Avatar, Button, Flex, Input, Tag, Typography, theme } from "antd";
import type { InputRef } from "antd";
import { useChatStore } from "@/store/chatStore";
import { chatBotResponses, mockChatMessages } from "@/data/mock";
import type { ChatMessage } from "@/types";

const quickQuestions = [
  "Sınav takvimi ne zaman?",
  "Kütüphane saatleri nedir?",
  "Yemekhane menüsü?",
  "Burs başvurusu nasıl yapılır?",
];

export default function ChatBubble() {
  const { isOpen, messages, isTyping, toggleChat, addMessage, setTyping } =
    useChatStore();
  const [input, setInput] = useState("");
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const seeded = useRef(false);
  const { token } = theme.useToken();

  useEffect(() => {
    if (!seeded.current && messages.length === 0) {
      seeded.current = true;
      mockChatMessages.forEach((m) => addMessage(m));
    }
  }, [messages.length, addMessage]);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getBotResponse = useCallback(
    (message: string, recentMessages: ChatMessage[]): string => {
      const lowerMsg = message.toLowerCase();
      const entries = Object.entries(chatBotResponses).filter(
        ([k]) => k !== "default",
      );
      entries.sort((a, b) => b[0].length - a[0].length);

      for (const [key, response] of entries) {
        if (lowerMsg.includes(key)) return response;
      }

      const words = lowerMsg.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        for (const [key, response] of entries) {
          if (key.includes(word) || word.includes(key)) return response;
        }
      }

      const contextWindow = recentMessages.slice(-10);
      const contextText = contextWindow
        .map((m) => m.content.toLowerCase())
        .join(" ");

      for (const [key, response] of entries) {
        if (contextText.includes(key)) {
          const contextHint = key.charAt(0).toUpperCase() + key.slice(1);
          return `Önceki konuşmamıza referansla — ${contextHint} hakkında: ${response}`;
        }
      }

      return chatBotResponses.default;
    },
    [],
  );

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: ChatMessage = {
        id: `cm-${Date.now()}`,
        sessionId: "s1",
        senderType: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };
      addMessage(userMsg);
      setInput("");
      setTyping(true);

      setTimeout(
        () => {
          const currentMessages = useChatStore.getState().messages;
          const botMsg: ChatMessage = {
            id: `cm-${Date.now()}-bot`,
            sessionId: "s1",
            senderType: "bot",
            content: getBotResponse(text, currentMessages),
            timestamp: new Date().toISOString(),
          };
          addMessage(botMsg);
          setTyping(false);
        },
        1200 + Math.random() * 800,
      );
    },
    [addMessage, setTyping, isTyping, getBotResponse],
  );

  const giveFeedback = (msgId: string) => {
    setFeedbackGiven((prev) => new Set(prev).add(msgId));
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? "Sohbeti kapat" : "AI Asistanı aç"}
        style={{
          position: "fixed",
          bottom: 80,
          right: 24,
          zIndex: 1050,
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isOpen ? token.colorFillSecondary : token.colorPrimary,
          color: isOpen ? token.colorTextSecondary : "#fff",
          boxShadow: isOpen
            ? token.boxShadowSecondary
            : `0 8px 24px ${token.colorPrimary}44`,
          transition: "all 0.3s ease",
          transform: isOpen ? "scale(0.9)" : "scale(1)",
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat panel */}
      <div
        style={{
          position: "fixed",
          bottom: 148,
          right: 24,
          zIndex: 1050,
          width: 384,
          maxWidth: "calc(100vw - 2rem)",
          transition: "all 0.3s ease",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(16px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: 500,
            borderRadius: token.borderRadiusLG * 2,
            border: `1px solid ${token.colorBorder}`,
            background: token.colorBgContainer,
            boxShadow: token.boxShadow,
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Flex
            align="center"
            gap={12}
            style={{
              padding: "14px 16px",
              background: token.colorPrimary,
              color: "#fff",
            }}
          >
            <Avatar
              size={36}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#fff",
              }}
            >
              <Bot size={18} />
            </Avatar>
            <div style={{ flex: 1 }}>
              <Typography.Text strong style={{ color: "#fff", display: "block", fontSize: 14 }}>
                EduConnect Asistan
              </Typography.Text>
              <Typography.Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                Her zaman burada
              </Typography.Text>
            </div>
            <Sparkles size={18} style={{ opacity: 0.6 }} />
          </Flex>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id}>
                <Flex
                  gap={8}
                  style={{
                    maxWidth: "85%",
                    ...(msg.senderType === "user"
                      ? { marginLeft: "auto", flexDirection: "row-reverse" }
                      : {}),
                  }}
                >
                  {msg.senderType === "bot" && (
                    <Avatar
                      size={28}
                      style={{
                        backgroundColor: token.colorPrimaryBg,
                        color: token.colorPrimary,
                        flexShrink: 0,
                        marginTop: 4,
                        fontSize: 12,
                      }}
                    >
                      <Bot size={14} />
                    </Avatar>
                  )}
                  <div
                    style={{
                      borderRadius: 16,
                      padding: "10px 14px",
                      fontSize: 13,
                      lineHeight: 1.6,
                      ...(msg.senderType === "user"
                        ? {
                            background: token.colorPrimary,
                            color: "#fff",
                            borderBottomRightRadius: 4,
                          }
                        : {
                            background: token.colorFillQuaternary,
                            color: token.colorText,
                            borderBottomLeftRadius: 4,
                          }),
                    }}
                  >
                    {msg.content}
                  </div>
                </Flex>

                {msg.senderType === "bot" && msg.id !== "cm1" && (
                  <Flex gap={4} style={{ marginLeft: 36, marginTop: 4 }}>
                    {feedbackGiven.has(msg.id) ? (
                      <Typography.Text type="secondary" style={{ fontSize: 10 }}>
                        Geri bildiriminiz alındı
                      </Typography.Text>
                    ) : (
                      <>
                        <Button
                          type="text"
                          size="small"
                          icon={<ThumbsUp size={12} />}
                          onClick={() => giveFeedback(msg.id)}
                          style={{ padding: "0 4px", height: 20 }}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<ThumbsDown size={12} />}
                          onClick={() => giveFeedback(msg.id)}
                          style={{ padding: "0 4px", height: 20 }}
                        />
                      </>
                    )}
                  </Flex>
                )}
              </div>
            ))}

            {isTyping && (
              <Flex gap={8} style={{ maxWidth: "85%" }}>
                <Avatar
                  size={28}
                  style={{
                    backgroundColor: token.colorPrimaryBg,
                    color: token.colorPrimary,
                    flexShrink: 0,
                    marginTop: 4,
                    fontSize: 12,
                  }}
                >
                  <Bot size={14} />
                </Avatar>
                <div
                  style={{
                    borderRadius: 16,
                    borderBottomLeftRadius: 4,
                    padding: "12px 16px",
                    background: token.colorFillQuaternary,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: token.colorTextTertiary,
                        animation: `chatBounce 1.4s ease-in-out ${i * 0.15}s infinite`,
                      }}
                    />
                  ))}
                </div>
              </Flex>
            )}
          </div>

          {/* Quick questions */}
          {messages.length <= 1 && (
            <div style={{ padding: "0 16px 8px" }}>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 8 }}>
                Hızlı sorular:
              </Typography.Text>
              <Flex gap={6} wrap="wrap">
                {quickQuestions.map((q) => (
                  <Tag
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{ cursor: "pointer", borderRadius: 20, fontSize: 11 }}
                  >
                    {q}
                  </Tag>
                ))}
              </Flex>
            </div>
          )}

          {/* Input */}
          <Flex
            gap={8}
            align="center"
            style={{
              padding: 12,
              borderTop: `1px solid ${token.colorBorder}`,
            }}
          >
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Bir soru sorun..."
              variant="filled"
              style={{ flex: 1 }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<Send size={16} />}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
            />
          </Flex>
        </div>
      </div>

      {/* Bounce animation keyframes */}
      <style>{`
        @keyframes chatBounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
      `}</style>
    </>
  );
}
