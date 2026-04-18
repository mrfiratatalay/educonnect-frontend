import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Avatar, Button, Flex, Image, Input, Typography, Upload, theme } from "antd";
import type { UploadProps } from "antd";
import { DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import type { CreatePostInput } from "@/features/posts/types";
import { usePostComposerStore } from "@/store/postComposerStore";

interface PostComposerProps {
  avatarUrl?: string;
  fullName?: string;
  isSubmitting: boolean;
  onSubmit: (input: CreatePostInput) => Promise<void>;
  isInModal?: boolean;
}

export default function PostComposer({
  avatarUrl,
  fullName,
  isSubmitting,
  onSubmit,
  isInModal = false,
}: PostComposerProps) {
  const content = usePostComposerStore((state) => state.content);
  const imageFile = usePostComposerStore((state) => state.imageFile);
  const setContent = usePostComposerStore((state) => state.setContent);
  const setImageFile = usePostComposerStore((state) => state.setImageFile);
  const clearDraft = usePostComposerStore((state) => state.clearDraft);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>();
  const { token } = theme.useToken();
  const remainingCharacterCount = 1500 - content.length;

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  useEffect(() => {
    if (content.trim() || imageFile) {
      setErrorMessage(null);
    }
  }, [content, imageFile]);

  const uploadProps = useMemo<UploadProps>(
    () => ({
      accept: "image/png,image/jpeg,image/gif",
      maxCount: 1,
      showUploadList: false,
      beforeUpload: (file) => {
        const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

        if (!allowedTypes.includes(file.type)) {
          setErrorMessage("Sadece JPG, PNG veya GIF gorseller yukleyebilirsiniz.");
          return Upload.LIST_IGNORE;
        }

        if (file.size / 1024 / 1024 >= 5) {
          setErrorMessage("Gorsel en fazla 5MB olabilir.");
          return Upload.LIST_IGNORE;
        }

        setImageFile(file);
        setErrorMessage(null);
        return false;
      },
      onRemove: () => {
        setImageFile(null);
      },
    }),
    [setImageFile],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent && !imageFile) {
      setErrorMessage("Bir metin yaz veya gorsel ekle.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({
        content: trimmedContent,
        imageFile,
        imagePreviewUrl,
      });
      clearDraft();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Paylasim gonderilemedi.");
    }
  }

  return (
    <div
      id={isInModal ? undefined : "feed-composer"}
      style={{
        padding: isInModal ? "8px 16px 16px" : "16px 16px 8px",
        borderBottom: isInModal ? "none" : `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <form id={isInModal ? "compose-modal-form" : undefined} onSubmit={handleSubmit}>
        <Flex align="flex-start" gap={12}>
          <Avatar
            src={avatarUrl}
            size={40}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              flexShrink: 0,
            }}
          >
            {fullName?.charAt(0) ?? "K"}
          </Avatar>

          <Flex vertical gap={4} style={{ flex: 1 }}>
            <Input.TextArea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Kampusunde neler oluyor?"
              bordered={false}
              style={{
                fontSize: 20,
                padding: "12px 0",
                boxShadow: "none",
                resize: "none",
                minHeight: 56,
              }}
              maxLength={1500}
              showCount={false}
              autoSize={{ minRows: isInModal ? 4 : 1, maxRows: 8 }}
            />

            {imagePreviewUrl ? (
              <div
                style={{
                  marginTop: 8,
                  borderRadius: 18,
                  overflow: "hidden",
                  border: `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Image
                  src={imagePreviewUrl}
                  alt="Secilen gorsel"
                  preview
                  style={{
                    width: "100%",
                    maxHeight: 320,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ) : null}

            <Flex align="center" justify="space-between" style={{ marginTop: 8, marginBottom: 12 }}>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                En fazla 1500 karakter. Istersen tek bir gorsel ekleyebilirsin.
              </Typography.Text>
              <Typography.Text
                type={remainingCharacterCount < 100 ? "warning" : "secondary"}
                style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}
              >
                {remainingCharacterCount}
              </Typography.Text>
            </Flex>

            <div style={{ height: 1, background: token.colorBorderSecondary, marginBottom: 12 }} />

            <Flex align="center" justify="space-between">
              <Flex align="center" gap={8}>
                <Upload {...uploadProps}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<FileImageOutlined />}
                    disabled={isSubmitting}
                    style={{ color: "#1D9BF0", fontSize: 18, width: 36, height: 36 }}
                  />
                </Upload>

                {imageFile ? (
                  <Button
                    type="text"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    disabled={isSubmitting}
                    onClick={() => setImageFile(null)}
                    style={{ color: token.colorError, width: 36, height: 36 }}
                  />
                ) : null}
              </Flex>

              <Flex align="center" gap={12}>
                {errorMessage ? (
                  <Typography.Text type="danger" style={{ fontSize: 13 }}>
                    {errorMessage}
                  </Typography.Text>
                ) : null}

                {!isInModal ? (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={!content.trim() && !imageFile}
                    shape="round"
                    style={{
                      padding: "0 20px",
                      fontWeight: 700,
                      height: 36,
                      backgroundColor: "#1D9BF0",
                      color: "#FFFFFF",
                      opacity: !content.trim() ? 0.5 : 1,
                      borderColor: "transparent",
                    }}
                  >
                    Gonderi yayinla
                  </Button>
                ) : null}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </div>
  );
}
