import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Input, Result } from "antd";
import { getApiErrorMessage, resendEmailVerification, verifyEmail } from "@/features/auth/api";
import {
  AuthPageIntro,
  AuthPageFooter,
  FieldWrapper,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
} from "./AuthPageParts";

const schema = z.object({
  email: z.string().email("Geçerli bir üniversite e-posta adresi girin"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Doğrulama kodu 6 haneli olmalı"),
});

type VerifyEmailForm = z.infer<typeof schema>;

interface NavigationState {
  message?: string;
}

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(
    (location.state as NavigationState | null)?.message ?? null,
  );
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const emailFromQuery = searchParams.get("email") ?? "";

  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromQuery,
      code: "",
    },
  });

  useEffect(() => {
    if (emailFromQuery) {
      setValue("email", emailFromQuery);
    }
  }, [emailFromQuery, setValue]);

  const onSubmit = async (data: VerifyEmailForm) => {
    setSubmitError(null);

    try {
      await verifyEmail(data);
      setIsVerified(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  const handleResend = async () => {
    const isEmailValid = await trigger("email", { shouldFocus: true });
    if (!isEmailValid) {
      return;
    }

    setResendError(null);
    setResendSuccess(null);
    setIsResending(true);

    try {
      const challenge = await resendEmailVerification(getValues("email"));
      setResendSuccess(challenge.message);
    } catch (error) {
      setResendError(getApiErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  if (isVerified) {
    return (
      <Flex vertical style={{ width: "100%", maxWidth: 380 }}>
        <Result
          status="success"
          title="Kurumsal e-posta doğrulandı"
          subTitle="Hesabın artık aktif. Üniversite e-posta adresinle giriş yapabilirsin."
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/login", { replace: true })}
              style={authPrimaryButtonStyle}
            >
              Giriş sayfasına git
            </Button>
          }
        />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 380 }}>
      <AuthPageIntro
        eyebrow="Kurumsal e-posta kontrolü"
        title="E-postanı doğrula"
        description="Üniversite e-posta adresine gönderilen 6 haneli kodu gir. Kod gelmediyse aynı ekrandan yeni kod isteyebilirsin."
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
      >
        <FieldWrapper error={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                autoFocus={!emailFromQuery}
                allowClear
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Üniversite e-posta adresi"
                size="large"
                status={errors.email ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.code?.message}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                allowClear
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6 haneli doğrulama kodu"
                size="large"
                status={errors.code ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </FieldWrapper>

        {resendSuccess ? (
          <Alert
            type="success"
            showIcon
            title={resendSuccess}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        {submitError ? (
          <Alert
            type="error"
            showIcon
            title={submitError}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        {resendError ? (
          <Alert
            type="error"
            showIcon
            title={resendError}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        <Flex vertical gap={12}>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={isSubmitting}
            style={authPrimaryButtonStyle}
          >
            {isSubmitting ? "Doğrulanıyor..." : "E-postayı doğrula"}
          </Button>

          <Button
            block
            size="large"
            loading={isResending}
            onClick={() => {
              void handleResend();
            }}
            style={authSecondaryButtonStyle}
          >
            {isResending ? "Yeni kod gönderiliyor..." : "Yeni kod iste"}
          </Button>
        </Flex>
      </form>

      <AuthPageFooter
        prompt="Giriş ekranına dönmek ister misin?"
        linkText="Giriş yap"
        onClick={() => navigate("/login")}
      />
    </Flex>
  );
}
