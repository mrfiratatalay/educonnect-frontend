import { Link, useParams } from "react-router-dom";
import { Users, Info, PackageOpen, Bookmark, Ghost } from "lucide-react";
import { Alert, Button, Empty, Flex, Grid, Typography, Tabs, Row, Col } from "antd";
import { useAuthStore } from "@/store/authStore";
import {
  useMyProfileQuery,
  usePublicProfileQuery,
} from "@/features/users/hooks";
import type { PublicUserProfile } from "@/features/users/api";
import type { User, UserRole } from "@/types";
import ProfileSummaryCard from "@/pages/Profile/components/ProfileSummaryCard";
import ProfileDetailsCard from "@/pages/Profile/components/ProfileDetailsCard";
import ProfileTimeline from "@/pages/Profile/components/ProfileTimeline";

interface ProfileViewModel {
  fullName: string;
  role: UserRole;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  universityName?: string;
  department?: string;
  year?: number;
}

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const currentUserId = useAuthStore((state) => state.user?.id);
  const targetUserId = userId && userId !== currentUserId ? userId : undefined;
  const isOwnProfile = !targetUserId;
  const myProfileQuery = useMyProfileQuery(isOwnProfile);
  const publicProfileQuery = usePublicProfileQuery(targetUserId, !isOwnProfile);
  const profileQuery = isOwnProfile ? myProfileQuery : publicProfileQuery;
  const screens = Grid.useBreakpoint();
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;

  if (profileQuery.isLoading) {
    return (
      <div style={{ padding: pagePadding, maxWidth: 960, margin: "0 auto" }}>
        <ProfileSummaryCard
          profile={{ fullName: "", role: "student" }}
          isOwnProfile={false}
          loading
        />
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div style={{ padding: pagePadding, maxWidth: 900, margin: "0 auto" }}>
        <Empty
          image={<Users size={48} style={{ opacity: 0.3 }} />}
          description="Kullanici bulunamadi"
        >
          <Link to="/feed">
            <Button>Feed'e Don</Button>
          </Link>
        </Empty>
      </div>
    );
  }

  const profile = toProfileViewModel(profileQuery.data);

  return (
    <div style={{ padding: pagePadding, maxWidth: 960, margin: "0 auto" }}>
      <Flex vertical gap={28}>
        <ProfileSummaryCard profile={profile} isOwnProfile={isOwnProfile} />
        
        <Tabs 
          defaultActiveKey="about"
          size="large"
          items={[
            {
              key: "about",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Info size={16} /> Hakkında
                </span>
              ),
              children: (
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={15} lg={16}>
                    <ProfileDetailsCard profile={profile} isOwnProfile={isOwnProfile} />
                  </Col>
                  <Col xs={24} md={9} lg={8}>
                    <ProfileTimeline />
                  </Col>
                </Row>
              )
            },
            {
              key: "listings",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <PackageOpen size={16} /> İlanlar
                </span>
              ),
              children: (
                <div style={{ padding: "60px 0", background: "var(--ant-color-bg-container)", borderRadius: 16, border: "1px solid var(--ant-color-border-secondary)" }}>
                  <Empty 
                    image={<Ghost size={48} color="var(--ant-color-text-quaternary)" style={{ opacity: 0.5, marginBottom: 12 }} />} 
                    description={<Typography.Text type="secondary">Kullanıcının henüz bir ilanı yok.</Typography.Text>} 
                  />
                </div>
              )
            },
            ...(isOwnProfile ? [{
              key: "saved",
              label: (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Bookmark size={16} /> Kaydedilenler
                </span>
              ),
              children: (
                <div style={{ padding: "60px 0", background: "var(--ant-color-bg-container)", borderRadius: 16, border: "1px solid var(--ant-color-border-secondary)" }}>
                  <Empty 
                    image={<Bookmark size={48} color="var(--ant-color-text-quaternary)" style={{ opacity: 0.5, marginBottom: 12 }} />} 
                    description={<Typography.Text type="secondary">Henüz kaydedilmiş ilanınız yok.</Typography.Text>} 
                  />
                </div>
              )
            }] : [])
          ]}
        />
      </Flex>
    </div>
  );
}

function toProfileViewModel(profile: User | PublicUserProfile): ProfileViewModel {
  const baseProfile = {
    fullName: profile.fullName,
    role: profile.role,
    avatarUrl: profile.avatarUrl,
    bio: profile.bio,
    universityName: profile.universityName,
    department: profile.department,
    year: profile.year,
  };

  if ("email" in profile) {
    return { ...baseProfile, email: profile.email };
  }

  return baseProfile;
}
