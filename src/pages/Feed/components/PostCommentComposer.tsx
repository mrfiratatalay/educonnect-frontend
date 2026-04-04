import { type FormEvent, useState } from "react";
import { Send } from "lucide-react";
import { Button, Flex, Input, Typography } from "antd";

interface PostCommentComposerProps {
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostCommentComposer({
  isSubmitting,
  onSubmit,
}: PostCommentComposerProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage("Yorum boş olamaz.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(trimmedContent);
      setContent("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Yorum gönderilemedi.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex vertical gap={8}>
        <Input.TextArea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Yorum yaz..."
          rows={2}
          maxLength={500}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />

        <Flex align="center" justify="space-between" gap={12}>
          <div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {content.length}/500
            </Typography.Text>
            {errorMessage && (
              <Typography.Text type="danger" style={{ fontSize: 12, display: "block" }}>
                {errorMessage}
              </Typography.Text>
            )}
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="small"
            icon={<Send size={12} />}
            loading={isSubmitting}
            disabled={!content.trim()}
          >
            Yorum Yap
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
