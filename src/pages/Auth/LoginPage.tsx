import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Input } from "antd";
import { getApiErrorMessage, login as loginRequest } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";
import {
  AuthPageFooter,
  AuthPageIntro,
  FieldWrapper,
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

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(onSubmit)(event);
        }}
        style={{ width: "100%" }}
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
                autoFocus
                allowClear
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="E-posta adresi"
                size="large"
                status={errors.email ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </FieldWrapper>

        <FieldWrapper error={errors.password?.message}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target?.value ?? "")}
                autoComplete="current-password"
                placeholder="Sifre"
                size="large"
                status={errors.password ? "error" : undefined}
                style={authInputStyle}
              />
            )}
          />
        </FieldWrapper>

        {submitError ? (
          <Alert
            type="error"
            showIcon
            title={submitError}
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
      </form>

      <AuthPageFooter
        prompt="Hesabin yok mu?"
        linkText="Kayit ol"
        onClick={() => navigate("/register")}
      />
    </Flex>
  );
}
