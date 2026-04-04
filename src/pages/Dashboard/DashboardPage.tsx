import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  MessageCircle,
  PartyPopper,
  Search,
  Sparkles,
  Tag,
  Users,
  X,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventsQuery } from "@/features/events/hooks";
import { getUpcomingEvents } from "@/features/events/utils";
import { useGroupsQuery } from "@/features/groups/hooks";
import { usePostsQuery } from "@/features/posts/hooks";
import { getPostExcerpt } from "@/features/posts/utils";
import { mockDiscounts } from "@/data/mock";
import DashboardUpcomingEventsCard from "@/pages/Dashboard/components/DashboardUpcomingEventsCard";
import DashboardStatCard from "@/pages/Dashboard/components/DashboardStatCard";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const openChat = useChatStore((state) => state.openChat);
  const eventsQuery = useEventsQuery();
  const groupsQuery = useGroupsQuery();
  const postsQuery = usePostsQuery({ page: 1, pageSize: 3 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [showWelcome, setShowWelcome] = useState(false);

  const upcomingEvents = getUpcomingEvents(eventsQuery.data ?? []);
  const recentPosts = postsQuery.data?.items ?? [];
  const topDiscounts = mockDiscounts.slice(0, 2);

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShowWelcome(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Gunaydin" : hour < 18 ? "Iyi gunler" : "Iyi aksamlar";

  return (
    <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {showWelcome && (
        <div className="relative flex items-center gap-3 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-indigo-500/10 p-4">
          <PartyPopper className="w-8 h-8 text-primary shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">
              Hos geldin, {user?.fullName?.split(" ")[0]}!
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              EduConnect'e katildin. Kampusu kesfetmeye basla!
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowWelcome(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            {greeting},{" "}
            <span className="text-primary">{user?.fullName?.split(" ")[0]}</span>
            !
          </h1>
          <p className="mt-1 text-sm text-muted-foreground lg:text-base">
            Bugun kampuste neler oluyor? Bir goz atalim.
          </p>
        </div>

        <Button onClick={openChat} className="gap-2 self-start shadow-sm">
          <Sparkles className="w-4 h-4" />
          AI Asistanina Sor
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <DashboardStatCard
          icon={Calendar}
          label="Yaklasan Etkinlik"
          value={eventsQuery.isLoading ? "-" : String(upcomingEvents.length)}
          color="bg-blue-500/10 text-blue-600"
        />
        <DashboardStatCard
          icon={Users}
          label="Grup Uyeligi"
          value={
            groupsQuery.isLoading
              ? "-"
              : String((groupsQuery.data ?? []).filter((group) => group.isMember).length)
          }
          color="bg-violet-500/10 text-violet-600"
        />
        <DashboardStatCard
          icon={MessageCircle}
          label="Feed Paylasimi"
          value={postsQuery.isLoading ? "-" : String(postsQuery.data?.totalCount ?? 0)}
          color="bg-emerald-500/10 text-emerald-600"
        />
        <DashboardStatCard
          icon={Tag}
          label="Aktif Indirim"
          value={String(mockDiscounts.filter((discount) => discount.isActive).length)}
          color="bg-amber-500/10 text-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="space-y-4 lg:col-span-2 lg:space-y-6">
          <DashboardUpcomingEventsCard
            events={upcomingEvents}
            errorMessage={
              eventsQuery.error instanceof Error ? eventsQuery.error.message : undefined
            }
            isLoading={eventsQuery.isLoading}
          />

          <Card className="hover:shadow-none">
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageCircle className="w-5 h-5 text-primary" />
                Son Paylasimlar
              </CardTitle>
              <Link to="/feed">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Feed'e Git <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardHeader>

            <CardContent className="space-y-2">
              {postsQuery.isLoading && (
                <div className="rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
                  Paylasimlar yukleniyor...
                </div>
              )}

              {!postsQuery.isLoading && recentPosts.length === 0 && (
                <div className="rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
                  Henuz paylasim bulunmuyor.
                </div>
              )}

              {recentPosts.map((post) => (
                <Link to="/feed" key={post.id}>
                  <div className="flex cursor-pointer items-start gap-3 rounded-xl bg-secondary/40 p-3 transition-colors hover:bg-secondary/70">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarImage src={post.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {post.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{post.userName}</p>
                        <span className="text-[11px] text-muted-foreground">
                          - {post.likesCount} begeni
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                        {getPostExcerpt(post.content, 110)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

              {postsQuery.isError && (
                <p className="text-xs text-destructive">
                  Feed verisi simdilik alinamadi.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary to-indigo-700 text-white hover:shadow-none">
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/5" />
            <CardContent className="relative p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="font-semibold">Gorsel Arama</h3>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-white/75">
                Bir fotograf yukle, AI ile benzer urunleri aninda bul.
              </p>
              <Link to="/visual-search">
                <Button variant="secondary" size="sm" className="w-full gap-1">
                  Aramayi Baslat <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Tag className="w-5 h-5 text-accent" />
                Gunun Indirimleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {topDiscounts.map((discount) => (
                <div
                  key={discount.id}
                  className="space-y-1 rounded-xl border border-accent/10 bg-accent/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {discount.businessName}
                    </span>
                    <Badge variant="accent">%{discount.discountRate}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{discount.title}</p>
                </div>
              ))}
              <Link to="/explore?tab=discounts">
                <Button variant="ghost" size="sm" className="mt-1 w-full gap-1 text-xs">
                  Tum Indirimleri Gor <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-none">
            <CardContent className="p-5">
              <div className="space-y-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">AI Asistani</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ders sorulari, kampus bilgileri ve daha fazlasi
                  </p>
                </div>
                <Button onClick={openChat} variant="outline" size="sm" className="w-full">
                  Sohbeti Baslat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
