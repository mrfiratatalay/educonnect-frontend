import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  Alert,
  Button,
  Col,
  Flex,
  Form,
  Grid,
  Input,
  Row,
  Select,
  Steps,
  Typography,
} from "antd";
import { getApiErrorMessage, getUniversities, register as registerRequest } from "@/features/auth/api";
import { AuthPageIntro } from "@/pages/Auth/AuthPageParts";
import { useAuthStore } from "@/store/authStore";

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali"),
    email: z.string().email("Gecerli bir e-posta adresi giriniz"),
    universityId: z.string().min(1, "Universite seciniz"),
    department: z.string().min(2, "Bolum en az 2 karakter olmali"),
    year: z.string().min(1, "Sinif seciniz"),
    password: z.string().min(8, "Sifre en az 8 karakter olmali"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Sifreler eslesmiyor",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

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
  const setSession = useAuthStore((state) => state.setSession);
  const screens = Grid.useBreakpoint();

  const {
    data: universities = [],
    isLoading: isUniversitiesLoading,
    isError: isUniversitiesError,
  } = useQuery({ queryKey: ["universities"], queryFn: getUniversities });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
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

  const wEmail = watch("email");
  const wPassword = watch("password");
  const wConfirm = watch("confirmPassword");

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
      navigate("/");
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
    <Flex vertical gap={28}>
      <AuthPageIntro
        title="Hesap Olustur"
        description="Hesap bilgilerinizi ve ogrenci profilinizi iki kisa adimda tamamlayin."
      />

      <Steps
        current={currentStep}
        progressDot
        items={[
          { title: "Hesap" },
          { title: "Akademik" },
        ]}
        orientation={screens.xs ? "vertical" : "horizontal"}
        size="small"
      />

      <Form layout="vertical" size="large" onFinish={handleSubmit(onSubmit)}>
        {currentStep === 0 ? (
          <Flex vertical gap={4}>
            <Form.Item
              label="Ad Soyad"
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
                    placeholder="Adiniz Soyadiniz"
                    status={errors.fullName ? "error" : undefined}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="E-posta"
              hasFeedback={!!wEmail}
              validateStatus={errors.email ? "error" : wEmail ? "success" : undefined}
              help={errors.email?.message}
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
                    placeholder="ornek@universite.edu.tr"
                    status={errors.email ? "error" : undefined}
                  />
                )}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Sifre"
                  hasFeedback={!!wPassword}
                  validateStatus={errors.password ? "error" : wPassword ? "success" : undefined}
                  help={errors.password?.message}
                >
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        autoComplete="new-password"
                        placeholder="********"
                        status={errors.password ? "error" : undefined}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Sifre Tekrar"
                  hasFeedback={!!wConfirm}
                  validateStatus={errors.confirmPassword ? "error" : wConfirm ? "success" : undefined}
                  help={errors.confirmPassword?.message}
                >
                  <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                      <Input.Password
                        {...field}
                        autoComplete="new-password"
                        placeholder="********"
                        status={errors.confirmPassword ? "error" : undefined}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Flex>
        ) : (
          <Flex vertical gap={4}>
            <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>
              Universite, bolum ve sinif bilgileriniz ogrenci profilinizin olusturulmasi icin
              gereklidir.
            </Typography.Paragraph>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Universite"
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
                        notFoundContent={
                          isUniversitiesLoading ? "Yukleniyor..." : "Sonuc bulunamadi"
                        }
                        optionFilterProp="label"
                        options={universityOptions}
                        placeholder="Universite seciniz"
                        showSearch
                        status={errors.universityId ? "error" : undefined}
                        value={field.value || undefined}
                        onChange={(value) => field.onChange(value ?? "")}
                      />
                    )}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Bolum"
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
                        placeholder="Bilgisayar Muhendisligi"
                        status={errors.department ? "error" : undefined}
                      />
                    )}
                  />
                </Form.Item>
              </Col>
            </Row>

            {isUniversitiesError && (
              <Alert
                type="warning"
                showIcon
                title="Universiteler yuklenemedi."
                description="Liste tekrar alinamadi. Sayfayi yenileyip yeniden deneyin."
                style={{ marginBottom: 24 }}
              />
            )}

            <Form.Item
              label="Sinif"
              validateStatus={errors.year ? "error" : undefined}
              help={errors.year?.message}
            >
              <Controller
                name="year"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={yearOptions}
                    placeholder="Sinif seciniz"
                    status={errors.year ? "error" : undefined}
                    value={field.value || undefined}
                    onChange={(value) => field.onChange(value ?? "")}
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
            title={submitError}
            style={{ marginBottom: 24 }}
          />
        )}

        {currentStep === 0 ? (
          <Button block onClick={handleContinue} type="primary">
            Devam Et
          </Button>
        ) : (
          <Flex gap={12}>
            <Button block htmlType="button" onClick={() => setCurrentStep(0)}>
              Geri
            </Button>
            <Button type="primary" htmlType="submit" block loading={isSubmitting}>
              {isSubmitting ? "Kayit yapiliyor..." : "Kayit Ol"}
            </Button>
          </Flex>
        )}
      </Form>
    </Flex>
  );
}
