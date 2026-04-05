import { Button, Flex, Input, Typography, theme, Tooltip } from "antd";
import { MessageSquarePlus, MessageSquare, Search, Settings } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

export default function MessagesPage() {
  const { token } = theme.useToken();
  const isDark = useThemeStore((state) => state.isDark);

  return (
    <Flex style={{ height: "100%", overflow: "hidden" }}>
      {/* Left Panel: Chat List */}
      <Flex
        vertical
        style={{
          width: 390,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          height: "100%",
        }}
      >
        {/* Header */}
        <Flex
          align="center"
          justify="space-between"
          style={{ padding: "0 16px", height: 53, flexShrink: 0 }}
        >
          <Typography.Title
            level={2}
            style={{ margin: 0, fontSize: 20, fontWeight: 700 }}
          >
            Sohbet
          </Typography.Title>

          <Flex align="center" gap={8}>
            <Tooltip title="Tümü">
              <Button
                type="text"
                style={{
                  borderRadius: 9999,
                  height: 32,
                  fontWeight: 700,
                  fontSize: 15,
                  padding: "0 12px",
                  background: isDark ? "#202327" : "#EFF3F4",
                }}
              >
                Tümü <span style={{ marginLeft: 4, fontSize: 10 }}>▼</span>
              </Button>
            </Tooltip>

            <Tooltip title="Yeni Mesaj">
              <Button
                type="text"
                shape="circle"
                icon={<MessageSquarePlus size={20} />}
              />
            </Tooltip>
          </Flex>
        </Flex>

        {/* Search */}
        <div style={{ padding: "4px 16px 12px", flexShrink: 0 }}>
          <Input
            prefix={<Search size={18} style={{ color: token.colorTextSecondary, marginRight: 8 }} />}
            placeholder="Ara"
            style={{
              borderRadius: 9999,
              background: isDark ? "#202327" : "#EFF3F4",
              border: "none",
              height: 44,
              fontSize: 15,
            }}
          />
        </div>

        {/* Empty State Left */}
        <Flex
          vertical
          align="center"
          justify="center"
          style={{ flex: 1, padding: 32, textAlign: "center" }}
        >
          <div style={{ marginBottom: 16 }}>
            <MessageSquare size={72} strokeWidth={1} style={{ opacity: 0.8 }} />
          </div>
          <Typography.Title level={3} style={{ margin: "0 0 8px 0", fontSize: 31, fontWeight: 800 }}>
            Gelen kutusu boş
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 15 }}>
            Birilerine mesaj gönder
          </Typography.Text>
        </Flex>
      </Flex>

      {/* Right Panel: Chat Content */}
      <Flex
        vertical
        align="center"
        justify="center"
        style={{ flex: 1, height: "100%", padding: 32, textAlign: "center" }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: isDark ? "#202327" : "#EFF3F4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <MessageSquare size={48} strokeWidth={1.5} style={{ opacity: 0.9 }} />
        </div>

        <Typography.Title level={2} style={{ margin: "0 0 12px 0", fontSize: 31, fontWeight: 800 }}>
          Sohbet Başlat
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 15, marginBottom: 28, maxWidth: 400 }}>
          Mevcut sohbetlerin arasından seçim yap veya yeni bir sohbet başlat.
        </Typography.Text>

        <Button
          type="primary"
          size="large"
          style={{
            height: 52,
            padding: "0 32px",
            fontSize: 17,
            fontWeight: 700,
            borderRadius: 9999,
            background: isDark ? "#FFFFFF" : "#0F1419",
            color: isDark ? "#0F1419" : "#FFFFFF",
            border: "none",
          }}
        >
          Yeni sohbet
        </Button>
      </Flex>
    </Flex>
  );
}
