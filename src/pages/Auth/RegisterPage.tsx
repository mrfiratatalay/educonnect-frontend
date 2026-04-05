import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Alert,
  Button,
  Flex,
  Form,
  Input,
  Select,
  Typography,
} from "antd";
import { getApiErrorMessage, getUniversities, register as registerRequest } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    universityId: z.string().min(1, "Üniversite seçiniz"),
    department: z.string().min(2, "Bölüm en az 2 karakter olmalı"),
    year: z.string().min(1, "Sınıf seçiniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const yearOptions = [
  { value: "1", label: "1. Sınıf" },
  { value: "2", label: "2. Sınıf" },
  { value: "3", label: "3. Sınıf" },
  { value: "4", label: "4. Sınıf" },
  { value: "5", label: "5. Sınıf+" },
];

const inputStyle = {
  height: 56,
  borderRadius: 4,
  background: "transparent",
  borderColor: "#333639",
  color: "#E7E9EA",
  fontSize: 17,
};

const selectStyle = {
  height: 56,
};

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    data: universities = [],
    isLoading: isUniversitiesLoading,
    isError: isUniversitiesError,
  } = useQuery({ queryKey: ["universities"], queryFn: getUniversities });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      universityId: "",
      department: "",
      year: "",
      password: "",
      confirmPassword: "",
    },
  });

  const universityOptions = useMemo(
    () =>
      universities.map((university) => ({
        value: university.id,
        label: `${university.name}${university.city ? ` - ${university.city}` : ""}`,
      })),
    [universities],
  );

  const onSubmit = async (data: RegisterForm) => {
    setSubmitError(null);

    try {
      const session = await registerRequest({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        universityId: data.universityId,
        department: data.department,
        year: Number(data.year),
      });

      setSession(session);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  const handleContinue = async () => {
    const isValid = await trigger(["fullName", "email", "password", "confirmPassword"], {
      shouldFocus: true,
    });

    if (isValid) {
      setCurrentStep(1);
    }
  };

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 440 }}>
      <Typography.Title
        level={2}
        style={{
          color: "#E7E9EA",
          fontSize: 31,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          margin: "0 0 8px 0",
        }}
      >
        Hesabını oluştur
      </Typography.Title>

      {/* Step indicator */}
      <Typography.Text
        style={{
          color: "#71767B",
          fontSize: 15,
          marginBottom: 24,
        }}
      >
        {currentStep === 0 ? "Adım 1/2 — Hesap bilgileri" : "Adım 2/2 — Akademik bilgiler"}
      </Typography.Text>

      <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
        {currentStep === 0 ? (
          <Flex vertical>
            <Form.Item
              validateStatus={errors.fullName ? "error" : undefined}
              help={errors.fullName?.message}
              style={{ marginBottom: 20 }}
            >
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    autoFocus
                    allowClear
                    autoComplete="name"
                    placeholder="Ad Soyad"
                    status={errors.fullName ? "error" : undefined}
                    style={inputStyle}
                    showCount
                    maxLength={50}
                  />
                )}
              />
            </Form.Item>

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
                    allowClear
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="E-posta"
                    status={errors.email ? "error" : undefined}
                    style={inputStyle}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.password ? "error" : undefined}
              help={errors.password?.message}
              style={{ marginBottom: 20 }}
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    placeholder="Şifre"
                    status={errors.password ? "error" : undefined}
                    style={inputStyle}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.confirmPassword ? "error" : undefined}
              help={errors.confirmPassword?.message}
              style={{ marginBottom: 24 }}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    placeholder="Şifre tekrar"
                    status={errors.confirmPassword ? "error" : undefined}
                    style={inputStyle}
                  />
                )}
              />
            </Form.Item>
          </Flex>
        ) : (
          <Flex vertical>
            <Typography.Text
              style={{ color: "#71767B", fontSize: 14, marginBottom: 20, lineHeight: 1.5 }}
            >
              Üniversite, bölüm ve sınıf bilgileriniz öğrenci profilinizin oluşturulması için
              gereklidir.
            </Typography.Text>

            <Form.Item
              validateStatus={errors.universityId ? "error" : undefined}
              help={errors.universityId?.message}
              style={{ marginBottom: 20 }}
            >
              <Controller
                name="universityId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear
                    loading={isUniversitiesLoading}
                    notFoundContent={
                      isUniversitiesLoading ? "Yükleniyor..." : "Sonuç bulunamadı"
                    }
                    optionFilterProp="label"
                    options={universityOptions}
                    placeholder="Üniversite seçiniz"
                    showSearch
                    status={errors.universityId ? "error" : undefined}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
                    style={selectStyle}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.department ? "error" : undefined}
              help={errors.department?.message}
              style={{ marginBottom: 20 }}
            >
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    allowClear
                    autoComplete="organization-title"
                    placeholder="Bölüm (ör. Bilgisayar Mühendisliği)"
                    status={errors.department ? "error" : undefined}
                    style={inputStyle}
                  />
                )}
              />
            </Form.Item>

            {isUniversitiesError && (
              <Alert
                type="warning"
                showIcon
                message="Üniversiteler yüklenemedi."
                description="Sayfayı yenileyip yeniden deneyin."
                style={{ marginBottom: 20 }}
              />
            )}

            <Form.Item
              validateStatus={errors.year ? "error" : undefined}
              help={errors.year?.message}
              style={{ marginBottom: 24 }}
            >
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yearOptions}
                    placeholder="Sınıf seçiniz"
                    status={errors.year ? "error" : undefined}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
                    style={selectStyle}
                  />
                )}
              />
            </Form.Item>
          </Flex>
        )}

        {submitError && (
          <Alert
            type="error"
            showIcon
            message={submitError}
            style={{ marginBottom: 24 }}
          />
        )}

        {currentStep === 0 ? (
          <Button
            block
            onClick={handleContinue}
            style={{
              height: 44,
              borderRadius: 9999,
              fontWeight: 700,
              fontSize: 15,
              background: "#FFFFFF",
              color: "#0F1419",
              border: "none",
            }}
          >
            İleri
          </Button>
        ) : (
          <Flex vertical gap={12}>
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
              }}
            >
              {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
            </Button>

            <Button
              block
              onClick={() => setCurrentStep(0)}
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
              Geri
            </Button>
          </Flex>
        )}
      </Form>

      <Typography.Paragraph
        style={{
          marginTop: 32,
          marginBottom: 0,
          color: "#71767B",
          fontSize: 15,
        }}
      >
        Zaten hesabın var mı?{" "}
        <Typography.Link
          onClick={() => navigate("/login")}
          style={{
            color: "#1D9BF0",
            fontWeight: 400,
            fontSize: 15,
          }}
        >
          Giriş yap
        </Typography.Link>
      </Typography.Paragraph>
    </Flex>
  );
}
