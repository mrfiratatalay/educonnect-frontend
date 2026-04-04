import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Typography, theme } from "antd";
import { getApiErrorMessage, login as loginRequest } from "@/features/auth/api";
import { AuthPageFooter, AuthPageIntro } from "@/pages/Auth/AuthPageParts";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const { token } = theme.useToken();

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
      navigate("/");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <Flex vertical gap={32}>
      <AuthPageIntro
        title="Hos Geldiniz"
        description="Hesabiniza giris yaparak ders, topluluk ve kampus akisini kaldiginiz yerden devam ettirin."
      />

      <Form
        layout="vertical"
        requiredMark={false}
        size="large"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="E-posta"
          validateStatus={errors.email ? "error" : undefined}
          help={errors.email?.message}
        >
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
                placeholder="ornek@universite.edu.tr"
                status={errors.email ? "error" : undefined}
              />
            )}
          />
        </Form.Item>

        <div style={{ marginBottom: 8 }}>
          <Flex align="center" justify="space-between" gap={16}>
            <Typography.Text strong>Sifre</Typography.Text>
            <Link
              to="/forgot-password"
              style={{
                color: token.colorPrimary,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Sifremi unuttum
            </Link>
          </Flex>
        </div>

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
                placeholder="********"
                status={errors.password ? "error" : undefined}
              />
            )}
          />
        </Form.Item>

        {submitError && (
          <Alert
            type="error"
            showIcon
            title={submitError}
            style={{ marginBottom: 24 }}
          />
        )}

        <Button type="primary" htmlType="submit" block loading={isSubmitting} size="large">
          {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
        </Button>
      </Form>

      <AuthPageFooter prompt="Hesabiniz yok mu?" to="/register" linkText="Kayit Ol" />
    </Flex>
  );
}
