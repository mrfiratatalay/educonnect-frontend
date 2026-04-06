import { useState } from "react";
import {
  Building2,
  CalendarDays,
  Camera,
  GraduationCap,
  User as UserIcon,
} from "lucide-react";
import {
  Avatar,
  Button,
  Flex,
  Grid,
  Image,
  Skeleton,
  Tooltip,
  Typography,
  Upload,
  message,
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

interface ProfileSummaryCardProps {
  profile: {
    id: string;
    fullName: string;
    role: UserRole;
    avatarUrl?: string;
    coverImageUrl?: string;
    bio?: string;
    universityName?: string;
    department?: string;
    year?: number;
    email?: string;
    createdAt?: string;
    followersCount: number;
    followingCount: number;
  };
  isOwnProfile: boolean;
  loading?: boolean;
  onEditProfile?: () => void;
  isFollowing?: boolean;
  followActionPending?: boolean;
  onFollowToggle?: () => void | Promise<void>;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
}

export default function ProfileSummaryCard({
  profile,
  isOwnProfile,
  loading = false,
  onEditProfile,
  isFollowing = false,
  followActionPending = false,
  onFollowToggle,
  onOpenFollowers,
  onOpenFollowing,
}: ProfileSummaryCardProps) {
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const uploadAvatarMutation = useUploadMyAvatarMutation();

  const coverHeight = screens.sm ? 220 : 160;
  const avatarSize = screens.sm ? 132 : 96;
  const avatarFontSize = avatarSize * 0.34;
  const secondaryLabel = profile.email
    ? `@${profile.email.split("@")[0].toLowerCase()}`
    : roleLabels[profile.role];
  const followButtonLabel = isFollowing ? "Takibi birak" : "Takip et";

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
      <section
        style={{
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <div
          style={{
            height: coverHeight,
            backgroundColor: token.colorFillSecondary,
            backgroundImage: profile.coverImageUrl ? `url(${profile.coverImageUrl})` : undefined,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div style={{ padding: "0 16px 24px" }}>
          <Flex
            justify="space-between"
            align="flex-end"
            gap={16}
            wrap="wrap"
            style={{ marginTop: -48 }}
          >
            <Skeleton.Avatar active size={avatarSize} shape="circle" />
            <Skeleton.Button active style={{ width: 140, height: 38, borderRadius: 999 }} />
          </Flex>

          <div style={{ marginTop: 16 }}>
            <Skeleton active paragraph={{ rows: 3 }} title={{ width: "40%" }} />
          </div>
        </div>
      </section>
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
        cursor: isOwnProfile ? "pointer" : profile.avatarUrl ? "pointer" : "default",
        transition: "filter 0.2s ease",
        ...(avatarHovered && isOwnProfile ? { filter: "brightness(0.82)" } : {}),
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

        {isOwnProfile ? (
          <div
            style={{
              position: "absolute",
              inset: 4,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.28)",
              opacity: avatarHovered ? 1 : 0,
              transition: "opacity 0.2s ease",
              pointerEvents: "none",
            }}
          >
            <Camera size={20} color="#fff" />
          </div>
        ) : null}

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
    <section
      style={{
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <div
        style={{
          height: coverHeight,
          backgroundColor: token.colorFillSecondary,
          backgroundImage: profile.coverImageUrl ? `url(${profile.coverImageUrl})` : undefined,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      />

      <div style={{ padding: screens.sm ? "0 20px 24px" : "0 16px 20px" }}>
        <Flex
          justify="space-between"
          align="flex-end"
          gap={16}
          wrap="wrap"
          style={{ marginTop: -48 }}
        >
          {renderProfileAvatar()}

          {isOwnProfile && onEditProfile ? (
            <Button
              shape="round"
              aria-haspopup="dialog"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onEditProfile();
              }}
              style={{
                height: 38,
                paddingInline: 18,
                fontWeight: 700,
                background: token.colorBgContainer,
                borderColor: token.colorBorder,
                boxShadow: "none",
                position: "relative",
                zIndex: 1,
              }}
            >
              Profili duzenle
            </Button>
          ) : null}

          {!isOwnProfile && onFollowToggle ? (
            <Button
              shape="round"
              loading={followActionPending}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void onFollowToggle();
              }}
              color={isFollowing ? undefined : "default"}
              variant={isFollowing ? "outlined" : "solid"}
              style={{
                height: 38,
                paddingInline: 18,
                fontWeight: 700,
                background: isFollowing ? token.colorBgContainer : undefined,
                borderColor: isFollowing ? token.colorBorder : undefined,
                boxShadow: "none",
                position: "relative",
                zIndex: 1,
              }}
            >
              {followButtonLabel}
            </Button>
          ) : null}
        </Flex>

        <div style={{ marginTop: 16 }}>
          <Typography.Title
            level={screens.sm ? 2 : 3}
            style={{ margin: 0, fontWeight: 800, letterSpacing: "-0.03em" }}
          >
            {profile.fullName}
          </Typography.Title>

          <Typography.Text type="secondary" style={{ display: "block", marginTop: 2 }}>
            {secondaryLabel}
          </Typography.Text>
        </div>

        {profile.bio ? (
          <Typography.Paragraph
            style={{
              margin: "14px 0 0",
              fontSize: 15,
              lineHeight: 1.65,
              color: token.colorText,
            }}
          >
            {profile.bio}
          </Typography.Paragraph>
        ) : null}

        <Flex gap={24} wrap="wrap" style={{ marginTop: profile.bio ? 2 : 14 }}>
          <ProfileMetric
            label="Takip edilen"
            value={profile.followingCount}
            onClick={onOpenFollowing}
          />
          <ProfileMetric
            label="Takipci"
            value={profile.followersCount}
            onClick={onOpenFollowers}
          />
        </Flex>

        <Flex gap={16} wrap="wrap" style={{ marginTop: 14 }}>
          {profile.createdAt ? (
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              <CalendarDays size={15} style={{ marginRight: 6, verticalAlign: -3 }} />
              {formatJoinDate(profile.createdAt)}
            </Typography.Text>
          ) : null}

          {profile.universityName ? (
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              <Building2 size={15} style={{ marginRight: 6, verticalAlign: -3 }} />
              {profile.universityName}
            </Typography.Text>
          ) : null}

          {profile.department ? (
            <Typography.Text type="secondary" style={{ fontSize: 14 }}>
              <GraduationCap size={15} style={{ marginRight: 6, verticalAlign: -3 }} />
              {profile.department}
              {profile.year ? ` - ${profile.year}. sinif` : ""}
            </Typography.Text>
          ) : null}
        </Flex>
      </div>
    </section>
  );
}

function ProfileMetric({
  label,
  value,
  onClick,
}: {
  label: string;
  value: number;
  onClick?: () => void;
}) {
  const { token } = theme.useToken();

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: 0,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          font: "inherit",
        }}
      >
        <Typography.Text strong style={{ color: token.colorText, fontSize: 15 }}>
          {value}
        </Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 15 }}>
          {label}
        </Typography.Text>
      </button>
    );
  }

  return (
    <Flex align="center" gap={6}>
      <Typography.Text strong style={{ color: token.colorText, fontSize: 15 }}>
        {value}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 15 }}>
        {label}
      </Typography.Text>
    </Flex>
  );
}

function formatJoinDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Katilma tarihi belirtilmedi";
  }

  return `Katilma ${new Intl.DateTimeFormat("tr-TR", {
    month: "long",
    year: "numeric",
  }).format(date)}`;
}
