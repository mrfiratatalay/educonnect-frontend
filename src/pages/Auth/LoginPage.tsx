import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getApiErrorMessage, login as loginRequest } from "@/features/auth/api";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
  password: z.string().min(8, "Sifre en az 8 karakter olmali"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setSubmitError(null);

    try {
      const session = await loginRequest(data);
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
        <h1 className="text-2xl font-bold tracking-tight">Hos Geldiniz</h1>
        <p className="text-muted-foreground">
          Hesabiniza giris yaparak devam edin
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Sifre</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Sifremi Unuttum
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              autoComplete="current-password"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Giris yapiliyor..." : "Giris Yap"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Hesabiniz yok mu?{" "}
        <Link to="/register" className="text-primary font-medium hover:underline">
          Kayit Ol
        </Link>
      </p>
    </div>
  );
}
