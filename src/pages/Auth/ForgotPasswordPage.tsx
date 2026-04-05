import { useState } from "react";
import { Link } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Result, Typography, theme } from "antd";
import { ArrowLeft } from "lucide-react";
import { forgotPassword, getApiErrorMessage } from "@/features/auth/api";
import { AuthPageIntro } from "@/pages/Auth/AuthPageParts";

const schema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { token } = theme.useToken();

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
    <Flex vertical gap={28}>
      {sent ? (
        <Result
          status="success"
          title="E-posta Gonderildi"
          subTitle="Eger hesap mevcutsa sifre sifirlama adimlari e-posta adresinize gonderilecektir."
          extra={
            <Link to="/login">
              <Button icon={<ArrowLeft size={16} />}>Giris Sayfasina Don</Button>
            </Link>
          }
        />
      ) : (
        <>
          <AuthPageIntro
            title="Sifremi Unuttum"
            description="Kayitli e-posta adresinizi girin, sifre sifirlama akisini baslatalim."
          />

          <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
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

            {submitError && (
              <Alert
                type="error"
                showIcon
                title={submitError}
                style={{ marginBottom: 24 }}
              />
            )}

            <Button type="primary" htmlType="submit" block loading={isSubmitting} size="large">
              {isSubmitting ? "Gonderiliyor..." : "Sifirlama Baglantisi Gonder"}
            </Button>
          </Form>

          <Typography.Paragraph
            type="secondary"
            style={{
              marginBottom: 0,
              textAlign: "center",
            }}
          >
            <Link
              to="/login"
              style={{
                alignItems: "center",
                color: token.colorPrimary,
                display: "inline-flex",
                fontWeight: 600,
                gap: 6,
              }}
            >
              <ArrowLeft size={14} />
              Giris sayfasina don
            </Link>
          </Typography.Paragraph>
        </>
      )}
    </Flex>
  );
}
