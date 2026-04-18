import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Alert, Button, Flex, Input, Select } from "antd";
import { getApiErrorMessage, getUniversities, register as registerRequest } from "@/features/auth/api";
import {
  AuthPageFooter,
  AuthPageIntro,
  AuthStepLabel,
  FieldWrapper,
  authAlertStyle,
  authInputStyle,
  authPrimaryButtonStyle,
  authSecondaryButtonStyle,
  authSelectStyle,
  authWarningAlertStyle,
} from "./AuthPageParts";

const normalizeStringInput = (value: unknown) => (typeof value === "string" ? value : "");
const getSelectValue = (value: unknown) => {
  const normalizedValue = normalizeStringInput(value);
  return normalizedValue.length > 0 ? normalizedValue : undefined;
};

const registerSchema = z
  .object({
    fullName: z.preprocess(
      normalizeStringInput,
      z.string().trim().min(3, "Ad soyad en az 3 karakter olmali"),
    ),
    email: z.preprocess(
      normalizeStringInput,
      z.string().trim().email("Gecerli bir e-posta adresi girin"),
    ),
    universityId: z.preprocess(
      normalizeStringInput,
      z.string().min(1, "Üniversite secin"),
    ),
    department: z.preprocess(
      normalizeStringInput,
      z.string().trim().min(2, "Bölüm en az 2 karakter olmali"),
    ),
    year: z.preprocess(
      normalizeStringInput,
      z.string().min(1, "Sinif secin"),
    ),
    password: z.preprocess(
      normalizeStringInput,
      z.string().min(8, "Şifre en az 8 karakter olmali"),
    ),
    confirmPassword: z.preprocess(normalizeStringInput, z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eslesmiyor",
    path: ["confirmPassword"],
  });

type RegisterFormInput = z.input<typeof registerSchema>;
type RegisterForm = z.output<typeof registerSchema>;

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
  } = useForm<RegisterFormInput, unknown, RegisterForm>({
    resolver: zodResolver(registerSchema),
    shouldUnregister: false,
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

  const handleInvalidSubmit = (formErrors: FieldErrors<RegisterFormInput>) => {
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

    setSubmitError("Devam etmeden once tüm zorunlu alanlari doldurun.");
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
        label={currentStep === 0 ? "Temel bilgiler" : "Profil ve şifre"}
      />

      <AuthPageIntro
        title="Hesap oluştur"
        description={
          currentStep === 0
            ? "Adini ve üniversiteye ait kurumsal e-posta adresini gir. Sonraki adimda profilini ve şifreni tamamlayacaksin."
            : "Üniversiteni ekle, profilini tamamla ve hesabın için şifre belirle. Kayıt sonrasi doğrulama kodu e-posta adresine gönderilecek."
        }
      />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submitRegistration(event);
        }}
      >
        <Flex
          vertical
          style={{ display: currentStep === 0 ? undefined : "none" }}
          aria-hidden={currentStep !== 0}
        >
          <FieldWrapper error={errors.fullName?.message}>
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  value={normalizeStringInput(field.value)}
                  onChange={(e) => field.onChange(e.target?.value ?? "")}
                  autoFocus
                  allowClear
                  autoComplete="name"
                  placeholder="Ad soyad"
                  size="large"
                  status={errors.fullName ? "error" : undefined}
                  style={authInputStyle}
                  maxLength={50}
                />
              )}
            />
          </FieldWrapper>

          <FieldWrapper error={errors.email?.message}>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  value={normalizeStringInput(field.value)}
                  onChange={(e) => field.onChange(e.target?.value ?? "")}
                  allowClear
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="E-posta"
                  size="large"
                  status={errors.email ? "error" : undefined}
                  style={authInputStyle}
                />
              )}
            />
          </FieldWrapper>
        </Flex>

        <Flex
          vertical
          style={{ display: currentStep === 1 ? undefined : "none" }}
          aria-hidden={currentStep !== 1}
        >
          <FieldWrapper error={errors.universityId?.message}>
            <Controller
              name="universityId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  allowClear
                  loading={isUniversitiesLoading}
                  notFoundContent={isUniversitiesLoading ? "Yükleniyor..." : "Sonuc bulunamadi"}
                  options={universityOptions}
                  placeholder="Üniversite sec"
                  showSearch={{ optionFilterProp: "label" }}
                  size="large"
                  status={errors.universityId ? "error" : undefined}
                  value={getSelectValue(field.value)}
                  onChange={(value) => field.onChange(value ?? "")}
                  getPopupContainer={(node) => node.parentElement ?? node}
                  style={authSelectStyle}
                />
              )}
            />
          </FieldWrapper>

          <FieldWrapper error={errors.department?.message}>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  value={normalizeStringInput(field.value)}
                  onChange={(e) => field.onChange(e.target?.value ?? "")}
                  allowClear
                  autoComplete="organization-title"
                  placeholder="Bölüm"
                  size="large"
                  status={errors.department ? "error" : undefined}
                  style={authInputStyle}
                />
              )}
            />
          </FieldWrapper>

          {isUniversitiesError ? (
            <Alert
              type="warning"
              showIcon
              title="Üniversiteler yüklenemedi."
              description="Sayfayi yenileyip yeniden deneyin."
              style={{ ...authWarningAlertStyle, marginBottom: 18 }}
            />
          ) : null}

          <FieldWrapper error={errors.year?.message}>
            <Controller
              name="year"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  {...field}
                  options={yearOptions}
                  placeholder="Sinif sec"
                  size="large"
                  status={errors.year ? "error" : undefined}
                  value={getSelectValue(field.value)}
                  onChange={(value) => field.onChange(value ?? "")}
                  getPopupContainer={(node) => node.parentElement ?? node}
                  style={authSelectStyle}
                />
              )}
            />
          </FieldWrapper>

          <FieldWrapper error={errors.password?.message}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input.Password
                  {...field}
                  value={normalizeStringInput(field.value)}
                  onChange={(e) => field.onChange(e.target?.value ?? "")}
                  autoComplete="new-password"
                  placeholder="Şifre"
                  size="large"
                  status={errors.password ? "error" : undefined}
                  style={authInputStyle}
                />
              )}
            />
          </FieldWrapper>

          <FieldWrapper error={errors.confirmPassword?.message}>
            <Controller
              name="confirmPassword"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input.Password
                  {...field}
                  value={normalizeStringInput(field.value)}
                  onChange={(e) => field.onChange(e.target?.value ?? "")}
                  autoComplete="new-password"
                  placeholder="Şifreyi tekrar gir"
                  size="large"
                  status={errors.confirmPassword ? "error" : undefined}
                  style={authInputStyle}
                />
              )}
            />
          </FieldWrapper>
        </Flex>

        {submitError ? (
          <Alert
            type="error"
            showIcon
            title={submitError}
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
              htmlType="submit"
              block
              size="large"
              loading={isSubmitting}
              style={authPrimaryButtonStyle}
            >
              {isSubmitting ? "Hesap oluşturuluyor..." : "Hesabi oluştur"}
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
      </form>

      <AuthPageFooter
        prompt="Zaten bir hesabın var mi?"
        linkText="Giriş yap"
        onClick={() => navigate("/login")}
      />
    </Flex>
  );
}
