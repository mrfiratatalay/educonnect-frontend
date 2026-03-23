import { useState, useEffect } from "react";
import { User, Bell, Shield, Palette, LogOut, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuthStore();
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [year, setYear] = useState(String(user?.year || ""));
  const [bio, setBio] = useState(user?.bio || "");

  useEffect(() => {
    const saved = localStorage.getItem("educonnect-dark-mode");
    if (saved === "true") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

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

  const handleSaveProfile = () => {
    updateUser({
      fullName,
      email,
      department,
      year: parseInt(year, 10) || undefined,
      bio,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8 space-y-6">
      <h1 className="text-2xl lg:text-3xl font-bold">Ayarlar</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="w-5 h-5" />
            Profil Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Ad Soyad</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>E-posta</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
            <div className="space-y-2">
              <Label>Bölüm</Label>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Sınıf</Label>
              <Input value={year} onChange={(e) => setYear(e.target.value)} type="number" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Biyografi</Label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <Button size="sm" onClick={handleSaveProfile} className="gap-1.5">
            {profileSaved ? (
              <>
                <Check className="w-4 h-4" />
                Kaydedildi!
              </>
            ) : (
              "Değişiklikleri Kaydet"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="w-5 h-5" />
            Bildirim Tercihleri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Etkinlik hatırlatmaları", defaultChecked: true },
            { label: "Yeni indirimler", defaultChecked: true },
            { label: "Gönderi beğenileri ve yorumları", defaultChecked: true },
            { label: "Grup davetiyeleri", defaultChecked: false },
            { label: "Sistem güncellemeleri", defaultChecked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-9 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Palette className="w-5 h-5" />
            Görünüm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Karanlık Mod</p>
              <p className="text-xs text-muted-foreground">
                Arayüzü karanlık temaya geçir
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} className="sr-only peer" />
              <div className="w-9 h-5 bg-muted peer-focus:ring-2 peer-focus:ring-ring rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="w-5 h-5" />
            Güvenlik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Mevcut Şifre</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Yeni Şifre</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label>Yeni Şifre Tekrar</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button size="sm" variant="outline" onClick={handleChangePassword} className="gap-1.5">
            {passwordSaved ? (
              <>
                <Check className="w-4 h-4" />
                Şifre Değiştirildi!
              </>
            ) : (
              "Şifreyi Değiştir"
            )}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Button variant="destructive" className="gap-2" onClick={logout}>
        <LogOut className="w-4 h-4" />
        Çıkış Yap
      </Button>
    </div>
  );
}
