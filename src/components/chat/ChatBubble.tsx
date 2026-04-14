import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatButton, Grid } from "antd";
import { GraduationCap, MessageCircle } from "lucide-react";
import EduAiPanel from "@/components/chat/EduAiPanel";
import MessagesLauncherPanel from "@/components/chat/MessagesLauncherPanel";
import { useChatStore } from "@/store/chatStore";

export default function ChatBubble() {
  const screens = Grid.useBreakpoint();
  const navigate = useNavigate();
  const isOpen = useChatStore((state) => state.isOpen);
  const openChat = useChatStore((state) => state.openChat);
  const closeChat = useChatStore((state) => state.closeChat);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const aiPanelRef = useRef<HTMLDivElement>(null);
  const aiTriggerRef = useRef<HTMLDivElement>(null);
  const messagesPanelRef = useRef<HTMLDivElement>(null);
  const messagesTriggerRef = useRef<HTMLDivElement>(null);

  const rightOffset = screens.xs ? 12 : 24;
  const messagesButtonBottom = screens.lg ? 28 : 92;
  const aiButtonBottom = messagesButtonBottom + 78;
  const aiPanelWidth = screens.xs ? "calc(100vw - 24px)" : 420;
  const messagesPanelWidth = screens.xs ? "calc(100vw - 24px)" : 520;

  useEffect(() => {
    if (!isOpen && !isMessagesOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        aiPanelRef.current?.contains(target) ||
        aiTriggerRef.current?.contains(target) ||
        messagesPanelRef.current?.contains(target) ||
        messagesTriggerRef.current?.contains(target)
      )
        return;
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
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMessagesOpen, isOpen, closeChat]);

  const handleAiClick = () => {
    if (isOpen) { closeChat(); return; }
    setIsMessagesOpen(false);
    openChat();
  };

  const handleMessagesClick = () => {
    if (isMessagesOpen) { setIsMessagesOpen(false); return; }
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
          onClick={handleAiClick}
          style={{ right: rightOffset, bottom: aiButtonBottom }}
          styles={{
            root: {
              width: 62, height: 62, borderRadius: 22,
              background: "#FFFFFF", border: "1px solid #D9E2EC",
              boxShadow: "0 14px 34px rgba(15,23,42,0.18)",
            },
            icon: { color: "#111827" },
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
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <EduAiPanel onClose={closeChat} />
      </div>

      <div ref={messagesTriggerRef}>
        <FloatButton
          shape="square"
          tooltip={isMessagesOpen ? "Mesajlari kapat" : "Mesajlari ac"}
          icon={<MessageCircle size={24} strokeWidth={2.1} />}
          onClick={handleMessagesClick}
          style={{ right: rightOffset, bottom: messagesButtonBottom }}
          styles={{
            root: {
              width: 62, height: 62, borderRadius: 22,
              background: "#FFFFFF", border: "1px solid #D9E2EC",
              boxShadow: "0 14px 34px rgba(15,23,42,0.18)",
            },
            icon: { color: "#111827" },
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
          pointerEvents: isMessagesOpen ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s ease",
        }}
      >
        <MessagesLauncherPanel
          onClose={() => setIsMessagesOpen(false)}
          onExpand={() => { setIsMessagesOpen(false); closeChat(); navigate("/messages"); }}
        />
      </div>
    </>
  );
}
