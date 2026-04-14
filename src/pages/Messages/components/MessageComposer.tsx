import { type FormEvent, useState } from "react";
import { Button, Flex, Input, theme } from "antd";

interface MessageComposerProps {
  disabled?: boolean;
  isSending: boolean;
  onSend: (text: string) => Promise<void>;
}

export default function MessageComposer({
  disabled,
  isSending,
  onSend,
}: MessageComposerProps) {
  const { token } = theme.useToken();
  const [text, setText] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || disabled || isSending) {
      return;
    }
    await onSend(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }}>
      <Flex gap={8} align="flex-end" style={{ padding: 12 }}>
        <Input.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesaj yaz..."
          autoSize={{ minRows: 1, maxRows: 6 }}
          disabled={disabled || isSending}
          style={{ flex: 1 }}
        />
        <Button type="primary" htmlType="submit" loading={isSending} disabled={!text.trim() || disabled}>
          Gonder
        </Button>
      </Flex>
    </form>
  );
}
