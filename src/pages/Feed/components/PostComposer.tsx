import { type FormEvent, useState } from "react";
import { Avatar, Button, Flex, Input, Typography, theme, Tooltip } from "antd";
import {
  FileImageOutlined,
  FileGifOutlined,
  UnorderedListOutlined,
  SmileOutlined,
  ScheduleOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

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

  const mediaIcons = [
    { icon: <FileImageOutlined />, tip: "Medya" },
    { icon: <FileGifOutlined />, tip: "GIF" },
    { icon: <UnorderedListOutlined />, tip: "Anket" },
    { icon: <SmileOutlined />, tip: "Emoji" },
    { icon: <ScheduleOutlined />, tip: "Planla" },
    { icon: <EnvironmentOutlined />, tip: "Konum" },
  ];

  return (
    <div id="feed-composer" style={{ padding: "12px 16px", borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
      <form onSubmit={handleSubmit}>
        <Flex gap={12} align="flex-start">
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

          <Flex vertical style={{ flex: 1 }}>
            <Input.TextArea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Neler oluyor?"
              bordered={false}
              style={{
                fontSize: 20,
                padding: "8px 0",
                boxShadow: "none",
                resize: "none",
                minHeight: 52,
              }}
              maxLength={1500}
              autoSize={{ minRows: 1, maxRows: 8 }}
            />

            <div style={{ height: 1, background: token.colorBorderSecondary, marginBottom: 12 }} />

            <Flex align="center" justify="space-between">
              <Flex align="center" gap={0}>
                {mediaIcons.map((item, i) => (
                  <Tooltip title={item.tip} key={i}>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      icon={item.icon}
                      style={{ color: "#1D9BF0", fontSize: 16 }}
                    />
                  </Tooltip>
                ))}
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
                  loading={isSubmitting}
                  disabled={!content.trim()}
                  shape="round"
                  style={{ padding: "0 20px", fontWeight: 700, height: 36 }}
                >
                  Gönderi yayınla
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </div>
  );
}
