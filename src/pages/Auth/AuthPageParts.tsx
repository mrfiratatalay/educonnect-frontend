import type { CSSProperties, ReactNode } from "react";
import { Flex, Typography } from "antd";

export const authPalette = {
  background: "#FFFFFF",
  text: "#0F172A",
  muted: "#475569",
  border: "#E2E8F0",
  borderStrong: "#94A3B8",
  primary: "#0D9488",
  white: "#FFFFFF",
  ink: "#0F766E",
} as const;

export const authInputStyle: CSSProperties = {
  height: 56,
  borderRadius: 8,
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
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 700,
  background: authPalette.ink,
  color: authPalette.white,
  border: "none",
  boxShadow: "none",
};

export const authSecondaryButtonStyle: CSSProperties = {
  height: 48,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
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
      Kayıt olarak{" "}
      <Typography.Text style={{ color: authPalette.primary, fontSize: 12 }}>
        Hizmet Şartları
      </Typography.Text>{" "}
      ve{" "}
      <Typography.Text style={{ color: authPalette.primary, fontSize: 12 }}>
        Gizlilik Politikası
      </Typography.Text>
      'ni kabul etmis olursun.
    </Typography.Paragraph>
  );
}

interface FieldWrapperProps {
  error?: string;
  children: ReactNode;
}

/**
 * Lightweight replacement for antd Form.Item when using react-hook-form.
 *
 * Ant Design v6's Form.Item uses cloneElement to inject its own form control
 * props (value, onChange) from rc-field-form into child components. Even without
 * a `name` prop, it still overrides children's value with `undefined`, whiçh
 * breaks Zod 4 validation ("expected string, received undefined").
 *
 * This wrapper provides the same visual spacing and error display without
 * interfering with react-hook-form's controlled values.
 */
export function FieldWrapper({ error, children }: FieldWrapperProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      {children}
      {error ? (
        <Typography.Text
          style={{
            display: "block",
            marginTop: 4,
            color: "#ff4d4f",
            fontSize: 14,
            lineHeight: 1.4,
          }}
        >
          {error}
        </Typography.Text>
      ) : null}
    </div>
  );
}

