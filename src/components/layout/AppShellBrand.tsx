import { Flex, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";

interface AppShellBrandProps {
  compact?: boolean;
  to?: string;
}

export default function AppShellBrand({
  compact = false,
  to = "/",
}: AppShellBrandProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <div
      onClick={() => navigate(to)}
      style={{
        cursor: "pointer",
        padding: 0,
        borderRadius: token.borderRadiusLG,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      <Flex align="center" gap={compact ? 10 : 12}>
        <div style={{ display: "inline-flex", flexShrink: 0 }}>
          <img
            src="/logo.png"
            alt="EduConnect"
            style={{ width: compact ? 64 : 72, height: compact ? 64 : 72, objectFit: "contain", display: "block" }}
          />
        </div>

        <Typography.Text
          strong
          style={{
            color: token.colorText,
            fontSize: compact ? 18 : 20,
            letterSpacing: "-0.02em",
          }}
        >
          Edu<span style={{ color: token.colorPrimary }}>Connect</span>
        </Typography.Text>
      </Flex>
    </div>
  );
}
