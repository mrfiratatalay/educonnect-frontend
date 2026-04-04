import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getApiErrorMessage,
  getUniversities,
  register as registerRequest,
} from "@/features/auth/api";
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

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    data: universities = [],
    isLoading: isUniversitiesLoading,
    isError: isUniversitiesError,
  } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversities,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

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
    <div>
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold">
          Edu<span className="text-primary">Connect</span>
        </span>
      </div>

      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Hesap Olustur</h1>
        <p className="text-muted-foreground">
          Sadece gerekli alanlari doldurup kayit olabilirsiniz
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input
            id="fullName"
            placeholder="Adiniz Soyadiniz"
            autoComplete="name"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input
            id="email"
            type="email"
            placeholder="ornek@universite.edu.tr"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="universityId">Universite</Label>
            <select
              id="universityId"
              disabled={isUniversitiesLoading}
              {...register("universityId")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {isUniversitiesLoading ? "Yukleniyor..." : "Seciniz"}
              </option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
            {errors.universityId && (
              <p className="text-sm text-destructive">
                {errors.universityId.message}
              </p>
            )}
            {isUniversitiesError && (
              <p className="text-sm text-destructive">
                Universiteler yuklenemedi.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Bolum</Label>
            <Input
              id="department"
              placeholder="Bilgisayar Muhendisligi"
              {...register("department")}
            />
            {errors.department && (
              <p className="text-sm text-destructive">{errors.department.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Sinif</Label>
          <select
            id="year"
            {...register("year")}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Seciniz</option>
            <option value="1">1. Sinif</option>
            <option value="2">2. Sinif</option>
            <option value="3">3. Sinif</option>
            <option value="4">4. Sinif</option>
            <option value="5">5. Sinif+</option>
          </select>
          {errors.year && (
            <p className="text-sm text-destructive">{errors.year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Sifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              autoComplete="new-password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Sifre Tekrar</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Kayit yapiliyor..." : "Kayit Ol"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Zaten hesabiniz var mi?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Giris Yap
        </Link>
      </p>
    </div>
  );
}
