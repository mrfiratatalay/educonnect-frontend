import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, Button, Flex, Input } from "antd";
import { ArrowLeft } from "lucide-react";
import { forgotPassword, getApiErrorMessage } from "@/features/auth/api";
import {
  AuthPageFooter,
  AuthPageIntro,
  FieldWrapper,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSuccessAlertStyle,
} from "./AuthPageParts";

const schema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi girin"),
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
    <Flex vertical style={{ width: "100%", maxWidth: 380 }}>
      {sent ? (
        <>
          <AuthPageIntro
            eyebrow="E-posta gönderildi"
            title="Baglanti hazır"
            description="Hesap varsa şifre sifirlama adimlarini e-posta adresine gönderdik. Gelen kutunu ve spam klasorunu kontrol et."
          />

          <Alert
            type="success"
            showIcon
            title="Talep oluşturuldu"
            description="Ayni adresle tekrar denemek istersen birkaç dakika beklemen yeterli."
            style={{ ...authSuccessAlertStyle, marginBottom: 24 }}
          />

          <Button
            type="primary"
            block
            size="large"
            onClick={() => navigate("/login", { replace: true })}
            icon={<ArrowLeft size={16} />}
            style={authPrimaryButtonStyle}
          >
            Giriş sayfasına don
          </Button>
        </>
      ) : (
        <>
          <AuthPageIntro
            eyebrow="Hesap erisimi"
            title="Şifreni sifirla"
            description="Kayıtlı e-posta adresini gir. Şifre sifirlama baglantisini oraya gönderelim."
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

            {submitError ? (
              <Alert
                type="error"
                showIcon
                title={submitError}
                style={{ ...authAlertStyle, marginBottom: 20 }}
              />
            ) : null}

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              style={authPrimaryButtonStyle}
            >
              {isSubmitting ? "Gönderiliyor..." : "Sifirlama baglantisi gönder"}
            </Button>
          </form>

          <AuthPageFooter
            prompt="Şifreni hatirladiysan"
            linkText="giriş yap"
            onClick={() => navigate("/login", { replace: true })}
          />
        </>
      )}
    </Flex>
  );
}
