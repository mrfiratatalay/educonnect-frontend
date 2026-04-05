import { type FormEvent, useState } from "react";
import { Avatar, Button, Dropdown, Flex, Input, Tooltip, Typography, theme } from "antd";
import type { MenuProps } from "antd";
import {
  DownOutlined,
  EnvironmentOutlined,
  FileGifOutlined,
  FileImageOutlined,
  GlobalOutlined,
  LockOutlined,
  ScheduleOutlined,
  SmileOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

interface PostComposerProps {
  avatarUrl?: string;
  fullName?: string;
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
  isInModal?: boolean;
}

type Audience = "everyone" | "followers" | "verified";

const audienceLabels: Record<Audience, string> = {
  everyone: "Herkes",
  followers: "Takipciler",
  verified: "Onayli hesaplar",
};

const audienceMenuItems: MenuProps["items"] = [
  { key: "everyone", icon: <GlobalOutlined />, label: "Herkes" },
  { key: "followers", icon: <TeamOutlined />, label: "Takipciler" },
  { key: "verified", icon: <LockOutlined />, label: "Onayli hesaplar" },
];

const mediaIcons = [
  { icon: <FileImageOutlined />, tip: "Medya" },
  { icon: <FileGifOutlined />, tip: "GIF" },
  { icon: <UnorderedListOutlined />, tip: "Anket" },
  { icon: <SmileOutlined />, tip: "Emoji" },
  { icon: <ScheduleOutlined />, tip: "Planla" },
  { icon: <EnvironmentOutlined />, tip: "Konum" },
];

export default function PostComposer({
  avatarUrl,
  fullName,
  isSubmitting,
  onSubmit,
  isInModal = false,
}: PostComposerProps) {
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audience, setAudience] = useState<Audience>("everyone");
  const { token } = theme.useToken();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setErrorMessage("Paylasim metni bos olamaz.");
      return;
    }

    try {
      setErrorMessage(null);
      await onSubmit(trimmedContent);
      setContent("");
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
            <Dropdown
              menu={{
                items: audienceMenuItems,
                selectedKeys: [audience],
                onClick: ({ key }) => setAudience(key as Audience),
              }}
              trigger={["click"]}
            >
              <Button
                size="small"
                shape="round"
                style={{
                  color: "#1D9BF0",
                  borderColor: "#1D9BF0",
                  fontWeight: 700,
                  fontSize: 14,
                  padding: "0 12px",
                  height: 24,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  width: "fit-content",
                  marginBottom: 4,
                }}
              >
                {audienceLabels[audience]} <DownOutlined style={{ fontSize: 10 }} />
              </Button>
            </Dropdown>

            <Input.TextArea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Neler oluyor?"
              bordered={false}
              style={{
                fontSize: 20,
                padding: "12px 0",
                boxShadow: "none",
                resize: "none",
                minHeight: 56,
              }}
              maxLength={1500}
              autoSize={{ minRows: isInModal ? 4 : 1, maxRows: 8 }}
            />

            <Flex align="center" gap={6} style={{ marginTop: 4, marginBottom: 12 }}>
              <GlobalOutlined style={{ color: "#1D9BF0", fontSize: 14 }} />
              <Typography.Text style={{ color: "#1D9BF0", fontSize: 14, fontWeight: 500 }}>
                Herkes yanitlayabilir
              </Typography.Text>
            </Flex>

            <div style={{ height: 1, background: token.colorBorderSecondary, marginBottom: 12 }} />

            <Flex align="center" justify="space-between">
              <Flex align="center" gap={2}>
                {mediaIcons.map((item, index) => (
                  <Tooltip key={index} title={item.tip}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={item.icon}
                      style={{ color: "#1D9BF0", fontSize: 18, width: 36, height: 36 }}
                    />
                  </Tooltip>
                ))}
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
                    disabled={!content.trim()}
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
