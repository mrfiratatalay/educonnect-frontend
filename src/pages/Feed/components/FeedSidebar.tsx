import { Input, Typography, theme, Button, Flex } from "antd";
import { SearchOutlined, EllipsisOutlined } from "@ant-design/icons";
import type { FeedPost } from "@/features/posts/types";
import type { User } from "@/types";

interface FeedSidebarProps {
  posts: FeedPost[];
  totalCount: number;
  user: User | null;
}

export default function FeedSidebar({}: FeedSidebarProps) {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#000000";

  const cardStyle = {
    background: isDarkMode ? "#16181C" : "#F7F9F9",
    borderRadius: 16,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  };

  const trendItemStyle = {
    display: "flex",
    flexDirection: "column" as const,
    cursor: "pointer",
    padding: "8px 0",
  };

  return (
    <Flex vertical gap={16}>
      {/* Search Bar - Pill shape, filled */}
      <Input
        size="large"
        prefix={<SearchOutlined style={{ color: token.colorTextTertiary, fontSize: 18, marginLeft: 8, marginRight: 8 }} />}
        placeholder="Ara"
        style={{
          borderRadius: 9999,
          background: isDarkMode ? "#202327" : "#EFF3F4",
          border: "none",
          fontWeight: 400,
          padding: "6px 12px",
        }}
        bordered={false}
      />



      {/* Trends Card */}
      <div style={cardStyle}>
        <Typography.Text style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
          Neler oluyor?
        </Typography.Text>

        <div style={trendItemStyle}>
          <Flex justify="space-between" align="flex-start">
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>TÜBİTAK · Gündemdekiler</Typography.Text>
            <EllipsisOutlined style={{ color: token.colorTextTertiary }} />
          </Flex>
          <Typography.Text style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>#YapayZeka</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13, marginTop: 2 }}>2.4 B gönderi</Typography.Text>
        </div>

        <div style={trendItemStyle}>
          <Flex justify="space-between" align="flex-start">
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>Mühendislik · Gündemdekiler</Typography.Text>
            <EllipsisOutlined style={{ color: token.colorTextTertiary }} />
          </Flex>
          <Typography.Text style={{ fontSize: 15, fontWeight: 700, marginTop: 2 }}>Bitirme Projeleri</Typography.Text>
        </div>

        <Typography.Link style={{ fontSize: 15 }}>Daha fazla göster</Typography.Link>
      </div>

      {/* Who to Follow Card */}
      <div style={cardStyle}>
        <Typography.Text style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
          Kimi takip etmeli
        </Typography.Text>

        <Flex gap={12} align="center" style={{ margin: "4px 0" }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jon" alt="Jon" width={40} height={40} style={{ borderRadius: '50%', background: token.colorBgLayout }} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong ellipsis style={{ fontSize: 15, lineHeight: 1.2 }}>Jon Allie</Typography.Text>
            <Typography.Text type="secondary" ellipsis style={{ fontSize: 15 }}>@jonallie</Typography.Text>
          </div>
          <Button type="primary" shape="round" style={{ fontWeight: 700, padding: "0 16px" }}>
            Takip et
          </Button>
        </Flex>

        <Flex gap={12} align="center" style={{ margin: "4px 0" }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Erdem" alt="Erdem" width={40} height={40} style={{ borderRadius: '50%', background: token.colorBgLayout }} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong ellipsis style={{ fontSize: 15, lineHeight: 1.2 }}>Erdem Ayaz</Typography.Text>
            <Typography.Text type="secondary" ellipsis style={{ fontSize: 15 }}>@3rdemayaz</Typography.Text>
          </div>
          <Button type="primary" shape="round" style={{ fontWeight: 700, padding: "0 16px" }}>
            Takip et
          </Button>
        </Flex>

        <Flex gap={12} align="center" style={{ margin: "4px 0" }}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Matthew" alt="Matthew" width={40} height={40} style={{ borderRadius: '50%', background: token.colorBgLayout }} />
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <Typography.Text strong ellipsis style={{ fontSize: 15, lineHeight: 1.2 }}>Matthew Gallagher</Typography.Text>
            <Typography.Text type="secondary" ellipsis style={{ fontSize: 15 }}>@galligator</Typography.Text>
          </div>
          <Button type="primary" shape="round" style={{ fontWeight: 700, padding: "0 16px" }}>
            Takip et
          </Button>
        </Flex>

        <Typography.Link style={{ fontSize: 15 }}>Daha fazla göster</Typography.Link>
      </div>

      {/* Footer Links */}
      <div style={{ padding: "0 16px" }}>
        <Flex wrap="wrap" gap={8}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>Hizmet Şartları</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>Gizlilik Politikası</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>Çerez Politikası</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>© 2026 EduConnect Corp.</Typography.Text>
        </Flex>
      </div>
    </Flex>
  );
}
