import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Alert, Button, Flex, Form, Input, Select } from "antd";
import { getApiErrorMessage, getUniversities, register as registerRequest } from "@/features/auth/api";
import {
  AuthPageFooter,
  AuthPageIntro,
  AuthStepLabel,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
  authSelectStyle,
  authWarningAlertStyle,
} from "./AuthPageParts";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali"),
    email: z.string().email("Gecerli bir e-posta adresi girin"),
    universityId: z.string().min(1, "Universite secin"),
    department: z.string().min(2, "Bolum en az 2 karakter olmali"),
    year: z.string().min(1, "Sinif secin"),
    password: z.string().min(8, "Sifre en az 8 karakter olmali"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sifreler eslesmiyor",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const stepOneFields = ["fullName", "email"] as const;
const stepTwoFields = [
  "universityId",
  "department",
  "year",
  "password",
  "confirmPassword",
] as const;

const yearOptions = [
  { value: "1", label: "1. Sinif" },
  { value: "2", label: "2. Sinif" },
  { value: "3", label: "3. Sinif" },
  { value: "4", label: "4. Sinif" },
  { value: "5", label: "5. Sinif+" },
];

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const {
    data: universities = [],
    isLoading: isUniversitiesLoading,
    isError: isUniversitiesError,
  } = useQuery({ queryKey: ["universities"], queryFn: getUniversities });

  const {
    control,
    handleSubmit,
    setFocus,
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
      const challenge = await registerRequest({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        universityId: data.universityId,
        department: data.department,
        year: Number(data.year),
      });

      navigate(`/verify-email?email=${encodeURIComponent(challenge.email)}`, {
        replace: true,
        state: { message: challenge.message },
      });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  const handleInvalidSubmit = (formErrors: FieldErrors<RegisterForm>) => {
    const firstStepInvalidField = stepOneFields.find((field) => formErrors[field]);
    const secondStepInvalidField = stepTwoFields.find((field) => formErrors[field]);
    const firstInvalidField = firstStepInvalidField ?? secondStepInvalidField;

    if (firstStepInvalidField) {
      setCurrentStep(0);
    } else if (secondStepInvalidField) {
      setCurrentStep(1);
    }

    if (firstInvalidField) {
      window.setTimeout(() => {
        setFocus(firstInvalidField);
      }, 0);
    }

    setSubmitError("Devam etmeden once tum zorunlu alanlari doldurun.");
  };

  const submitRegistration = handleSubmit(onSubmit, handleInvalidSubmit);

  const handleContinue = async () => {
    setSubmitError(null);

    const isValid = await trigger(stepOneFields, {
      shouldFocus: true,
    });

    if (isValid) {
      setCurrentStep(1);
    }
  };

  return (
    <Flex vertical style={{ width: "100%", maxWidth: 420 }}>
      <AuthStepLabel
        current={currentStep + 1}
        total={2}
        label={currentStep === 0 ? "Temel bilgiler" : "Profil ve sifre"}
      />

      <AuthPageIntro
        title="Hesap olustur"
        description={
          currentStep === 0
            ? "Adini ve universiteye ait kurumsal e-posta adresini gir. Sonraki adimda profilini ve sifreni tamamlayacaksin."
            : "Universiteni ekle, profilini tamamla ve hesabin icin sifre belirle. Kayit sonrasi dogrulama kodu e-posta adresine gonderilecek."
        }
      />

      <Form
        layout="vertical"
        size="large"
        onSubmitCapture={(event) => {
          event.preventDefault();
          void submitRegistration(event);
        }}
      >
        {currentStep === 0 ? (
          <Flex vertical>
            <Form.Item
              validateStatus={errors.fullName ? "error" : undefined}
              help={errors.fullName?.message}
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
                    placeholder="Ad soyad"
                    status={errors.fullName ? "error" : undefined}
                    style={authInputStyle}
                    maxLength={50}
                  />
                )}
              />
            </Form.Item>

            <Form.Item validateStatus={errors.email ? "error" : undefined} help={errors.email?.message}>
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
                    style={authInputStyle}
                  />
                )}
              />
            </Form.Item>
          </Flex>
        ) : (
          <Flex vertical>
            <Form.Item
              validateStatus={errors.universityId ? "error" : undefined}
              help={errors.universityId?.message}
            >
              <Controller
                name="universityId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    allowClear
                    loading={isUniversitiesLoading}
                    notFoundContent={isUniversitiesLoading ? "Yukleniyor..." : "Sonuc bulunamadi"}
                    options={universityOptions}
                    placeholder="Universite sec"
                    showSearch={{ optionFilterProp: "label" }}
                    status={errors.universityId ? "error" : undefined}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
                    getPopupContainer={(node) => node.parentElement ?? node}
                    style={authSelectStyle}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.department ? "error" : undefined}
              help={errors.department?.message}
            >
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    allowClear
                    autoComplete="organization-title"
                    placeholder="Bolum"
                    status={errors.department ? "error" : undefined}
                    style={authInputStyle}
                  />
                )}
              />
            </Form.Item>

            {isUniversitiesError ? (
              <Alert
                type="warning"
                showIcon
                message="Universiteler yuklenemedi."
                description="Sayfayi yenileyip yeniden deneyin."
                style={{ ...authWarningAlertStyle, marginBottom: 18 }}
              />
            ) : null}

            <Form.Item validateStatus={errors.year ? "error" : undefined} help={errors.year?.message}>
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yearOptions}
                    placeholder="Sinif sec"
                    status={errors.year ? "error" : undefined}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
                    getPopupContainer={(node) => node.parentElement ?? node}
                    style={authSelectStyle}
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
                    autoComplete="new-password"
                    placeholder="Sifre"
                    status={errors.password ? "error" : undefined}
                    style={authInputStyle}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              validateStatus={errors.confirmPassword ? "error" : undefined}
              help={errors.confirmPassword?.message}
            >
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    placeholder="Sifreyi tekrar gir"
                    status={errors.confirmPassword ? "error" : undefined}
                    style={authInputStyle}
                  />
                )}
              />
            </Form.Item>
          </Flex>
        )}

        {submitError ? (
          <Alert
            type="error"
            showIcon
            message={submitError}
            style={{ ...authAlertStyle, marginBottom: 20 }}
          />
        ) : null}

        {currentStep === 0 ? (
          <Button
            type="primary"
            htmlType="button"
            block
            size="large"
            onClick={handleContinue}
            style={authPrimaryButtonStyle}
          >
            Devam et
          </Button>
        ) : (
          <Flex vertical gap={12}>
            <Button
              type="primary"
              htmlType="button"
              block
              size="large"
              loading={isSubmitting}
              onClick={() => {
                void submitRegistration();
              }}
              style={authPrimaryButtonStyle}
            >
              {isSubmitting ? "Hesap olusturuluyor..." : "Hesabi olustur"}
            </Button>

            <Button
              block
              size="large"
              onClick={() => setCurrentStep(0)}
              style={authSecondaryButtonStyle}
            >
              Geri
            </Button>
          </Flex>
        )}
      </Form>

      <AuthPageFooter
        prompt="Zaten bir hesabin var mi?"
        linkText="Giris yap"
        onClick={() => navigate("/login")}
      />
    </Flex>
  );
}
