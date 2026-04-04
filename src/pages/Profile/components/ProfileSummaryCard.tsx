import { Link } from "react-router-dom";
import { Building2, Edit2, GraduationCap, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  return (
    <Card className="overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-primary via-primary/85 to-indigo-700" />
      <CardContent className="relative px-5 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {profile.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 sm:pb-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold">{profile.fullName}</h1>
                <Badge variant="secondary" className="mt-1">
                  {roleLabels[profile.role]}
                </Badge>
              </div>

              {isOwnProfile && (
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" />
                    Profili Duzenle
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {profile.universityName && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 shrink-0" />
                  {profile.universityName}
                </span>
              )}

              {profile.department && (
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 shrink-0" />
                  {profile.department}
                  {profile.year ? ` · ${profile.year}. sinif` : ""}
                </span>
              )}

              {isOwnProfile && profile.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 shrink-0" />
                  {profile.email}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
          {profile.bio || "Bu kullanici henuz kendisi hakkinda bir aciklama eklemedi."}
        </p>
      </CardContent>
    </Card>
  );
}
