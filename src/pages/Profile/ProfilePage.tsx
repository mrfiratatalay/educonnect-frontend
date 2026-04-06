import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ellipsis, Search } from "lucide-react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Grid,
  Input,
  Tabs,
  Typography,
  theme,
} from "antd";
import { useAuthStore } from "@/store/authStore";
import { getUserInitials } from "@/components/layout/shellNavigation";
import {
  useFollowUserMutation,
  useFollowersQuery,
  useMyProfileQuery,
  useFollowingUsersQuery,
  usePublicProfileQuery,
  useUnfollowUserMutation,
} from "@/features/users/hooks";
import type { PublicUserProfile } from "@/features/users/api";
import type { User, UserRole } from "@/types";
import ProfileSummaryCard from "@/pages/Profile/components/ProfileSummaryCard";
import ProfileConnectionsModal from "@/pages/Profile/components/ProfileConnectionsModal";
import ProfileDetailsCard from "@/pages/Profile/components/ProfileDetailsCard";
import ProfileTimeline from "@/pages/Profile/components/ProfileTimeline";
import ProfileEditModal from "@/pages/Profile/components/ProfileEditModal";

interface ProfileViewModel {
  id: string;
  fullName: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  universityId?: string;
  universityName?: string;
  department?: string;
  year?: number;
  createdAt?: string;
  followersCount: number;
  followingCount: number;
  isFollowedByCurrentUser?: boolean;
}

const roleLabels: Record<UserRole, string> = {
  student: "Ogrenci",
  admin: "Yonetici",
  moderator: "Moderator",
};

const trendItems = [
  {
    id: "trend-1",
    category: "Kampus gundemi",
    title: "#FinalHaftasi",
  },
  {
    id: "trend-2",
    category: "Teknoloji",
    title: "React 20",
  },
  {
    id: "trend-3",
    category: "Universite",
    title: "Kulup basvurulari",
  },
];

const followItems = [
  {
    id: "follow-1",
    name: "EduConnect Labs",
    handle: "@educonnectlabs",
    avatarSeed: "EduConnectLabs",
  },
  {
    id: "follow-2",
    name: "IEEE Student Branch",
    handle: "@ieeerteu",
    avatarSeed: "IEEE",
  },
  {
    id: "follow-3",
    name: "Kampus Duyurular",
    handle: "@kampusduyurular",
    avatarSeed: "KampusDuyurular",
  },
];

const footerLinks = [
  "Hizmet Sartlari",
  "Gizlilik Politikasi",
  "Cerez Politikasi",
  "Reklam bilgisi",
];

type ConnectionView = "followers" | "following" | null;

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const targetUserId = userId && userId !== currentUserId ? userId : undefined;
  const isOwnProfile = !targetUserId;
  const myProfileQuery = useMyProfileQuery(isOwnProfile);
  const publicProfileQuery = usePublicProfileQuery(targetUserId, !isOwnProfile);
  const profileQuery = isOwnProfile ? myProfileQuery : publicProfileQuery;
  const followUserMutation = useFollowUserMutation();
  const unfollowUserMutation = useUnfollowUserMutation();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [connectionView, setConnectionView] = useState<ConnectionView>(null);
  const [pendingConnectionUserId, setPendingConnectionUserId] = useState<string | null>(null);

  const isDesktop = !!screens.xl;
  const pageBorder = screens.xs ? "none" : `1px solid ${token.colorBorderSecondary}`;
  const connectionProfileId = profileQuery.data?.id;
  const followersQuery = useFollowersQuery(
    connectionProfileId,
    connectionView === "followers" && Boolean(connectionProfileId),
  );
  const followingUsersQuery = useFollowingUsersQuery(
    connectionProfileId,
    connectionView === "following" && Boolean(connectionProfileId),
  );

  if (profileQuery.isLoading) {
    return (
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar
            title="Profil"
            subtitle="Profil bilgileri yukleniyor"
            onBack={() => handleBack(navigate)}
          />
          <ProfileSummaryCard
            profile={{
              id: "",
              fullName: "",
              role: "student",
              followersCount: 0,
              followingCount: 0,
            }}
            isOwnProfile={false}
            loading
          />
        </ProfileColumn>
        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar
            title="Profil"
            subtitle="Profil yuklenemedi"
            onBack={() => handleBack(navigate)}
          />
          <div style={{ padding: 16 }}>
            <Alert type="error" showIcon message="Kullanici bulunamadi" />
          </div>
        </ProfileColumn>
        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>
    );
  }

  const profile = toProfileViewModel(profileQuery.data);
  const isFollowActionPending = followUserMutation.isPending || unfollowUserMutation.isPending;
  const isFollowing = Boolean(!isOwnProfile && profile.isFollowedByCurrentUser);
  const activeConnectionsQuery =
    connectionView === "followers" ? followersQuery : followingUsersQuery;
  const activeConnectionsTitle =
    connectionView === "followers" ? "Takipciler" : "Takip edilenler";

  return (
    <>
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar
            title={profile.fullName}
            subtitle={getProfileSubtitle(profile)}
            onBack={() => handleBack(navigate)}
          />

          <ProfileSummaryCard
            profile={profile}
            isOwnProfile={isOwnProfile}
            onEditProfile={isOwnProfile ? () => setEditModalOpen(true) : undefined}
            isFollowing={isFollowing}
            followActionPending={isFollowActionPending}
            onOpenFollowers={() => setConnectionView("followers")}
            onOpenFollowing={() => setConnectionView("following")}
            onFollowToggle={
              !isOwnProfile && targetUserId
                ? async () => {
                    if (isFollowing) {
                      await unfollowUserMutation.mutateAsync(targetUserId);
                      return;
                    }

                    await followUserMutation.mutateAsync(targetUserId);
                  }
                : undefined
            }
          />

          <Tabs
            defaultActiveKey="posts"
            size="large"
            className="profile-page-tabs"
            items={[
              {
                key: "posts",
                label: <ProfileTabLabel label="Gonderiler" />,
                children: (
                  <ProfileTabPanel>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Typography.Text type="secondary">
                          Henuz gonderi paylasilmadi.
                        </Typography.Text>
                      }
                    />
                  </ProfileTabPanel>
                ),
              },
              {
                key: "about",
                label: <ProfileTabLabel label="Hakkinda" />,
                children: (
                  <ProfileTabPanel>
                    <Flex vertical gap={16}>
                      <ProfileDetailsCard profile={profile} isOwnProfile={isOwnProfile} />
                      <ProfileTimeline profile={profile} />
                    </Flex>
                  </ProfileTabPanel>
                ),
              },
              {
                key: "listings",
                label: <ProfileTabLabel label="Ilanlar" />,
                children: (
                  <ProfileTabPanel>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Typography.Text type="secondary">
                          Aktif ilan bulunmuyor.
                        </Typography.Text>
                      }
                    />
                  </ProfileTabPanel>
                ),
              },
              {
                key: "media",
                label: <ProfileTabLabel label="Medya" />,
                children: (
                  <ProfileTabPanel>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Typography.Text type="secondary">
                          Fotograf veya video iceren gonderi bulunmuyor.
                        </Typography.Text>
                      }
                    />
                  </ProfileTabPanel>
                ),
              },
              {
                key: "likes",
                label: <ProfileTabLabel label="Begeni" />,
                children: (
                  <ProfileTabPanel>
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <Typography.Text type="secondary">
                          Begeni gecmisi bulunmuyor.
                        </Typography.Text>
                      }
                    />
                  </ProfileTabPanel>
                ),
              },
              ...(isOwnProfile
                ? [
                    {
                      key: "saved",
                      label: <ProfileTabLabel label="Kaydedilenler" />,
                      children: (
                        <ProfileTabPanel>
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                              <Typography.Text type="secondary">
                                Kaydedilmis icerik bulunmuyor.
                              </Typography.Text>
                            }
                          />
                        </ProfileTabPanel>
                      ),
                    },
                  ]
                : []),
            ]}
          />
        </ProfileColumn>

        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>

      {isOwnProfile ? (
        <ProfileEditModal
          open={isEditModalOpen}
          profile={profile}
          onClose={() => setEditModalOpen(false)}
        />
      ) : null}

      <ProfileConnectionsModal
        open={connectionView !== null}
        title={activeConnectionsTitle}
        loading={activeConnectionsQuery.isLoading}
        profiles={activeConnectionsQuery.data}
        currentUserId={currentUserId}
        pendingUserId={pendingConnectionUserId}
        onClose={() => {
          setConnectionView(null);
          setPendingConnectionUserId(null);
        }}
        onToggleFollow={async (connectionProfile) => {
          setPendingConnectionUserId(connectionProfile.id);

          try {
            if (connectionProfile.isFollowedByCurrentUser) {
              await unfollowUserMutation.mutateAsync(connectionProfile.id);
              return;
            }

            await followUserMutation.mutateAsync(connectionProfile.id);
          } finally {
            setPendingConnectionUserId(null);
          }
        }}
      />
    </>
  );
}

function ProfileShell({
  children,
  isDesktop,
}: {
  children: ReactNode;
  isDesktop: boolean;
}) {
  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: isDesktop ? "0 16px" : 0 }}>
      <Flex align="flex-start">{children}</Flex>
    </div>
  );
}

function ProfileColumn({ children, borderInline }: { children: ReactNode; borderInline: string }) {
  const { token } = theme.useToken();

  return (
    <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>
      <div
        style={{
          minHeight: "100vh",
          background: token.colorBgContainer,
          borderInline,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ProfileTopBar({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
}) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <Flex align="center" gap={12} style={{ minHeight: 56, padding: "8px 16px" }}>
        <Button
          type="text"
          aria-label="Geri don"
          onClick={onBack}
          style={{
            width: 36,
            height: 36,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            flex: "0 0 auto",
          }}
        >
          <ArrowLeft size={20} />
        </Button>

        <div style={{ minWidth: 0 }}>
          <Typography.Text
            strong
            ellipsis
            style={{ display: "block", fontSize: 19, lineHeight: 1.2, letterSpacing: "-0.02em" }}
          >
            {title}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13, lineHeight: 1.2 }}>
            {subtitle}
          </Typography.Text>
        </div>
      </Flex>
    </div>
  );
}

function ProfileTabLabel({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        padding: "14px 8px",
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

function ProfileTabPanel({ children }: { children: ReactNode }) {
  return <div style={{ padding: 16 }}>{children}</div>;
}

function ProfileRightRail() {
  const { token } = theme.useToken();
  const isDarkMode = token.colorBgBase === "#000000";
  const railSurface = isDarkMode ? "#16181C" : "#F7F9F9";

  return (
    <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
      <div style={{ position: "sticky", top: 12 }}>
        <Flex vertical gap={16}>
          <Input
            size="large"
            placeholder="Ara"
            prefix={<Search size={18} style={{ color: token.colorTextTertiary }} />}
            variant="filled"
            style={{
              borderRadius: 999,
              background: railSurface,
            }}
          />

          <ProfileRailCard title="Bunlari begenebilirsin" background={railSurface}>
            {followItems.map((item) => (
              <ProfileRailRow key={item.id}>
                <Flex align="center" gap={12} style={{ width: "100%" }}>
                  <Avatar
                    size={40}
                    src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${item.avatarSeed}`}
                    style={{
                      background: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      flexShrink: 0,
                    }}
                  >
                    {getUserInitials(item.name)}
                  </Avatar>

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Typography.Text
                      strong
                      ellipsis
                      style={{ display: "block", fontSize: 15 }}
                    >
                      {item.name}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      ellipsis
                      style={{ display: "block", fontSize: 15 }}
                    >
                      {item.handle}
                    </Typography.Text>
                  </div>

                  <Button
                    color="default"
                    variant="solid"
                    shape="round"
                    style={{
                      height: 36,
                      paddingInline: 16,
                      fontWeight: 700,
                    }}
                  >
                    Takip et
                  </Button>
                </Flex>
              </ProfileRailRow>
            ))}

            <Typography.Link style={{ padding: "0 16px 16px", fontSize: 15 }}>
              Daha fazla goster
            </Typography.Link>
          </ProfileRailCard>

          <ProfileRailCard title="Neler oluyor?" background={railSurface}>
            {trendItems.map((item) => (
              <ProfileRailRow key={item.id}>
                <Flex justify="space-between" align="flex-start" gap={12}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <Typography.Text
                      type="secondary"
                      style={{ display: "block", fontSize: 13 }}
                    >
                      {item.category}
                    </Typography.Text>
                    <Typography.Text
                      strong
                      style={{
                        display: "block",
                        fontSize: 16,
                        lineHeight: 1.35,
                        marginTop: 2,
                      }}
                    >
                      {item.title}
                    </Typography.Text>
                  </div>

                  <Ellipsis size={18} color={token.colorTextTertiary} />
                </Flex>
              </ProfileRailRow>
            ))}

            <Typography.Link style={{ padding: "0 16px 16px", fontSize: 15 }}>
              Daha fazla goster
            </Typography.Link>
          </ProfileRailCard>

          <Flex wrap gap={8} style={{ paddingInline: 12 }}>
            {footerLinks.map((item) => (
              <Typography.Text key={item} type="secondary" style={{ fontSize: 13 }}>
                {item}
              </Typography.Text>
            ))}
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              (c) 2026 EduConnect Corp.
            </Typography.Text>
          </Flex>
        </Flex>
      </div>
    </div>
  );
}

function ProfileRailCard({
  title,
  background,
  children,
}: {
  title: string;
  background: string;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="borderless"
      style={{
        background,
        overflow: "hidden",
        borderRadius: 24,
        border: `1px solid ${token.colorBorderSecondary}`,
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Flex vertical gap={2}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            padding: "14px 16px 8px",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </Typography.Title>
        {children}
      </Flex>
    </Card>
  );
}

function ProfileRailRow({ children }: { children: ReactNode }) {
  return <div style={{ padding: "10px 16px" }}>{children}</div>;
}

function toProfileViewModel(profile: User | PublicUserProfile): ProfileViewModel {
  const baseProfile = {
    id: profile.id,
    fullName: profile.fullName,
    role: profile.role,
    avatarUrl: profile.avatarUrl,
    coverImageUrl: profile.coverImageUrl,
    bio: profile.bio,
    universityId: profile.universityId,
    universityName: profile.universityName,
    department: profile.department,
    year: profile.year,
    createdAt: "createdAt" in profile ? profile.createdAt : undefined,
    followersCount: profile.followersCount ?? 0,
    followingCount: profile.followingCount ?? 0,
    isFollowedByCurrentUser:
      "isFollowedByCurrentUser" in profile ? profile.isFollowedByCurrentUser : undefined,
  };

  if ("email" in profile) {
    return { ...baseProfile, email: profile.email };
  }

  return baseProfile;
}

function getProfileSubtitle(profile: ProfileViewModel) {
  if (profile.email) {
    return `@${profile.email.split("@")[0].toLowerCase()}`;
  }

  return roleLabels[profile.role] || "Profil";
}

function handleBack(navigate: ReturnType<typeof useNavigate>) {
  if (window.history.length > 1) {
    navigate(-1);
    return;
  }

  navigate("/");
}
