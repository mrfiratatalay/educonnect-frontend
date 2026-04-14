import { useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Alert,
  Button,
  Flex,
  Grid,
  Tabs,
  Typography,
  theme,
} from "antd";
import { useAuthStore } from "@/store/authStore";
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
import ProfileRightRail from "@/pages/Profile/components/ProfileRightRail";
import ProfilePostsTab from "@/pages/Profile/components/ProfilePostsTab";
import ProfileListingsTab from "@/pages/Profile/components/ProfileListingsTab";
import ProfileMediaTab from "@/pages/Profile/components/ProfileMediaTab";
import ProfileLikesTab from "@/pages/Profile/components/ProfileLikesTab";
import ProfileSavedTab from "@/pages/Profile/components/ProfileSavedTab";

export interface ProfileViewModel {
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
  const followersQuery = useFollowersQuery(connectionProfileId, connectionView === "followers" && Boolean(connectionProfileId));
  const followingUsersQuery = useFollowingUsersQuery(connectionProfileId, connectionView === "following" && Boolean(connectionProfileId));

  if (profileQuery.isLoading) {
    return (
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar title="Profil" subtitle="Profil bilgileri yukleniyor" onBack={() => goBack(navigate)} />
          <ProfileSummaryCard profile={{ id: "", fullName: "", role: "student", followersCount: 0, followingCount: 0 }} isOwnProfile={false} loading />
        </ProfileColumn>
        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar title="Profil" subtitle="Profil yuklenemedi" onBack={() => goBack(navigate)} />
          <div style={{ padding: 16 }}><Alert type="error" showIcon message="Kullanici bulunamadi" /></div>
        </ProfileColumn>
        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>
    );
  }

  const profile = toProfileViewModel(profileQuery.data);
  const isFollowActionPending = followUserMutation.isPending || unfollowUserMutation.isPending;
  const isFollowing = Boolean(!isOwnProfile && profile.isFollowedByCurrentUser);
  const activeConnectionsQuery = connectionView === "followers" ? followersQuery : followingUsersQuery;
  const activeConnectionsTitle = connectionView === "followers" ? "Takipciler" : "Takip edilenler";

  return (
    <>
      <ProfileShell isDesktop={isDesktop}>
        <ProfileColumn borderInline={pageBorder}>
          <ProfileTopBar title={profile.fullName} subtitle={getProfileSubtitle(profile)} onBack={() => goBack(navigate)} />

          <ProfileSummaryCard
            profile={profile} isOwnProfile={isOwnProfile}
            onEditProfile={isOwnProfile ? () => setEditModalOpen(true) : undefined}
            isFollowing={isFollowing} followActionPending={isFollowActionPending}
            onOpenFollowers={() => setConnectionView("followers")}
            onOpenFollowing={() => setConnectionView("following")}
            onFollowToggle={!isOwnProfile && targetUserId ? async () => {
              if (isFollowing) { await unfollowUserMutation.mutateAsync(targetUserId); return; }
              await followUserMutation.mutateAsync(targetUserId);
            } : undefined}
            onSendMessage={!isOwnProfile && targetUserId ? () => navigate(`/messages?with=${targetUserId}`) : undefined}
          />

          <Tabs defaultActiveKey="posts" size="large" className="profile-page-tabs" items={buildTabItems(profile, isOwnProfile)} />
        </ProfileColumn>
        {isDesktop ? <ProfileRightRail /> : null}
      </ProfileShell>

      {isOwnProfile && <ProfileEditModal open={isEditModalOpen} profile={profile} onClose={() => setEditModalOpen(false)} />}

      <ProfileConnectionsModal
        open={connectionView !== null} title={activeConnectionsTitle}
        loading={activeConnectionsQuery.isLoading} profiles={activeConnectionsQuery.data}
        currentUserId={currentUserId} pendingUserId={pendingConnectionUserId}
        onClose={() => { setConnectionView(null); setPendingConnectionUserId(null); }}
        onToggleFollow={async (cp) => {
          setPendingConnectionUserId(cp.id);
          try {
            if (cp.isFollowedByCurrentUser) { await unfollowUserMutation.mutateAsync(cp.id); return; }
            await followUserMutation.mutateAsync(cp.id);
          } finally { setPendingConnectionUserId(null); }
        }}
      />
    </>
  );
}

function buildTabItems(profile: ProfileViewModel, isOwnProfile: boolean) {
  const tabPanel = (children: ReactNode) => <div style={{ padding: 16 }}>{children}</div>;
  const tabLabel = (label: string) => (
    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "14px 8px", fontWeight: 700 }}>{label}</span>
  );

  const items = [
    { key: "posts", label: tabLabel("Gonderiler"), children: tabPanel(<ProfilePostsTab userId={profile.id} />) },
    {
      key: "about", label: tabLabel("Hakkinda"),
      children: tabPanel(<Flex vertical gap={16}><ProfileDetailsCard profile={profile} isOwnProfile={isOwnProfile} /><ProfileTimeline profile={profile} /></Flex>),
    },
    { key: "listings", label: tabLabel("Ilanlar"), children: tabPanel(<ProfileListingsTab userId={profile.id} />) },
    { key: "media", label: tabLabel("Medya"), children: tabPanel(<ProfileMediaTab userId={profile.id} />) },
    { key: "likes", label: tabLabel("Begeni"), children: tabPanel(<ProfileLikesTab userId={profile.id} />) },
  ];

  if (isOwnProfile) {
    items.push({ key: "saved", label: tabLabel("Kaydedilenler"), children: tabPanel(<ProfileSavedTab />) });
  }

  return items;
}

function ProfileShell({ children, isDesktop }: { children: ReactNode; isDesktop: boolean }) {
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
      <div style={{ minHeight: "100vh", background: token.colorBgContainer, borderInline }}>{children}</div>
    </div>
  );
}

function ProfileTopBar({ title, subtitle, onBack }: { title: string; subtitle: string; onBack: () => void }) {
  const { token } = theme.useToken();
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: token.colorBgContainer, borderBottom: `1px solid ${token.colorBorderSecondary}`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <Flex align="center" gap={12} style={{ minHeight: 56, padding: "8px 16px" }}>
        <Button type="text" aria-label="Geri don" onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flex: "0 0 auto" }}>
          <ArrowLeft size={20} />
        </Button>
        <div style={{ minWidth: 0 }}>
          <Typography.Text strong ellipsis style={{ display: "block", fontSize: 19, lineHeight: 1.2, letterSpacing: "-0.02em" }}>{title}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13, lineHeight: 1.2 }}>{subtitle}</Typography.Text>
        </div>
      </Flex>
    </div>
  );
}

function toProfileViewModel(profile: User | PublicUserProfile): ProfileViewModel {
  const base = {
    id: profile.id, fullName: profile.fullName, role: profile.role,
    avatarUrl: profile.avatarUrl, coverImageUrl: profile.coverImageUrl,
    bio: profile.bio, universityId: profile.universityId, universityName: profile.universityName,
    department: profile.department, year: profile.year,
    createdAt: "createdAt" in profile ? profile.createdAt : undefined,
    followersCount: profile.followersCount ?? 0, followingCount: profile.followingCount ?? 0,
    isFollowedByCurrentUser: "isFollowedByCurrentUser" in profile ? profile.isFollowedByCurrentUser : undefined,
  };
  return "email" in profile ? { ...base, email: profile.email } : base;
}

function getProfileSubtitle(profile: ProfileViewModel) {
  if (profile.email) return `@${profile.email.split("@")[0].toLowerCase()}`;
  return roleLabels[profile.role] || "Profil";
}

function goBack(navigate: ReturnType<typeof useNavigate>) {
  if (window.history.length > 1) { navigate(-1); return; }
  navigate("/");
}
