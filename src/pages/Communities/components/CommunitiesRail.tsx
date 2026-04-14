import type { ReactNode } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Typography, theme } from "antd";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";

const trendItems = [
  { label: "Gundemdekiler", title: "Hayfa" },
  { label: "Haberler", title: "SON DAKIKA" },
  { label: "Turkiye tarihinde gundemde", title: "Narin Guran" },
  { label: "Gundemdekiler", title: "Sokakta" },
];

export default function CommunitiesRail() {
  return (
    <Flex vertical gap={16} style={{ padding: "8px 16px 24px" }}>
      <RailCard
        title="Neler oluyor?"
        footer={
          <Button type="link" style={{ padding: 0 }}>
            Daha fazla goster
          </Button>
        }
      >
        <Flex vertical gap={16}>
          {trendItems.map((item) => (
            <TrendRow key={item.title} label={item.label} title={item.title} />
          ))}
        </Flex>
      </RailCard>

      <FollowSuggestionsCard />

      <div className="communities-meta-links">
        Hizmet Sartlari | Gizlilik Politikasi | Cerez Politikasi | Reklam bilgisi | Daha fazla
      </div>
    </Flex>
  );
}

function RailCard({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      className="communities-side-card"
      variant="outlined"
      style={{
        borderColor: token.colorBorderSecondary,
        overflow: "hidden",
      }}
    >
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
          {title}
        </Typography.Title>
        {children}
        {footer ? <div>{footer}</div> : null}
      </Flex>
    </Card>
  );
}

function TrendRow({ label, title }: { label: string; title: string }) {
  const { token } = theme.useToken();

  return (
    <Flex align="flex-start" justify="space-between" gap={12}>
      <div style={{ minWidth: 0 }}>
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
          {label}
        </Typography.Text>
        <Typography.Text strong style={{ display: "block", fontSize: 17, lineHeight: 1.25 }}>
          {title}
        </Typography.Text>
      </div>
      <EllipsisOutlined style={{ color: token.colorTextTertiary, marginTop: 4 }} />
    </Flex>
  );
}
