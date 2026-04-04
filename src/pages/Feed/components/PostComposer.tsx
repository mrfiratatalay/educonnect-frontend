import { type FormEvent, useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Input, Typography, theme, Tooltip } from "antd";
import { Image as ImageIcon, Smile, MapPin, BarChart2 } from "lucide-react";

interface PostComposerProps {
  avatarUrl?: string;
  fullName?: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
}

export default function PostComposer({
  avatarUrl,
  fullName,
  isSubmitting,
  onSubmit,
}: PostComposerProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { token } = theme.useToken();

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
      setContent("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Paylaşım gönderilemedi.",
      );
    }
  }

  return (
    <div id="feed-composer" style={{ padding: "20px 24px", borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
      <form onSubmit={handleSubmit}>
        <Flex gap={16} align="flex-start">
          <Avatar
            src={avatarUrl}
            size={48}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              flexShrink: 0,
            }}
          >
            {fullName?.charAt(0) ?? "K"}
          </Avatar>

          <Flex vertical gap={12} style={{ flex: 1 }}>
            <div style={{ padding: "0 4px" }}>
              <Input.TextArea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Kampüste neler oluyor?"
                bordered={false}
                style={{ 
                  fontSize: 18, 
                  padding: 0, 
                  boxShadow: 'none', 
                  resize: 'none',
                  minHeight: 48
                }}
                maxLength={1500}
                autoSize={{ minRows: 2, maxRows: 8 }}
              />
            </div>

            <div style={{ height: 1, background: token.colorBorderSecondary, margin: "4px 0", opacity: 0.5 }} />

            <Flex align="center" justify="space-between" gap={12} wrap="wrap">
                <Flex align="center" gap={4}>
                  <Tooltip title="Medya Ekle">
                    <Button type="text" shape="circle" icon={<ImageIcon size={18} color={token.colorPrimary} />} />
                  </Tooltip>
                  <Tooltip title="Anket Seçenekleri">
                    <Button type="text" shape="circle" icon={<BarChart2 size={18} color={token.colorPrimary} />} />
                  </Tooltip>
                  <Tooltip title="Emoji">
                    <Button type="text" shape="circle" icon={<Smile size={18} color={token.colorPrimary} />} />
                  </Tooltip>
                  <Tooltip title="Konum">
                    <Button type="text" shape="circle" icon={<MapPin size={18} color={token.colorPrimary} />} />
                  </Tooltip>
                </Flex>

                <Flex align="center" gap={12}>
                  {errorMessage && (
                    <Typography.Text type="danger" style={{ fontSize: 13 }}>
                      {errorMessage}
                    </Typography.Text>
                  )}
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SendOutlined />}
                    loading={isSubmitting}
                    disabled={!content.trim()}
                    shape="round"
                    style={{ padding: "0 24px", fontWeight: 600, boxShadow: `0 4px 12px ${token.colorPrimary}40` }}
                  >
                    Paylaş
                  </Button>
                </Flex>
              </Flex>
          </Flex>
        </Flex>
      </form>
    </div>
  );
}
