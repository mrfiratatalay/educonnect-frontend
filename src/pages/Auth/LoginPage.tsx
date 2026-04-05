import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input } from "antd";
import { getApiErrorMessage, login as loginRequest } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import {
  AuthPageFooter,
  AuthPageIntro,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
} from "./AuthPageParts";

const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);

    try {
      const session = await loginRequest(data);
      setSession(session);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 380 }}>
      <AuthPageIntro
        eyebrow="Hesabina don"
        title="Giris yap"
        description="EduConnect hesabina erismek icin e-posta adresini ve sifreni gir."
      />

      <Form
        layout="vertical"
        requiredMark={false}
        size="large"
        onFinish={handleSubmit(onSubmit)}
        style={{ width: "100%" }}
      >
        <Form.Item validateStatus={errors.email ? "error" : undefined} help={errors.email?.message}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                autoFocus
                allowClear
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="E-posta adresi"
                status={errors.email ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                autoComplete="current-password"
                placeholder="Sifre"
                status={errors.password ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </Form.Item>

        {submitError ? (
          <Alert
            type="error"
            showIcon
            message={submitError}
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
            {isSubmitting ? "Giris yapiliyor..." : "Giris yap"}
          </Button>

          <Button
            block
            size="large"
            onClick={() => navigate("/forgot-password")}
            style={authSecondaryButtonStyle}
          >
            Sifremi unuttum
          </Button>

          <Button
            block
            size="large"
            onClick={() => navigate("/verify-email")}
            style={authSecondaryButtonStyle}
          >
            E-postami dogrula
          </Button>
        </Flex>
      </Form>

      <AuthPageFooter
        prompt="Hesabin yok mu?"
        linkText="Kayit ol"
        onClick={() => navigate("/register")}
      />
    </Flex>
  );
}
