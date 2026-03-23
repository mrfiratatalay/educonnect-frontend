import { useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Mail,
  GraduationCap,
  Calendar,
  Edit2,
  MessageSquare,
  Users,
  Heart,
  UserPlus,
  UserCheck,
  LinkIcon,
  Camera,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { mockPosts, mockGroups, mockUsers } from "@/data/mock";
import type { User } from "@/types";

const roleLabels: Record<string, string> = {
  student: "Öğrenci",
  admin: "Yönetici",
  moderator: "Moderatör",
};

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuthStore();

  const profileUser: User | undefined = useMemo(() => {
    if (!userId || userId === currentUser?.id) return currentUser ?? undefined;
    return mockUsers.find((u) => u.id === userId);
  }, [userId, currentUser]);

  const isOwnProfile = !userId || userId === currentUser?.id;

  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "connected"
  >("none");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!profileUser) {
    return (
      <div className="p-4 lg:p-6 xl:p-8 max-w-4xl mx-auto">
        <div className="text-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Kullanıcı bulunamadı</p>
          <Link to="/feed">
            <Button variant="outline" size="sm" className="mt-3">
              Feed'e Dön
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const myPosts = mockPosts.filter((p) => p.userId === profileUser.id);
  const myGroups = mockGroups.filter((g) => g.isMember);

  const handleConnectionAction = () => {
    if (connectionStatus === "none") {
      setConnectionStatus("pending");
    } else if (connectionStatus === "pending") {
      setConnectionStatus("none");
    }
  };

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card className="overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary via-indigo-500 to-indigo-800 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&h=400&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20" />
        </div>
        <CardContent className="relative px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
                <AvatarImage src={avatarPreview || profileUser.avatarUrl} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profileUser.fullName?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {isOwnProfile && (
                <>
                  <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <button
                    onClick={() => avatarInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    {profileUser.fullName}
                  </h1>
                  <Badge variant="secondary" className="mt-1">
                    {roleLabels[profileUser.role || "student"]}
                  </Badge>
                </div>
                {isOwnProfile ? (
                  <Link to="/settings">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 self-start"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Profili Düzenle
                    </Button>
                  </Link>
                ) : (
                  <div className="flex gap-2 self-start">
                    <Button
                      variant={
                        connectionStatus === "none" ? "default" : "outline"
                      }
                      size="sm"
                      className="gap-1.5"
                      onClick={handleConnectionAction}
                    >
                      {connectionStatus === "none" && (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          Bağlantı İsteği Gönder
                        </>
                      )}
                      {connectionStatus === "pending" && (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          İstek Gönderildi
                        </>
                      )}
                      {connectionStatus === "connected" && (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          Bağlantı
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {profileUser.bio && (
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              {profileUser.bio}
            </p>
          )}

          {/* Interest Tags */}
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profileUser.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="text-xs font-normal"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 shrink-0" />
              {profileUser.department}
              {profileUser.year && ` · ${profileUser.year}. Sınıf`}
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 shrink-0" />
              {profileUser.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 shrink-0" />
              {new Date(profileUser.createdAt || "").toLocaleDateString(
                "tr-TR",
                {
                  month: "long",
                  year: "numeric",
                },
              )}{" "}
              tarihinden beri üye
            </span>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-xl font-bold">{myPosts.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Gönderi</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-xl font-bold">{myGroups.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Grup</p>
            </div>
            <div className="p-3 rounded-xl bg-secondary/50">
              <p className="text-xl font-bold">24</p>
              <p className="text-xs text-muted-foreground mt-0.5">Bağlantı</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start bg-secondary/50">
          <TabsTrigger value="posts" className="gap-1.5">
            <MessageSquare className="w-4 h-4" />
            {isOwnProfile ? "Gönderilerim" : "Gönderi"}
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <Users className="w-4 h-4" />
            {isOwnProfile ? "Gruplarım" : "Gruplar"}
          </TabsTrigger>
          <TabsTrigger value="connections" className="gap-1.5">
            <LinkIcon className="w-4 h-4" />
            Bağlantılar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-3 mt-4">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <p className="text-sm leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.likesCount} beğeni
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.commentsCount} yorum
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">
                {isOwnProfile
                  ? "Henüz gönderi paylaşmadınız."
                  : "Henüz gönderi paylaşmamış."}
              </p>
              {isOwnProfile && (
                <Link to="/feed">
                  <Button variant="outline" size="sm" className="mt-3">
                    Feed'e Git
                  </Button>
                </Link>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-3 mt-4">
          {myGroups.length > 0 ? (
            myGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  {group.imageUrl ? (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{group.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {group.memberCount} üye · {group.category}
                    </p>
                  </div>
                  <Badge variant="success">Üye</Badge>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">
                {isOwnProfile
                  ? "Henüz bir gruba katılmadınız."
                  : "Henüz bir gruba katılmamış."}
              </p>
              {isOwnProfile && (
                <Link to="/explore">
                  <Button variant="outline" size="sm" className="mt-3">
                    Grupları Keşfet
                  </Button>
                </Link>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="connections" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mockUsers
              .filter((u) => u.id !== profileUser.id)
              .slice(0, 4)
              .map((u) => (
                <Card key={u.id}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Link to={`/profile/${u.id}`}>
                      <Avatar className="w-11 h-11 cursor-pointer">
                        <AvatarImage src={u.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {u.fullName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/profile/${u.id}`}>
                        <p className="font-medium text-sm hover:underline cursor-pointer">
                          {u.fullName}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground truncate">
                        {u.department}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">
                      Bağlantı
                    </Badge>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
