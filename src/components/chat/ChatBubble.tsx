import { useEffect, useRef, useState } from "react";
import { FloatButton, Grid } from "antd";
import type { InputRef } from "antd";
import { GraduationCap, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import EduAiPanel from "@/components/chat/EduAiPanel";
import MessagesLauncherPanel from "@/components/chat/MessagesLauncherPanel";
import { useChatStore } from "@/store/chatStore";

export default function ChatBubble() {
  const screens = Grid.useBreakpoint();
  const navigate = useNavigate();
  const isOpen = useChatStore((state) => state.isOpen);
  const openChat = useChatStore((state) => state.openChat);
  const closeChat = useChatStore((state) => state.closeChat);
  const [prompt, setPrompt] = useState("");
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const aiTriggerRef = useRef<HTMLDivElement>(null);
  const messagesPanelRef = useRef<HTMLDivElement>(null);
  const messagesTriggerRef = useRef<HTMLDivElement>(null);

  const rightOffset = screens.xs ? 12 : 24;
  const messagesButtonBottom = screens.lg ? 28 : 92;
  const aiButtonBottom = messagesButtonBottom + 78;
  const aiPanelWidth = screens.xs ? "calc(100vw - 24px)" : 500;
  const messagesPanelWidth = screens.xs ? "calc(100vw - 24px)" : 520;

  useEffect(() => {
    if (!isOpen && !isMessagesOpen) {
      return;
    }

    const timer = isOpen ? window.setTimeout(() => inputRef.current?.focus(), 90) : undefined;
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        aiPanelRef.current?.contains(target) ||
        aiTriggerRef.current?.contains(target) ||
        messagesPanelRef.current?.contains(target) ||
        messagesTriggerRef.current?.contains(target)
      ) {
        return;
      }

      closeChat();
      setIsMessagesOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeChat();
        setIsMessagesOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMessagesOpen, isOpen, closeChat]);

  const openFullPage = () => {
    const trimmedPrompt = prompt.trim();
    closeChat();
    setIsMessagesOpen(false);
    navigate(trimmedPrompt ? `/edu-ai?prompt=${encodeURIComponent(trimmedPrompt)}` : "/edu-ai");
  };

  const openMessagesPage = () => {
    setIsMessagesOpen(false);
    closeChat();
    navigate("/messages");
  };

  const handleQuickAction = (value: string) => {
    setPrompt(value);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };

  const handleAiButtonClick = () => {
    if (isOpen) {
      closeChat();
      return;
    }

    setIsMessagesOpen(false);
    openChat();
  };

  const handleMessagesButtonClick = () => {
    if (isMessagesOpen) {
      setIsMessagesOpen(false);
      return;
    }

    closeChat();
    setIsMessagesOpen(true);
  };

  return (
    <>
      <div ref={aiTriggerRef}>
        <FloatButton
          shape="square"
          tooltip={isOpen ? "EduAI'yi kapat" : "EduAI'yi ac"}
          icon={<GraduationCap size={24} strokeWidth={2.1} />}
          onClick={handleAiButtonClick}
          style={{
            right: rightOffset,
            bottom: aiButtonBottom,
          }}
          styles={{
            root: {
              width: 62,
              height: 62,
              borderRadius: 22,
              background: "#FFFFFF",
              border: "1px solid #D9E2EC",
              boxShadow: isOpen
                ? "0 12px 30px rgba(15, 23, 42, 0.14)"
                : "0 14px 34px rgba(15, 23, 42, 0.18)",
            },
            icon: {
              color: "#111827",
            },
          }}
        />
      </div>

      <div
        ref={aiPanelRef}
        style={{
          position: "fixed",
          right: rightOffset,
          bottom: messagesButtonBottom + 84,
          width: aiPanelWidth,
          maxWidth: "calc(100vw - 24px)",
          zIndex: 1045,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(18px)",
          transformOrigin: "bottom right",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <EduAiPanel
          ref={inputRef}
          prompt={prompt}
          onPromptChange={setPrompt}
          onSubmit={openFullPage}
          onQuickAction={handleQuickAction}
          onClose={closeChat}
          onExpand={openFullPage}
        />
      </div>

      <div ref={messagesTriggerRef}>
        <FloatButton
          shape="square"
          tooltip={isMessagesOpen ? "Mesajlari kapat" : "Mesajlari ac"}
          icon={<MessageCircle size={24} strokeWidth={2.1} />}
          onClick={handleMessagesButtonClick}
          style={{
            right: rightOffset,
            bottom: messagesButtonBottom,
          }}
          styles={{
            root: {
              width: 62,
              height: 62,
              borderRadius: 22,
              background: "#FFFFFF",
              border: "1px solid #D9E2EC",
              boxShadow: isMessagesOpen
                ? "0 12px 30px rgba(15, 23, 42, 0.14)"
                : "0 14px 34px rgba(15, 23, 42, 0.18)",
            },
            icon: {
              color: "#111827",
            },
          }}
        />
      </div>

      <div
        ref={messagesPanelRef}
        style={{
          position: "fixed",
          right: rightOffset,
          bottom: messagesButtonBottom + 84,
          width: messagesPanelWidth,
          maxWidth: "calc(100vw - 24px)",
          zIndex: 1045,
          opacity: isMessagesOpen ? 1 : 0,
          transform: isMessagesOpen ? "translateY(0)" : "translateY(18px)",
          transformOrigin: "bottom right",
          pointerEvents: isMessagesOpen ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <MessagesLauncherPanel
          onClose={() => setIsMessagesOpen(false)}
          onExpand={openMessagesPage}
        />
      </div>
    </>
  );
}
