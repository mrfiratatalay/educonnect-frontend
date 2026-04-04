import { Link, useParams } from "react-router-dom";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  useMyProfileQuery,
  usePublicProfileQuery,
} from "@/features/users/hooks";
import type { PublicUserProfile } from "@/features/users/api";
import type { User, UserRole } from "@/types";
import ProfileSummaryCard from "@/pages/Profile/components/ProfileSummaryCard";
import ProfileDetailsCard from "@/pages/Profile/components/ProfileDetailsCard";
import ProfileNextStepsCard from "@/pages/Profile/components/ProfileNextStepsCard";

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

  if (profileQuery.isLoading) {
    return (
      <div className="p-4 lg:p-6 xl:p-8 max-w-4xl mx-auto text-sm text-muted-foreground">
        Profil bilgileri yukleniyor...
      </div>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="p-4 lg:p-6 xl:p-8 max-w-4xl mx-auto">
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Kullanici bulunamadi</p>
          <Link to="/feed">
            <Button variant="outline" size="sm" className="mt-3">
              Feed'e Don
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const profile = toProfileViewModel(profileQuery.data);

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-4xl mx-auto space-y-6">
      <ProfileSummaryCard profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileDetailsCard profile={profile} isOwnProfile={isOwnProfile} />
      <ProfileNextStepsCard isOwnProfile={isOwnProfile} />
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
    return {
      ...baseProfile,
      email: profile.email,
    };
  }

  return baseProfile;
}
