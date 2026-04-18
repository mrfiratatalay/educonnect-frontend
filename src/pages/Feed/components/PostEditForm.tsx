import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Button, Flex, Image, Input, Typography, Upload, theme } from "antd";
import type { UploadProps } from "antd";
import { DeleteOutlined, FileImageOutlined } from "@ant-design/icons";
import type { UpdatePostInput } from "@/features/posts/types";

interface PostEditFormProps {
  postId: string;
  initialContent: string;
  initialImageUrl?: string;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (input: Omit<UpdatePostInput, "postId">) => Promise<void>;
}

export default function PostEditForm({
  postId: _postId,
  initialContent,
  initialImageUrl,
  isSubmitting,
  onCancel,
  onSubmit,
}: PostEditFormProps) {
  const { token } = theme.useToken();
  const [content, setContent] = useState(initialContent);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(initialImageUrl);
  const [removeImage, setRemoveImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const uploadProps = useMemo<UploadProps>(
    () => ({
      accept: "image/png,image/jpeg,image/gif",
      maxCount: 1,
      showUploadList: false,
      beforeUpload: (file) => {
        if (!["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
          setErrorMessage("Sadece JPG, PNG veya GIF görseller yükleyebilirsiniz.");
          return Upload.LIST_IGNORE;
        }
        if (file.size / 1024 / 1024 >= 5) {
          setErrorMessage("Görsel en fazla 5MB olabilir.");
          return Upload.LIST_IGNORE;
        }
        setImageFile(file);
        setRemoveImage(false);
        setErrorMessage(null);
        return false;
      },
    }),
    [],
  );

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreviewUrl(undefined);
    setRemoveImage(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent && !imagePreviewUrl && !imageFile) {
      setErrorMessage("Bir metin yaz veya görsel ekle.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit({
        content: trimmedContent,
        imageFile,
        removeImage,
        currentImageUrl: initialImageUrl,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Paylaşım güncellenemedi.",
      );
    }
  }

  const canSubmit = content.trim().length > 0 || !!imagePreviewUrl || !!imageFile;

  return (
    <form onSubmit={handleSubmit}>
      <Flex vertical gap={8}>
        <Input.TextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={1500}
          showCount
          autoSize={{ minRows: 3, maxRows: 8 }}
          placeholder="Ne paylaşmak istiyorsun?"
        />

        {imagePreviewUrl && (
          <div
            style={{
              position: "relative",
              borderRadius: 12,
              overflow: "hidden",
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Image
              src={imagePreviewUrl}
              alt="Görsel"
              style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }}
              preview={false}
            />
            <Button
              type="default"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleRemoveImage}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                borderRadius: 6,
              }}
            >
              Görseli kaldır
            </Button>
          </div>
        )}

        <Flex align="center" justify="space-between" gap={12}>
          <Flex align="center" gap={8}>
            <Upload {...uploadProps}>
              <Button
                type="text"
                shape="circle"
                icon={<FileImageOutlined />}
                disabled={isSubmitting}
                style={{ color: "#0D9488", fontSize: 18, width: 36, height: 36 }}
                title="Görsel ekle / değiştir"
              />
            </Upload>

            {errorMessage && (
              <Typography.Text type="danger" style={{ fontSize: 12 }}>
                {errorMessage}
              </Typography.Text>
            )}
          </Flex>

          <Flex gap={8}>
            <Button onClick={onCancel} disabled={isSubmitting}>
              İptal
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!canSubmit}
            >
              Kaydet
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </form>
  );
}
