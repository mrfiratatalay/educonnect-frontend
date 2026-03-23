import {
  Calendar,
  MessageCircle,
  TrendingUp,
  Tag,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { mockEvents, mockPosts, mockDiscounts, mockGroups } from "@/data/mock";

function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  color?: string;
}) {
  return (
    <Card className="hover:shadow-none">
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs lg:text-sm text-muted-foreground font-medium">
              {label}
            </p>
            <p className="text-xl lg:text-2xl font-bold tracking-tight">
              {value}
            </p>
            {trend && (
              <p className="text-[11px] text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${color || "bg-primary/10 text-primary"}`}
          >
            <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
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
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {greeting},{" "}
            <span className="text-primary">
              {user?.fullName?.split(" ")[0]}
            </span>
            !
          </h1>
          <p className="text-muted-foreground mt-1 text-sm lg:text-base">
            Bugün kampüste neler oluyor? Bir göz atalım.
          </p>
        </div>
        <Button onClick={openChat} className="gap-2 self-start shadow-sm">
          <Sparkles className="w-4 h-4" />
          AI Asistanına Sor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          icon={Calendar}
          label="Yaklaşan Etkinlik"
          value={String(mockEvents.length)}
          trend="+2 bu hafta"
          color="bg-blue-500/10 text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Grup Üyeliği"
          value={String(mockGroups.filter((g) => g.isMember).length)}
          color="bg-violet-500/10 text-violet-600"
        />
        <StatCard
          icon={MessageCircle}
          label="Feed Paylaşımı"
          value={String(mockPosts.length)}
          trend="+12 bugün"
          color="bg-emerald-500/10 text-emerald-600"
        />
        <StatCard
          icon={Tag}
          label="Aktif İndirim"
          value={String(mockDiscounts.filter((d) => d.isActive).length)}
          color="bg-amber-500/10 text-amber-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          {/* Upcoming Events */}
          <Card className="hover:shadow-none">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="w-5 h-5 text-primary" />
                Yaklaşan Etkinlikler
              </CardTitle>
              <Link to="/events">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Tümünü Gör <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
                    <span className="text-[10px] font-semibold uppercase">
                      {new Date(event.startDate).toLocaleDateString("tr-TR", {
                        month: "short",
                      })}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {new Date(event.startDate).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(event.startDate).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                  {event.isRegistered ? (
                    <Badge variant="success" className="shrink-0 text-[10px]">
                      Kayıtlı
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="shrink-0 text-[10px]">
                      Açık
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="hover:shadow-none">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="w-5 h-5 text-primary" />
                Son Paylaşımlar
              </CardTitle>
              <Link to="/feed">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Feed'e Git <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-secondary/40 hover:bg-secondary/70 transition-colors cursor-pointer"
                >
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarImage src={post.userAvatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {post.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{post.userName}</p>
                      <span className="text-[11px] text-muted-foreground">
                        · {post.likesCount} beğeni
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {post.content}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-4 lg:space-y-6">
          {/* Visual Search CTA */}
          <Card className="bg-gradient-to-br from-primary to-indigo-700 text-white border-0 overflow-hidden relative hover:shadow-none">
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
            <CardContent className="p-5 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Görsel Arama</h3>
              </div>
              <p className="text-sm text-white/75 mb-4 leading-relaxed">
                Bir fotoğraf yükle, AI ile benzer ürünleri anında bul!
              </p>
              <Link to="/visual-search">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full gap-1"
                >
                  Aramayı Başlat <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Discounts */}
          <Card className="hover:shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-5 h-5 text-accent" />
                Günün İndirimleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topDiscounts.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-accent/5 border border-accent/10 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">
                      {d.businessName}
                    </span>
                    <Badge variant="accent">%{d.discountRate}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{d.title}</p>
                </div>
              ))}
              <Link to="/discounts">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1 text-xs mt-1"
                >
                  Tüm İndirimleri Gör <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Assistant CTA */}
          <Card className="hover:shadow-none">
            <CardContent className="p-5">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AI Asistanı</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ders soruları, kampüs bilgileri ve daha fazlası
                  </p>
                </div>
                <Button
                  onClick={openChat}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
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
