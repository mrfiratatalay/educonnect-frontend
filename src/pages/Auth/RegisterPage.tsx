import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { mockUser } from "@/data/mock";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Ad soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    university: z.string().min(1, "Üniversite seçiniz"),
    department: z.string().min(1, "Bölüm giriniz"),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

const universities = [
  "Recep Tayyip Erdoğan Üniversitesi",
  "Karadeniz Teknik Üniversitesi",
  "Trabzon Üniversitesi",
  "Artvin Çoruh Üniversitesi",
  "Giresun Üniversitesi",
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await new Promise((r) => setTimeout(r, 800));
    login(
      { ...mockUser, fullName: data.fullName, email: data.email, department: data.department },
      "mock-jwt-token",
    );
    navigate("/");
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
        <h1 className="text-2xl font-bold tracking-tight">Hesap Oluştur</h1>
        <p className="text-muted-foreground">
          EduConnect'e katılarak kampüs hayatını keşfet
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Ad Soyad</Label>
          <Input id="fullName" placeholder="Adınız Soyadınız" {...register("fullName")} />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-posta</Label>
          <Input id="email" type="email" placeholder="ornek@erdogan.edu.tr" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="university">Üniversite</Label>
            <select
              id="university"
              {...register("university")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Seçiniz</option>
              {universities.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {errors.university && <p className="text-sm text-destructive">{errors.university.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Bölüm</Label>
            <Input id="department" placeholder="Bilgisayar Müh." {...register("department")} />
            {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Şifre</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Kayıt yapılıyor..." : "Kayıt Ol"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Zaten hesabınız var mı?{" "}
        <Link to="/login" className="text-primary font-medium hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}
