import { Link } from "react-router-dom";
import { Building2, Edit2, GraduationCap, Mail } from "lucide-react";
import { Avatar, Button, Card, Flex, Tag, Typography, theme, Badge, Statistic, Divider, Progress } from "antd";
import type { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  student: "Ogrenci",
  admin: "Yonetici",
  moderator: "Moderator",
};

interface ProfileSummaryCardProps {
  profile: {
    fullName: string;
    role: UserRole;
    avatarUrl?: string;
    bio?: string;
    universityName?: string;
    department?: string;
    year?: number;
    email?: string;
  };
  isOwnProfile: boolean;
}

export default function ProfileSummaryCard({
  profile,
  isOwnProfile,
}: ProfileSummaryCardProps) {
  const { token } = theme.useToken();

  return (
    <Card styles={{ body: { padding: 0 } }}>
      <div
        style={{
          height: 140,
          background: `linear-gradient(135deg, ${token.colorPrimary}E6, ${token.colorInfo}CC), repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)`,
          borderRadius: `${token.borderRadiusLG * 1.5}px ${token.borderRadiusLG * 1.5}px 0 0`,
        }}
      />
      <div style={{ padding: "0 24px 24px" }}>
        <Flex
          gap={16}
          align="flex-end"
          wrap="wrap"
          style={{ marginTop: -48 }}
        >
          <Badge.Ribbon 
            text={roleLabels[profile.role]} 
            color={profile.role === "admin" ? "red" : profile.role === "moderator" ? "purple" : token.colorPrimary} 
            placement="start"
            style={{ top: 76, left: -8, zIndex: 2, padding: "0 12px" }}
          >
            <Avatar
              src={profile.avatarUrl}
              size={112}
              style={{
                backgroundColor: token.colorPrimary,
                color: token.colorTextLightSolid,
                border: `4px solid ${token.colorBgContainer}`,
                fontSize: 36,
                boxShadow: `0 8px 24px ${token.colorPrimary}40`,
              }}
            >
              {profile.fullName.charAt(0)}
            </Avatar>
          </Badge.Ribbon>

          <Flex
            vertical
            gap={12}
            style={{ flex: 1, paddingBottom: 4 }}
          >
            <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
              <div>
                <Typography.Title level={2} style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {profile.fullName}
                </Typography.Title>
                <Flex gap={24} style={{ marginTop: 12 }} wrap="wrap">
                  <Statistic title={<span style={{ fontSize: 12 }}>İlan / Gönderi</span>} value={14} valueStyle={{ fontSize: 16, fontWeight: 700 }} />
                  <Divider type="vertical" style={{ height: 36, margin: 0 }} />
                  <Statistic title={<span style={{ fontSize: 12 }}>Değerlendirme</span>} value={4.8} prefix="⭐" valueStyle={{ fontSize: 16, fontWeight: 700 }} />
                  <Divider type="vertical" style={{ height: 36, margin: 0 }} />
                  <Statistic title={<span style={{ fontSize: 12 }}>Katılım</span>} value={"May 2024"} valueStyle={{ fontSize: 16, fontWeight: 700 }} />
                </Flex>
              </div>

              {isOwnProfile && (
                <Link to="/settings">
                  <Button type="primary" shape="round" icon={<Edit2 size={14} />} style={{ boxShadow: `0 4px 12px ${token.colorPrimary}40` }}>
                    Profili Duzenle
                  </Button>
                </Link>
              )}
            </Flex>

            <Flex gap={20} wrap="wrap">
              {profile.universityName && (
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <Building2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  {profile.universityName}
                </Typography.Text>
              )}
              {profile.department && (
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <GraduationCap size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  {profile.department}
                  {profile.year ? ` · ${profile.year}. sinif` : ""}
                </Typography.Text>
              )}
              {isOwnProfile && profile.email && (
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  <Mail size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
                  {profile.email}
                </Typography.Text>
              )}
            </Flex>
          </Flex>
        </Flex>

        {isOwnProfile && (
          <div style={{ marginTop: 24, padding: "16px 20px", background: token.colorFillQuaternary, borderRadius: 12 }}>
            <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
              <Typography.Text strong style={{ fontSize: 13 }}>Profil Doluluk Oranı</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>%80</Typography.Text>
            </Flex>
            <Progress percent={80} showInfo={false} strokeColor={{ from: token.colorPrimary, to: token.colorInfo }} />
          </div>
        )}

        <div style={{ 
          marginTop: 24, 
          padding: 20, 
          background: token.colorFillAlter, 
          borderRadius: 16,
          border: `1px solid ${token.colorBorderSecondary}`
        }}>
          <Typography.Title level={5} style={{ margin: "0 0 8px 0", color: token.colorTextSecondary }}>Hakkımda</Typography.Title>
          <Typography.Paragraph
            style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}
          >
            {profile.bio || "Bu kullanıcı henüz kendisi hakkında bir açıklama eklemedi. Onu tanımak için güzel bir fırsat!"}
          </Typography.Paragraph>
        </div>
      </div>
    </Card>
  );
}
