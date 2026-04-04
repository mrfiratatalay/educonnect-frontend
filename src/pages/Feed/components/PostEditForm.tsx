import { type FormEvent, useState } from "react";
import { Button, Flex, Input, Typography } from "antd";

interface PostEditFormProps {
  initialContent: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostEditForm({
  initialContent,
  isSubmitting,
  onCancel,
  onSubmit,
}: PostEditFormProps) {
  const [content, setContent] = useState(initialContent);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage("Paylaşım metni boş olamaz.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(trimmedContent);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Paylaşım güncellenemedi.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex vertical gap={8}>
        <Input.TextArea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows={4}
          maxLength={1500}
          showCount
          autoSize={{ minRows: 3, maxRows: 8 }}
        />

        <Flex align="center" justify="space-between" gap={12}>
          <div>
            {errorMessage && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {errorMessage}
              </Typography.Text>
            )}
          </div>

          <Flex gap={8}>
            <Button onClick={onCancel}>İptal</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!content.trim()}
            >
              Kaydet
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
}
