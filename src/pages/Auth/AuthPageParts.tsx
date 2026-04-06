import type { CSSProperties } from "react";
import { Flex, Typography } from "antd";

export const authPalette = {
  background: "#FFFFFF",
  text: "#0F1419",
  muted: "#536471",
  border: "#CFD9DE",
  borderStrong: "#9BA6AD",
  primary: "#1D9BF0",
  white: "#FFFFFF",
  ink: "#0F1419",
} as const;

export const authInputStyle: CSSProperties = {
  height: 56,
  borderRadius: 14,
  background: "transparent",
  borderColor: authPalette.border,
  color: authPalette.text,
  fontSize: 17,
};

export const authSelectStyle: CSSProperties = {
  height: 56,
};

export const authPrimaryButtonStyle: CSSProperties = {
  height: 48,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 800,
  background: authPalette.ink,
  color: authPalette.white,
  border: "none",
  boxShadow: "none",
};

export const authSecondaryButtonStyle: CSSProperties = {
  height: 48,
  borderRadius: 999,
  fontSize: 16,
  fontWeight: 700,
  background: "transparent",
  color: authPalette.text,
  borderColor: authPalette.borderStrong,
  boxShadow: "none",
};

export const authAlertStyle: CSSProperties = {
  background: "rgba(244, 33, 46, 0.08)",
  border: "1px solid rgba(244, 33, 46, 0.2)",
  borderRadius: 16,
};

export const authSuccessAlertStyle: CSSProperties = {
  background: "rgba(0, 186, 124, 0.08)",
  border: "1px solid rgba(0, 186, 124, 0.2)",
  borderRadius: 16,
};

export const authWarningAlertStyle: CSSProperties = {
  background: "rgba(245, 158, 11, 0.08)",
  border: "1px solid rgba(245, 158, 11, 0.2)",
  borderRadius: 16,
};

interface AuthPageIntroProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function AuthPageIntro({ eyebrow, title, description }: AuthPageIntroProps) {
  return (
    <Flex vertical gap={12} style={{ marginBottom: 28 }}>
      {eyebrow ? (
        <Typography.Text
          style={{
            color: authPalette.muted,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </Typography.Text>
      ) : null}

      <Typography.Title
        level={2}
        style={{
          color: authPalette.text,
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1.05,
          margin: 0,
        }}
      >
        {title}
      </Typography.Title>

      {description ? (
        <Typography.Paragraph
          style={{
            color: authPalette.muted,
            fontSize: 15,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 380,
          }}
        >
          {description}
        </Typography.Paragraph>
      ) : null}
    </Flex>
  );
}

interface AuthStepLabelProps {
  current: number;
  total: number;
  label: string;
}

export function AuthStepLabel({ current, total, label }: AuthStepLabelProps) {
  return (
    <Typography.Text
      style={{
        display: "inline-block",
        marginBottom: 16,
        color: authPalette.muted,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      Adim {current}/{total} - {label}
    </Typography.Text>
  );
}

interface AuthPageFooterProps {
  prompt: string;
  linkText: string;
  onClick: () => void;
  align?: "left" | "center";
}

export function AuthPageFooter({
  prompt,
  linkText,
  onClick,
  align = "left",
}: AuthPageFooterProps) {
  return (
    <Typography.Paragraph
      style={{
        marginTop: 28,
        marginBottom: 0,
        color: authPalette.muted,
        fontSize: 15,
        textAlign: align,
      }}
    >
      {prompt}{" "}
      <Typography.Link
        onClick={onClick}
        style={{
          color: authPalette.primary,
          fontSize: 15,
          fontWeight: 500,
        }}
      >
        {linkText}
      </Typography.Link>
    </Typography.Paragraph>
  );
}

export function AuthLegalText() {
  return (
    <Typography.Paragraph
      style={{
        color: authPalette.muted,
        fontSize: 12,
        lineHeight: 1.5,
        margin: 0,
        maxWidth: 320,
      }}
    >
      Kayit olarak{" "}
      <Typography.Text style={{ color: authPalette.primary, fontSize: 12 }}>
        Hizmet Sartlari
      </Typography.Text>{" "}
      ve{" "}
      <Typography.Text style={{ color: authPalette.primary, fontSize: 12 }}>
        Gizlilik Politikasi
      </Typography.Text>
      'ni kabul etmis olursun.
    </Typography.Paragraph>
  );
}
