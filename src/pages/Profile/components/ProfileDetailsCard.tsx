import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileDetailsCardProps {
  profile: {
    fullName: string;
    universityName?: string;
    department?: string;
    year?: number;
    email?: string;
  };
  isOwnProfile: boolean;
}

export default function ProfileDetailsCard({
  profile,
  isOwnProfile,
}: ProfileDetailsCardProps) {
  const rows = [
    { label: "Ad Soyad", value: profile.fullName },
    { label: "Universite", value: profile.universityName || "Belirtilmedi" },
    { label: "Bolum", value: profile.department || "Belirtilmedi" },
    {
      label: "Sinif",
      value: profile.year ? `${profile.year}. sinif` : "Belirtilmedi",
    },
  ];

  if (isOwnProfile && profile.email) {
    rows.push({ label: "E-posta", value: profile.email });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Profil Detaylari</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm"
          >
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
