import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Result, Typography } from "antd";
import { ArrowLeft } from "lucide-react";
import { forgotPassword, getApiErrorMessage } from "@/features/auth/api";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotForm) => {
    setSubmitError(null);

    try {
      await forgotPassword(data);
      setSent(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 364 }}>
      {sent ? (
        <Result
          status="success"
          title="E-posta Gönderildi"
          subTitle="Eğer hesap mevcutsa şifre sıfırlama adımları e-posta adresinize gönderilecektir."
          extra={
            <Button
              onClick={() => navigate("/login", { replace: true })}
              icon={<ArrowLeft size={16} />}
              style={{
                height: 44,
                borderRadius: 9999,
                fontWeight: 700,
                background: "#FFFFFF",
                color: "#0F1419",
                border: "none",
              }}
            >
              Giriş sayfasına dön
            </Button>
          }
        />
      ) : (
        <>
          <Typography.Title
            level={2}
            style={{
              color: "#E7E9EA",
              fontSize: 31,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: "0 0 12px 0",
            }}
          >
            Şifreni sıfırla
          </Typography.Title>

          <Typography.Text
            style={{ color: "#71767B", fontSize: 15, marginBottom: 28, display: "block" }}
          >
            Kayıtlı e-posta adresini gir, şifre sıfırlama bağlantısını gönderelim.
          </Typography.Text>

          <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
            <Form.Item
              validateStatus={errors.email ? "error" : undefined}
              help={errors.email?.message}
              style={{ marginBottom: 24 }}
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
                    placeholder="E-posta adresi"
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
                marginBottom: 16,
              }}
            >
              {isSubmitting ? "Gönderiliyor..." : "Sıfırlama bağlantısı gönder"}
            </Button>
          </Form>

          <Typography.Paragraph
            style={{
              marginTop: 24,
              marginBottom: 0,
              color: "#71767B",
              fontSize: 15,
              textAlign: "center",
            }}
          >
            <Typography.Link
              onClick={() => navigate("/login", { replace: true })}
              style={{
                color: "#1D9BF0",
                fontWeight: 400,
                fontSize: 15,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <ArrowLeft size={14} />
              Giriş sayfasına dön
            </Typography.Link>
          </Typography.Paragraph>
        </>
      )}
    </Flex>
  );
}
