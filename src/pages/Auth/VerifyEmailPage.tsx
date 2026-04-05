import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Result } from "antd";
import { getApiErrorMessage, resendEmailVerification, verifyEmail } from "@/features/auth/api";
import {
  AuthPageIntro,
  AuthPageFooter,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
} from "./AuthPageParts";

const schema = z.object({
  email: z.string().email("Gecerli bir universite e-posta adresi girin"),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Dogrulama kodu 6 haneli olmali"),
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
          title="Kurumsal e-posta dogrulandi"
          subTitle="Hesabin artik aktif. Universite e-posta adresinle giris yapabilirsin."
          extra={
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/login", { replace: true })}
              style={authPrimaryButtonStyle}
            >
              Giris sayfasina git
            </Button>
          }
        />
      </Flex>
    );
  }

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 380 }}>
      <AuthPageIntro
        eyebrow="Kurumsal e-posta kontrolu"
        title="E-postani dogrula"
        description="Universite e-posta adresine gonderilen 6 haneli kodu gir. Kod gelmediyse ayni ekrandan yeni kod isteyebilirsin."
      />

      <Form layout="vertical" requiredMark={false} size="large" onFinish={handleSubmit(onSubmit)}>
        <Form.Item validateStatus={errors.email ? "error" : undefined} help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoFocus={!emailFromQuery}
                allowClear
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="Universite e-posta adresi"
                status={errors.email ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </Form.Item>

        <Form.Item validateStatus={errors.code ? "error" : undefined} help={errors.code?.message}>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                allowClear
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="6 haneli dogrulama kodu"
                status={errors.code ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </Form.Item>

        {resendSuccess ? (
          <Alert
            type="success"
            showIcon
            message={resendSuccess}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        {submitError ? (
          <Alert
            type="error"
            showIcon
            message={submitError}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        {resendError ? (
          <Alert
            type="error"
            showIcon
            message={resendError}
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
            {isSubmitting ? "Dogrulaniyor..." : "E-postayi dogrula"}
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
            {isResending ? "Yeni kod gonderiliyor..." : "Yeni kod iste"}
          </Button>
        </Flex>
      </Form>

      <AuthPageFooter
        prompt="Giris ekranina donmek ister misin?"
        linkText="Giris yap"
        onClick={() => navigate("/login")}
      />
    </Flex>
  );
}
