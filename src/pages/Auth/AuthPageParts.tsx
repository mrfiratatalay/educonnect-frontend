import { Typography, theme } from "antd";
import { Link } from "react-router-dom";

interface AuthPageIntroProps {
  title: string;
  description: string;
}

export function AuthPageIntro({ title, description }: AuthPageIntroProps) {
  return (
    <div>
      <Typography.Title
        level={2}
        style={{
          letterSpacing: "-0.03em",
          margin: 0,
        }}
      >
        {title}
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{
          marginBottom: 0,
          marginTop: 8,
        }}
      >
        {description}
      </Typography.Paragraph>
    </div>
  );
}

interface AuthPageFooterProps {
  prompt: string;
  to: string;
  linkText: string;
}

export function AuthPageFooter({ prompt, to, linkText }: AuthPageFooterProps) {
  const { token } = theme.useToken();

  return (
    <Typography.Paragraph
      type="secondary"
      style={{
        marginBottom: 0,
        textAlign: "center",
      }}
    >
      {prompt}{" "}
      <Link
        to={to}
        style={{
          color: token.colorPrimary,
          fontWeight: 600,
        }}
      >
        {linkText}
      </Link>
    </Typography.Paragraph>
  );
}
