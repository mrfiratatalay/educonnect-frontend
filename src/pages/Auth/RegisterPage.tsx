import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Alert, Button, Col, Flex, Form, Input, Row, Select } from "antd";
import { getApiErrorMessage, getUniversities, register as registerRequest } from "@/features/auth/api";
import { AuthPageFooter, AuthPageIntro } from "@/pages/Auth/AuthPageParts";
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
      navigate("/");
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <Flex vertical gap={32}>
      <AuthPageIntro
        title="Hesap Olustur"
        description="Temel bilgilerinizi ekleyin, universitenizi secin ve topluluk akisina hemen katilin."
      />

      <Form
        layout="vertical"
        requiredMark={false}
        size="large"
        onFinish={handleSubmit(onSubmit)}
      >
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
          validateStatus={errors.email ? "error" : undefined}
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
                    showSearch={{ optionFilterProp: "label" }}
                    placeholder="Universite seciniz"
                    loading={isUniversitiesLoading}
                    options={universityOptions}
                    notFoundContent={
                      isUniversitiesLoading ? "Yukleniyor..." : "Sonuc bulunamadi"
                    }
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
                placeholder="Sinif seciniz"
                options={yearOptions}
                status={errors.year ? "error" : undefined}
                value={field.value || undefined}
                onChange={(value) => field.onChange(value ?? "")}
              />
            )}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Sifre"
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
                    placeholder="********"
                    status={errors.confirmPassword ? "error" : undefined}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        {submitError && (
          <Alert
            type="error"
            showIcon
            title={submitError}
            style={{ marginBottom: 24 }}
          />
        )}

        <Button type="primary" htmlType="submit" block loading={isSubmitting} size="large">
          {isSubmitting ? "Kayit yapiliyor..." : "Kayit Ol"}
        </Button>
      </Form>

      <AuthPageFooter prompt="Zaten hesabiniz var mi?" to="/login" linkText="Giris Yap" />
    </Flex>
  );
}
