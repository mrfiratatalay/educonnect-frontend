import type { LucideIcon } from "lucide-react";
import { Card, Flex, Statistic, Typography, theme } from "antd";

interface DashboardStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  loading?: boolean;
  accentBackground: string;
  accentColor: string;
}

export default function DashboardStatCard({
  icon: Icon,
  label,
  value,
  loading = false,
  accentBackground,
  accentColor,
}: DashboardStatCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="outlined"
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Typography.Text
            type="secondary"
            style={{ display: "block", marginBottom: 8 }}
          >
            {label}
          </Typography.Text>

          <Statistic
            loading={loading}
            value={value}
            valueStyle={{
              color: token.colorText,
              fontSize: 30,
              lineHeight: 1.1,
            }}
          />
        </div>

        <Flex
          align="center"
          justify="center"
          style={{
            width: 52,
            height: 52,
            borderRadius: token.borderRadiusLG,
            background: accentBackground,
            color: accentColor,
            flexShrink: 0,
          }}
        >
          <Icon size={24} />
        </Flex>
      </Flex>
    </Card>
  );
}
