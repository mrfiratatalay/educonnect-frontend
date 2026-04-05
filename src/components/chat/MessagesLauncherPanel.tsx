import { Button, Card, Flex, Input, Typography, theme } from "antd";
import {
  ChevronDown,
  Maximize2,
  MessageCircle,
  MessageSquarePlus,
  Search,
} from "lucide-react";

interface MessagesLauncherPanelProps {
  onClose: () => void;
  onExpand: () => void;
}

const panelShadow =
  "0 24px 80px rgba(15, 23, 42, 0.18), 0 10px 32px rgba(15, 23, 42, 0.08)";

export default function MessagesLauncherPanel({
  onClose,
  onExpand,
}: MessagesLauncherPanelProps) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 28,
        borderColor: "#E5EAF1",
        background: "#FFFFFF",
        boxShadow: panelShadow,
      }}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{ padding: "18px 20px 14px" }}
      >
        <Typography.Title
          level={2}
          style={{
            margin: 0,
            fontSize: 22,
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: "-0.03em",
          }}
        >
          Sohbet
        </Typography.Title>

        <Flex align="center" gap={8}>
          <Button
            type="default"
            shape="round"
            style={{
              height: 40,
              paddingInline: 16,
              borderColor: "#E5EAF1",
              boxShadow: "none",
              fontWeight: 700,
              color: "#243041",
            }}
          >
            <Flex align="center" gap={6}>
              <span>Tumu</span>
              <ChevronDown size={14} />
            </Flex>
          </Button>

          <Button
            type="text"
            shape="circle"
            aria-label="Yeni mesaj"
            icon={<MessageSquarePlus size={18} />}
            style={{
              width: 38,
              height: 38,
              color: token.colorText,
            }}
          />

          <Button
            type="text"
            shape="circle"
            aria-label="Tam ekran"
            icon={<Maximize2 size={18} />}
            onClick={onExpand}
            style={{
              width: 38,
              height: 38,
              color: token.colorText,
            }}
          />

          <Button
            type="text"
            shape="circle"
            aria-label="Kapat"
            icon={<ChevronDown size={18} />}
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              color: token.colorText,
            }}
          />
        </Flex>
      </Flex>

      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            height: 48,
            borderRadius: 999,
            background: "#F1F5F9",
            display: "flex",
            alignItems: "center",
            paddingInline: 18,
          }}
        >
          <Input
            prefix={<Search size={18} style={{ color: "#64748B", marginRight: 8 }} />}
            placeholder="Ara"
            variant="borderless"
            style={{
              fontSize: 16,
              color: "#475569",
            }}
          />
        </div>
      </div>

      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          minHeight: 360,
          padding: "24px 24px 40px",
          textAlign: "center",
        }}
      >
        <MessageCircle
          size={96}
          strokeWidth={1.5}
          style={{ color: "#111827", marginBottom: 22 }}
        />

        <Typography.Title
          level={2}
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: "-0.04em",
          }}
        >
          Gelen kutusu bos
        </Typography.Title>

        <Typography.Text
          type="secondary"
          style={{
            marginTop: 10,
            fontSize: 15,
          }}
        >
          Birilerine mesaj gonder
        </Typography.Text>
      </Flex>
    </Card>
  );
}
