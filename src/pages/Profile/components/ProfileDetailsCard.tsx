import { Card, Grid, Typography, theme } from "antd";
import type { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  student: "Ogrenci",
  admin: "Yonetici",
  moderator: "Moderator",
};

interface ProfileDetailsCardProps {
  profile: {
    role: UserRole;
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
  const screens = Grid.useBreakpoint();

  const items = [
    { label: "Rol", value: roleLabels[profile.role] },
    { label: "Universite", value: profile.universityName || "Belirtilmedi" },
    { label: "Bolum", value: profile.department || "Belirtilmedi" },
    {
      label: "Sinif",
      value: profile.year ? `${profile.year}. sinif` : "Belirtilmedi",
    },
  ];

  if (isOwnProfile && profile.email) {
    items.push({ label: "E-posta", value: profile.email });
  }

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 20,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: "none",
      }}
      styles={{ body: { padding: 0 } }}
    >
      <div
        style={{
          padding: "18px 20px",
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Typography.Title level={5} style={{ margin: 0, fontWeight: 800 }}>
          Profil bilgileri
        </Typography.Title>
      </div>

      <div
        style={{
          padding: 16,
          display: "grid",
          gridTemplateColumns: screens.sm ? "repeat(2, minmax(0, 1fr))" : "1fr",
          gap: 12,
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              padding: "14px 16px",
              borderRadius: 16,
              background: token.colorFillAlter,
              border: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Typography.Text
              type="secondary"
              style={{ display: "block", marginBottom: 6, fontSize: 12 }}
            >
              {item.label}
            </Typography.Text>
            <Typography.Text strong style={{ fontSize: 14 }}>
              {item.value}
            </Typography.Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
