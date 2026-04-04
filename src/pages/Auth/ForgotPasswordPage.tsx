import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  forgotPassword,
  getApiErrorMessage,
} from "@/features/auth/api";

const schema = z.object({
  email: z.string().email("Gecerli bir e-posta adresi giriniz"),
});

type ForgotForm = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
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
    <div>
      <div className="flex items-center gap-2 mb-8 lg:hidden">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-2xl font-bold">
          Edu<span className="text-primary">Connect</span>
        </span>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold">E-posta Gonderildi</h1>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Eger hesap mevcutsa sifre sifirlama adimlari e-posta adresinize
            gonderilecektir.
          </p>
          <Link to="/login">
            <Button variant="outline" className="gap-2 mt-2">
              <ArrowLeft className="w-4 h-4" />
              Giris Sayfasina Don
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Sifremi Unuttum</h1>
            <p className="text-muted-foreground">
              E-posta adresinizi girin, size sifre sifirlama akisini baslatalim.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@universite.edu.tr"
                  className="pl-9"
                  autoComplete="email"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Gonderiliyor..." : "Sifirlama Baglantisi Gonder"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link to="/login" className="text-primary font-medium hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Giris sayfasina don
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
