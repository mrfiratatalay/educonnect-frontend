import { Card, Descriptions, theme } from "antd";

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
  const { token } = theme.useToken();
  const items = [
    { label: "Ad Soyad", children: profile.fullName },
    { label: "Universite", children: profile.universityName || "Belirtilmedi" },
    { label: "Bolum", children: profile.department || "Belirtilmedi" },
    {
      label: "Sinif",
      children: profile.year ? `${profile.year}. sinif` : "Belirtilmedi",
    },
  ];

  if (isOwnProfile && profile.email) {
    items.push({ label: "E-posta", children: profile.email });
  }

  return (
    <Card 
      title="Profil Detaylari"
      bordered={false}
      style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Descriptions 
        layout="vertical" 
        column={{ xs: 1, sm: 2 }} 
        items={items} 
        labelStyle={{ color: token.colorTextSecondary, fontSize: 13, paddingBottom: 4 }}
        contentStyle={{ fontSize: 15, fontWeight: 500, paddingBottom: 16 }}
      />
    </Card>
  );
}
