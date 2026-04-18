import { type KeyboardEvent, useState } from "react";
import { Button, Flex, Input, theme } from "antd";
import { SendHorizontal } from "lucide-react";

interface MessageComposerProps {
  disabled?: boolean;
  isSending: boolean;
  onSend: (text: string) => Promise<void>;
  value?: string;
  onValueChange?: (text: string) => void;
}

export default function MessageComposer({
  disabled,
  isSending,
  onSend,
  value,
  onValueChange,
}: MessageComposerProps) {
  const { token } = theme.useToken();
  const [text, setText] = useState("");
  const currentText = value ?? text;

  function updateText(nextText: string) {
    if (value === undefined) {
      setText(nextText);
    }

    onValueChange?.(nextText);
  }

  async function handleSend() {
    const trimmed = currentText.trim();
    if (!trimmed || disabled || isSending) return;
    updateText("");
    await onSend(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  return (
    <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}`, padding: 12 }}>
      <Flex gap={8} align="flex-end">
        <Input.TextArea
          value={currentText}
          onChange={(e) => updateText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mesaj yaz... (Enter: gönder, Shift+Enter: yeni satır)"
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={disabled || isSending}
          style={{ flex: 1, borderRadius: 20, resize: "none" }}
        />
        <Button
          type="primary"
          shape="circle"
          loading={isSending}
          disabled={!currentText.trim() || disabled}
          onClick={() => void handleSend()}
          icon={<SendHorizontal size={16} />}
          style={{ flexShrink: 0 }}
        />
      </Flex>
    </div>
  );
}
