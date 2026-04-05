import { Avatar, Button, Flex, Typography, theme } from "antd";
import { GraduationCap } from "lucide-react";
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
    <Button
      type="text"
      onClick={() => navigate(to)}
      style={{
        height: "auto",
        padding: 0,
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Flex align="center" gap={compact ? 10 : 12}>
        <Avatar
          shape="square"
          size={compact ? 32 : 36}
          style={{
            backgroundColor: token.colorPrimary,
            color: token.colorTextLightSolid,
            borderRadius: compact ? token.borderRadius : token.borderRadiusLG,
          }}
        >
          <GraduationCap size={compact ? 16 : 18} />
        </Avatar>

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
    </Button>
  );
}
