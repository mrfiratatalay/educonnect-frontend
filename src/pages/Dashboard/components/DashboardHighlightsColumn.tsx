import { Button, Card, Flex, Tag, Typography, theme } from "antd";
import { ArrowRight, BadgePercent, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { Discount } from "@/types";

interface DashboardHighlightsColumnProps {
  discounts: Discount[];
  onOpenChat: () => void;
}

export default function DashboardHighlightsColumn({
  discounts,
  onOpenChat,
}: DashboardHighlightsColumnProps) {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={16}>
      <Card
        variant="borderless"
        styles={{
          body: {
            padding: 24,
          },
        }}
        style={{
          background: `linear-gradient(145deg, ${token.colorPrimary} 0%, #3348c8 100%)`,
          color: token.colorTextLightSolid,
          boxShadow: token.boxShadow,
        }}
      >
        <Flex vertical gap={18}>
          <Flex
            align="center"
            justify="center"
            style={{
              width: 52,
              height: 52,
              borderRadius: token.borderRadiusLG,
              background: "rgba(255, 255, 255, 0.16)",
            }}
          >
            <Search size={24} />
          </Flex>

          <div>
            <Typography.Title
              level={4}
              style={{ color: token.colorTextLightSolid, margin: 0 }}
            >
              Gorsel Arama
            </Typography.Title>
            <Typography.Paragraph
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                margin: "8px 0 0",
              }}
            >
              Bir fotograf yukleyin, benzer urunleri aninda bulun ve ikinci el
              firsatlarini hizlica karsilastirin.
            </Typography.Paragraph>
          </div>

          <Link to="/visual-search" style={{ textDecoration: "none" }}>
            <Button
              block
              size="large"
              icon={<ArrowRight size={16} />}
              iconPlacement="end"
            >
              Aramayi Baslat
            </Button>
          </Link>
        </Flex>
      </Card>

      <Card
        title={
          <Flex align="center" gap={10}>
            <BadgePercent size={18} color={token.colorWarning} />
            <Typography.Text strong>Gunun Indirimleri</Typography.Text>
          </Flex>
        }
        styles={{
          body: {
            padding: 20,
          },
        }}
      >
        <Flex vertical gap={12}>
          {discounts.map((discount) => (
            <div
              key={discount.id}
              style={{
                padding: 14,
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: token.borderRadiusLG,
                background: token.colorBgLayout,
              }}
            >
              <Flex align="center" justify="space-between" gap={12}>
                <Typography.Text strong>{discount.businessName}</Typography.Text>
                <Tag color="gold">%{discount.discountRate}</Tag>
              </Flex>

              <Typography.Paragraph
                type="secondary"
                ellipsis={{ rows: 2 }}
                style={{ margin: "8px 0 0" }}
              >
                {discount.title}
              </Typography.Paragraph>
            </div>
          ))}

          <Link to="/explore?tab=discounts" style={{ textDecoration: "none" }}>
            <Button type="default" block icon={<ArrowRight size={14} />} iconPlacement="end">
              Tum Indirimleri Gor
            </Button>
          </Link>
        </Flex>
      </Card>

      <Card
        styles={{
          body: {
            padding: 20,
          },
        }}
      >
        <Flex vertical gap={16} align="center">
          <Flex
            align="center"
            justify="center"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: token.colorPrimaryBg,
              color: token.colorPrimary,
            }}
          >
            <Sparkles size={26} />
          </Flex>

          <div style={{ textAlign: "center" }}>
            <Typography.Title level={5} style={{ margin: 0 }}>
              AI Asistani
            </Typography.Title>
            <Typography.Paragraph type="secondary" style={{ margin: "8px 0 0" }}>
              Dersler, kampus bilgileri ve gunluk akisin icin yardim almaya hemen basla.
            </Typography.Paragraph>
          </div>

          <Button type="primary" block onClick={onOpenChat}>
            Sohbeti Baslat
          </Button>
        </Flex>
      </Card>
    </Flex>
  );
}
