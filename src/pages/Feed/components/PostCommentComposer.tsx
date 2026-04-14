import { type FormEvent, useState, useRef, useEffect } from "react";
import { Button, Flex, Avatar, message, theme } from "antd";
import { useAuthStore } from "@/store/authStore";
import { getUserInitials } from "@/components/layout/shellNavigation";

interface PostCommentComposerProps {
  id?: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostCommentComposer({
  id,
  isSubmitting,
  onSubmit,
}: PostCommentComposerProps) {
  const [content, setContent] = useState("");
  const { token } = theme.useToken();
  const user = useAuthStore((state) => state.user);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) return;

    try {
      await onSubmit(trimmedContent);
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    } catch {
      message.error("Yorum gonderilemedi. Lutfen tekrar deneyin.");
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        const form = e.currentTarget.closest('form');
        if (form) form.requestSubmit();
      }
    }
  };

  return (
    <form id={id} onSubmit={handleSubmit} style={{ width: "100%" }}>
      <Flex gap={12} align="flex-start" style={{ padding: "12px 16px" }}>
        <Avatar
          src={user?.avatarUrl}
          size={40}
          style={{
            backgroundColor: token.colorPrimaryBg,
            color: token.colorPrimary,
            flexShrink: 0,
          }}
        >
          {getUserInitials(user?.fullName)}
        </Avatar>

        <Flex vertical style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Yanıtını gönder"
            disabled={isSubmitting}
            style={{
              width: "100%",
              minHeight: 24,
              fontSize: 20,
              background: "transparent",
              border: "none",
              outline: "none",
              resize: "none",
              color: token.colorText,
              fontFamily: "inherit",
              overflow: "hidden",
            }}
          />

          <Flex justify="flex-end" style={{ marginTop: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!content.trim()}
              shape="round"
              style={{
                height: 36,
                padding: "0 16px",
                fontWeight: 700,
                fontSize: 15,
                backgroundColor: "#1D9BF0",
                opacity: !content.trim() ? 0.5 : 1,
                border: "none",
                color: "#FFFFFF",
              }}
            >
              Yanıtla
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
}
