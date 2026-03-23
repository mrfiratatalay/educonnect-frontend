import {
  Calendar,
  MessageCircle,
  TrendingUp,
  Tag,
  Users,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { mockEvents, mockPosts, mockDiscounts } from "@/data/mock";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { openChat } = useChatStore();
  const upcomingEvents = mockEvents.slice(0, 3);
  const recentPosts = mockPosts.slice(0, 3);
  const topDiscounts = mockDiscounts.slice(0, 2);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Günaydın" : hour < 18 ? "İyi günler" : "İyi akşamlar";

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">
            {greeting}, {user?.fullName?.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Bugün kampüste neler oluyor? Bir göz atalım.
          </p>
        </div>
        <Button onClick={openChat} className="gap-2 self-start">
          <Sparkles className="w-4 h-4" />
          AI Asistanına Sor
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Yaklaşan Etkinlik" value="4" trend="+2 bu hafta" />
        <StatCard icon={Users} label="Grup Üyeliği" value="3" />
        <StatCard icon={MessageCircle} label="Feed Paylaşımı" value="156" trend="+12 bugün" />
        <StatCard icon={Tag} label="Aktif İndirim" value="5" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Yaklaşan Etkinlikler
              </CardTitle>
              <Link to="/events">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Tümünü Gör <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
                    <span className="text-xs font-medium">
                      {new Date(event.startDate).toLocaleDateString("tr-TR", { month: "short" })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.startDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{event.location}</p>
                  </div>
                  {event.isRegistered ? (
                    <Badge variant="success" className="shrink-0">Kayıtlı</Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0">Açık</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Son Paylaşımlar
              </CardTitle>
              <Link to="/feed">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Feed'e Git <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={post.userAvatar} />
                    <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{post.userName}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-primary to-indigo-700 text-white border-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6" />
                <h3 className="font-semibold">Görsel Arama</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Bir fotoğraf yükle, benzer ürünleri anında bul!
              </p>
              <Link to="/visual-search">
                <Button variant="secondary" size="sm" className="w-full gap-1">
                  Aramayı Başlat <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-5 h-5 text-accent" />
                Günün İndirimleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topDiscounts.map((d) => (
                <div key={d.id} className="p-3 rounded-xl border bg-accent/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{d.businessName}</span>
                    <Badge variant="accent">%{d.discountRate}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{d.title}</p>
                </div>
              ))}
              <Link to="/discounts">
                <Button variant="ghost" size="sm" className="w-full gap-1 text-xs mt-1">
                  Tüm İndirimleri Gör <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">AI Asistanı</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ders soruları, kampüs bilgileri ve daha fazlası
                  </p>
                </div>
                <Button onClick={openChat} variant="outline" size="sm" className="w-full">
                  Sohbeti Başlat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
