import { useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Camera, Edit2, GraduationCap, Mail, User as UserIcon } from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Image,
  message,
  Progress,
  Skeleton,
  Statistic,
  Tooltip,
  Typography,
  Upload,
  theme,
} from "antd";
import type { UploadProps } from "antd";
import { getApiErrorMessage } from "@/features/auth/api";
import { useUploadMyAvatarMutation } from "@/features/users/hooks";
import type { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  student: "Ogrenci",
  admin: "Yonetici",
  moderator: "Moderator",
};

const roleColors: Record<UserRole, string> = {
  admin: "red",
  moderator: "purple",
  student: "",
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
  loading?: boolean;
}

export default function ProfileSummaryCard({
  profile,
  isOwnProfile,
  loading = false,
}: ProfileSummaryCardProps) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const uploadAvatarMutation = useUploadMyAvatarMutation();

  const avatarSize = screens.lg ? 120 : screens.md ? 112 : screens.sm ? 96 : 80;
  const avatarFontSize = avatarSize * 0.32;

  const uploadProps: UploadProps = {
    name: "file",
    showUploadList: false,
    accept: "image/png,image/jpeg,image/gif",
    beforeUpload: (file) => {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

      if (!allowedTypes.includes(file.type)) {
        message.error("Sadece JPG, PNG veya GIF dosyalari yukleyebilirsiniz.");
        return Upload.LIST_IGNORE;
      }

      if (file.size / 1024 / 1024 >= 5) {
        message.error("Resim 5MB'dan kucuk olmalidir.");
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        await uploadAvatarMutation.mutateAsync(file as File);
        onSuccess?.("ok");
        message.success("Profil fotografi guncellendi.");
      } catch (error) {
        onError?.(error as Error);
        message.error(getApiErrorMessage(error));
      }
    },
  };

  if (loading) {
    return (
      <Card styles={{ body: { padding: 0 } }}>
        <div
          style={{
            height: 140,
            background: token.colorFillSecondary,
            borderRadius: `${token.borderRadiusLG * 1.5}px ${token.borderRadiusLG * 1.5}px 0 0`,
          }}
        />
        <div style={{ padding: "0 24px 24px" }}>
          <Flex gap={16} align="flex-end" style={{ marginTop: -48 }}>
            <Skeleton.Avatar active size={avatarSize} shape="circle" />
            <Flex vertical gap={12} style={{ flex: 1, paddingBottom: 4 }}>
              <Skeleton.Input active style={{ width: 200, height: 28 }} />
              <Flex gap={24}>
                <Skeleton.Input active size="small" style={{ width: 80 }} />
                <Skeleton.Input active size="small" style={{ width: 80 }} />
                <Skeleton.Input active size="small" style={{ width: 80 }} />
              </Flex>
              <Skeleton.Input active size="small" style={{ width: 300 }} />
            </Flex>
          </Flex>
          <div style={{ marginTop: 24 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </div>
      </Card>
    );
  }

  const avatarElement = (
    <Avatar
      src={profile.avatarUrl}
      size={avatarSize}
      icon={!profile.avatarUrl && <UserIcon size={avatarFontSize} />}
      onError={() => false}
      style={{
        backgroundColor: token.colorPrimary,
        color: token.colorTextLightSolid,
        border: `4px solid ${token.colorBgContainer}`,
        fontSize: avatarFontSize,
        boxShadow: `0 8px 24px ${token.colorPrimary}40`,
        cursor: isOwnProfile ? "pointer" : profile.avatarUrl ? "pointer" : "default",
        transition: "all 0.3s ease",
        ...(avatarHovered && isOwnProfile
          ? { filter: "brightness(0.7)", transform: "scale(1.02)" }
          : {}),
      }}
    >
      {profile.fullName.charAt(0)}
    </Avatar>
  );

  const renderProfileAvatar = () => {
    const imagePreview = !isOwnProfile && profile.avatarUrl ? (
      <Image
        src={profile.avatarUrl}
        preview={{
          visible: previewVisible,
          onVisibleChange: setPreviewVisible,
          mask: false,
        }}
        style={{ display: "none" }}
        alt={profile.fullName}
      />
    ) : null;

    const wrappedAvatar = (
      <div
        style={{ position: "relative", display: "inline-block" }}
        onMouseEnter={() => setAvatarHovered(true)}
        onMouseLeave={() => setAvatarHovered(false)}
        onClick={() => {
          if (!isOwnProfile && profile.avatarUrl) {
            setPreviewVisible(true);
          }
        }}
      >
        {avatarElement}

        {isOwnProfile && (
          <div
            style={{
              position: "absolute",
              inset: 4,
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              opacity: avatarHovered ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
              gap: 2,
            }}
          >
            <Camera size={20} color="#fff" />
            <Typography.Text
              style={{
                color: "#fff",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.02em",
              }}
            >
              Degistir
            </Typography.Text>
          </div>
        )}

        {imagePreview}
      </div>
    );

    if (isOwnProfile) {
      return (
        <Upload {...uploadProps} disabled={uploadAvatarMutation.isPending}>
          <Tooltip title="Profil fotografini degistir" placement="bottom">
            {wrappedAvatar}
          </Tooltip>
        </Upload>
      );
    }

    if (profile.avatarUrl) {
      return (
        <Tooltip title="Fotografi buyut" placement="bottom">
          {wrappedAvatar}
        </Tooltip>
      );
    }

    return wrappedAvatar;
  };

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
        <Flex gap={16} align="flex-end" wrap="wrap" style={{ marginTop: -48 }}>
          <Badge.Ribbon
            text={roleLabels[profile.role]}
            color={roleColors[profile.role] || token.colorPrimary}
            placement="start"
            style={{ top: avatarSize - 36, left: -8, zIndex: 2, padding: "0 12px" }}
          >
            <Badge
              dot
              status="success"
              offset={[-12, avatarSize - 12]}
              style={{
                width: 14,
                height: 14,
                border: `2px solid ${token.colorBgContainer}`,
                boxShadow: `0 0 0 1px ${token.colorBgContainer}`,
              }}
            >
              {renderProfileAvatar()}
            </Badge>
          </Badge.Ribbon>

          <Flex vertical gap={12} style={{ flex: 1, paddingBottom: 4 }}>
            <Flex align="flex-start" justify="space-between" wrap="wrap" gap={16}>
              <div>
                <Typography.Title
                  level={2}
                  style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.02em" }}
                >
                  {profile.fullName}
                </Typography.Title>
                <Flex gap={24} style={{ marginTop: 12 }} wrap="wrap">
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Ilan / Gonderi</span>}
                    value={14}
                    valueStyle={{ fontSize: 16, fontWeight: 700 }}
                  />
                  <Divider type="vertical" style={{ height: 36, margin: 0 }} />
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Degerlendirme</span>}
                    value={4.8}
                    prefix="*"
                    valueStyle={{ fontSize: 16, fontWeight: 700 }}
                  />
                  <Divider type="vertical" style={{ height: 36, margin: 0 }} />
                  <Statistic
                    title={<span style={{ fontSize: 12 }}>Katilim</span>}
                    value="May 2024"
                    valueStyle={{ fontSize: 16, fontWeight: 700 }}
                  />
                </Flex>
              </div>

              {isOwnProfile && (
                <Link to="/settings">
                  <Button
                    type="primary"
                    shape="round"
                    icon={<Edit2 size={14} />}
                    style={{ boxShadow: `0 4px 12px ${token.colorPrimary}40` }}
                  >
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
          <div
            style={{
              marginTop: 24,
              padding: "16px 20px",
              background: token.colorFillQuaternary,
              borderRadius: 12,
            }}
          >
            <Flex justify="space-between" align="center" style={{ marginBottom: 4 }}>
              <Typography.Text strong style={{ fontSize: 13 }}>
                Profil Doluluk Orani
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                %80
              </Typography.Text>
            </Flex>
            <Progress
              percent={80}
              showInfo={false}
              strokeColor={{ from: token.colorPrimary, to: token.colorInfo }}
            />
          </div>
        )}

        <div
          style={{
            marginTop: 24,
            padding: 20,
            background: token.colorFillAlter,
            borderRadius: 16,
            border: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <Typography.Title
            level={5}
            style={{ margin: "0 0 8px 0", color: token.colorTextSecondary }}
          >
            Hakkimda
          </Typography.Title>
          <Typography.Paragraph style={{ margin: 0, lineHeight: 1.6, fontSize: 15 }}>
            {profile.bio ||
              "Bu kullanici henuz kendisi hakkinda bir aciklama eklemedi. Onu tanimak icin guzel bir firsat."}
          </Typography.Paragraph>
        </div>
      </div>
    </Card>
  );
}
