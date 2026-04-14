import type { ReactNode } from "react";
import { Ellipsis, Search } from "lucide-react";
import { Card, Flex, Input, Typography, theme } from "antd";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";

const trendItems = [
  { id: "trend-1", category: "Kampus gundemi", title: "#FinalHaftasi" },
  { id: "trend-2", category: "Teknoloji", title: "React 20" },
  { id: "trend-3", category: "Universite", title: "Kulup basvurulari" },
];

const footerLinks = ["Hizmet Sartlari", "Gizlilik Politikasi", "Cerez Politikasi", "Reklam bilgisi"];

export default function ProfileRightRail() {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#000000";
  const railSurface = isDarkMode ? "#16181C" : "#F7F9F9";

  return (
    <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
      <div style={{ position: "sticky", top: 12 }}>
        <Flex vertical gap={16}>
          <Input
            size="large" placeholder="Ara"
            prefix={<Search size={18} style={{ color: token.colorTextTertiary }} />}
            variant="filled"
            style={{ borderRadius: 999, background: railSurface }}
          />

          <FollowSuggestionsCard
            title="Bunlari begenebilirsin"
            background={railSurface}
            bordered={false}
          />

          <RailCard title="Neler oluyor?" background={railSurface}>
            {trendItems.map((item) => (
              <RailRow key={item.id}>
                <Flex justify="space-between" align="flex-start" gap={12}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>{item.category}</Typography.Text>
                    <Typography.Text strong style={{ display: "block", fontSize: 16, lineHeight: 1.35, marginTop: 2 }}>{item.title}</Typography.Text>
                  </div>
                  <Ellipsis size={18} color={token.colorTextTertiary} />
                </Flex>
              </RailRow>
            ))}
            <Typography.Link style={{ padding: "0 16px 16px", fontSize: 15 }}>Daha fazla goster</Typography.Link>
          </RailCard>

          <Flex wrap gap={8} style={{ paddingInline: 12 }}>
            {footerLinks.map((item) => (
              <Typography.Text key={item} type="secondary" style={{ fontSize: 13 }}>{item}</Typography.Text>
            ))}
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>(c) 2026 EduConnect Corp.</Typography.Text>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

function RailCard({ title, background, children }: { title: string; background: string; children: ReactNode }) {
  const { token } = theme.useToken();
  return (
    <Card variant="borderless"
      style={{ background, overflow: "hidden", borderRadius: 24, border: `1px solid ${token.colorBorderSecondary}` }}
      styles={{ body: { padding: 0 } }}>
      <Flex vertical gap={2}>
        <Typography.Title level={4}
          style={{ margin: 0, padding: "14px 16px 8px", fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em" }}>
          {title}
        </Typography.Title>
        {children}
      </Flex>
    </Card>
  );
}

function RailRow({ children }: { children: ReactNode }) {
  return <div style={{ padding: "10px 16px" }}>{children}</div>;
}
