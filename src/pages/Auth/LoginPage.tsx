import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Typography } from "antd";
import { getApiErrorMessage, login as loginRequest } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
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
    <Flex vertical style={{ width: "100%", maxWidth: 364 }}>
      <Typography.Title
        level={2}
        style={{
          color: "#E7E9EA",
          fontSize: 31,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          margin: "0 0 28px 0",
        }}
      >
        EduConnect'e giriş yap
      </Typography.Title>

      <Form
        layout="vertical"
        requiredMark={false}
        size="large"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          validateStatus={errors.email ? "error" : undefined}
          help={errors.email?.message}
          style={{ marginBottom: 20 }}
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
                placeholder="E-posta veya kullanıcı adı"
                status={errors.email ? "error" : undefined}
                style={{
                  height: 56,
                  borderRadius: 4,
                  background: "transparent",
                  borderColor: "#333639",
                  color: "#E7E9EA",
                  fontSize: 17,
                }}
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? "error" : undefined}
          help={errors.password?.message}
          style={{ marginBottom: 24 }}
        >
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                autoComplete="current-password"
                placeholder="Şifre"
                status={errors.password ? "error" : undefined}
                style={{
                  height: 56,
                  borderRadius: 4,
                  background: "transparent",
                  borderColor: "#333639",
                  color: "#E7E9EA",
                  fontSize: 17,
                }}
              />
            )}
          />
        </Form.Item>

        {submitError && (
          <Alert
            type="error"
            showIcon
            message={submitError}
            style={{ marginBottom: 24 }}
          />
        )}

        <Button
          htmlType="submit"
          block
          loading={isSubmitting}
          style={{
            height: 44,
            borderRadius: 9999,
            fontWeight: 700,
            fontSize: 15,
            background: "#FFFFFF",
            color: "#0F1419",
            border: "none",
            marginBottom: 20,
          }}
        >
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>

        <Button
          block
          onClick={() => navigate("/forgot-password")}
          style={{
            height: 44,
            borderRadius: 9999,
            fontWeight: 700,
            fontSize: 15,
            background: "transparent",
            color: "#FFFFFF",
            borderColor: "#536471",
          }}
        >
          Şifremi unuttum?
        </Button>
      </Form>

      <Typography.Paragraph
        style={{
          marginTop: 40,
          marginBottom: 0,
          color: "#71767B",
          fontSize: 15,
        }}
      >
        Hesabın yok mu?{" "}
        <Typography.Link
          onClick={() => navigate("/register")}
          style={{
            color: "#1D9BF0",
            fontWeight: 400,
            fontSize: 15,
          }}
        >
          Kayıt ol
        </Typography.Link>
      </Typography.Paragraph>
    </Flex>
  );
}
