import {
  Mail,
  GraduationCap,
  Calendar,
  Edit2,
  ShoppingBag,
  MessageSquare,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { mockPosts, mockProducts, mockGroups } from "@/data/mock";

const roleLabels: Record<string, string> = {
  student: "Öğrenci",
  admin: "Yönetici",
  moderator: "Moderatör",
};

export default function ProfilePage() {
  const { user } = useAuthStore();
  const myPosts = mockPosts.filter((p) => p.userId === user?.id);
  const myProducts = mockProducts.filter((p) => p.sellerName === user?.fullName);
  const myGroups = mockGroups.filter((g) => g.isMember);

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      <Card className="overflow-hidden">
        <div className="h-32 sm:h-44 bg-gradient-to-r from-primary via-indigo-500 to-indigo-800 relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1200&h=400&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30" />
        </div>
        <CardContent className="relative px-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-14">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback className="text-2xl">{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">{user?.fullName}</h1>
                  <Badge variant="secondary" className="mt-1">
                    {roleLabels[user?.role || "student"]}
                  </Badge>
                </div>
                <Link to="/settings">
                  <Button variant="outline" size="sm" className="gap-1.5 self-start">
                    <Edit2 className="w-3.5 h-3.5" />
                    Profili Düzenle
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {user?.bio && (
            <p className="text-sm text-muted-foreground mt-4">{user.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              {user?.department} - {user?.year}. Sınıf
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              {user?.email}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(user?.createdAt || "").toLocaleDateString("tr-TR", {
                month: "long",
                year: "numeric",
              })}{" "}
              tarihinden beri üye
            </span>
          </div>

          <Separator className="my-5" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{myPosts.length}</p>
              <p className="text-xs text-muted-foreground">Gönderi</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{myProducts.length}</p>
              <p className="text-xs text-muted-foreground">İlan</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{myGroups.length}</p>
              <p className="text-xs text-muted-foreground">Grup</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="posts" className="gap-1.5">
            <MessageSquare className="w-4 h-4" />
            Gönderilerim
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            İlanlarım
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-1.5">
            <Users className="w-4 h-4" />
            Gruplarım
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-3 mt-4">
          {myPosts.length > 0 ? (
            myPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-4">
                  <p className="text-sm">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {post.likesCount} beğeni · {post.commentsCount} yorum
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>Henüz gönderi paylaşmadınız.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          {myProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {myProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full aspect-square object-cover"
                  />
                  <CardContent className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-primary font-bold mt-1">{product.price} TL</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>Henüz ilan vermediniz.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="groups" className="space-y-3 mt-4">
          {myGroups.length > 0 ? (
            myGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  {group.imageUrl && (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
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
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p>Henüz bir gruba katılmadınız.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
