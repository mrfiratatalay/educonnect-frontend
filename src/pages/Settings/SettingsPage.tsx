import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Check, LogOut, Moon, Palette, Sun, User } from "lucide-react";
import { getApiErrorMessage, getUniversities } from "@/features/auth/api";
import {
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/features/users/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";

const settingsSchema = z.object({
  fullName: z.string().min(3, "Ad soyad en az 3 karakter olmali"),
  universityId: z.string().min(1, "Universite seciniz"),
  department: z.string().min(2, "Bolum en az 2 karakter olmali"),
  year: z.string().min(1, "Sinif seciniz"),
  bio: z.string().max(500, "Biyografi en fazla 500 karakter olabilir").optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-4.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const logout = useAuthStore((state) => state.logout);
  const profileQuery = useMyProfileQuery();
  const updateProfileMutation = useUpdateMyProfileMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const {
    data: universities = [],
    isLoading: isUniversitiesLoading,
  } = useQuery({
    queryKey: ["universities"],
    queryFn: getUniversities,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      fullName: "",
      universityId: "",
      department: "",
      year: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }

    reset({
      fullName: profileQuery.data.fullName,
      universityId: profileQuery.data.universityId || "",
      department: profileQuery.data.department || "",
      year: profileQuery.data.year ? String(profileQuery.data.year) : "",
      bio: profileQuery.data.bio || "",
    });
  }, [profileQuery.data, reset]);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (next) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("educonnect-dark-mode", String(next));
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    setProfileSaved(false);

    try {
      await updateProfileMutation.mutateAsync({
        fullName: data.fullName,
        universityId: data.universityId,
        department: data.department,
        year: Number(data.year),
        bio: data.bio?.trim() || undefined,
      });

      setProfileSaved(true);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  });

  if (profileQuery.isLoading) {
    return (
      <div className="p-4 lg:p-6 xl:p-8 max-w-3xl mx-auto text-sm text-muted-foreground">
        Ayarlar yukleniyor...
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="p-4 lg:p-6 xl:p-8 max-w-3xl mx-auto text-sm text-destructive">
        Profil bilgileri yuklenemedi.
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5 text-primary" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input id="fullName" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  value={profileQuery.data.email}
                  disabled
                  readOnly
                  type="email"
                />
              </div>

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
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Bolum</Label>
                <Input id="department" {...register("department")} />
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
                <option value="1">1. sinif</option>
                <option value="2">2. sinif</option>
                <option value="3">3. sinif</option>
                <option value="4">4. sinif</option>
                <option value="5">5. sinif</option>
                <option value="6">6. sinif</option>
                <option value="7">7. sinif</option>
                <option value="8">8. sinif</option>
              </select>
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <textarea
                id="bio"
                rows={4}
                {...register("bio")}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            {submitError && (
              <p className="text-sm text-destructive">{submitError}</p>
            )}

            <Button type="submit" size="sm" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending
                ? "Kaydediliyor..."
                : profileSaved
                  ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5" />
                        Kaydedildi
                      </>
                    )
                  : "Degisiklikleri Kaydet"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-5 h-5 text-primary" />
            Gorunum
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {darkMode ? "Karanlik Mod" : "Aydinlik Mod"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Tema tercihi sadece bu tarayicida saklanir.
                </p>
              </div>
            </div>
            <Toggle checked={darkMode} onChange={toggleDarkMode} />
          </div>
        </CardContent>
      </Card>

      <Button variant="destructive" className="gap-2" onClick={() => void logout()}>
        <LogOut className="w-4 h-4" />
        Cikis Yap
      </Button>
    </div>
  );
}
