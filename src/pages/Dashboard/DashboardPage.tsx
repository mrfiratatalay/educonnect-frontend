import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Flex,
  Grid,
  Row,
  Typography,
  theme,
} from "antd";
import { Calendar, MessageCircle, PartyPopper, Sparkles, Tag, Users } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useEventsQuery } from "@/features/events/hooks";
import { getUpcomingEvents } from "@/features/events/utils";
import { useGroupsQuery } from "@/features/groups/hooks";
import { usePostsQuery } from "@/features/posts/hooks";
import { mockDiscounts } from "@/data/mock";
import DashboardHighlightsColumn from "@/pages/Dashboard/components/DashboardHighlightsColumn";
import DashboardRecentPostsCard from "@/pages/Dashboard/components/DashboardRecentPostsCard";
import DashboardStatCard from "@/pages/Dashboard/components/DashboardStatCard";
import DashboardUpcomingEventsCard from "@/pages/Dashboard/components/DashboardUpcomingEventsCard";
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
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();

  const upcomingEvents = getUpcomingEvents(eventsQuery.data ?? []);
  const recentPosts = postsQuery.data?.items ?? [];
  const topDiscounts = mockDiscounts.slice(0, 2);
  const firstName = getFirstName(user?.fullName);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Gunaydin" : hour < 18 ? "Iyi gunler" : "Iyi aksamlar";
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setShowWelcome(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const statItems = [
    {
      icon: Calendar,
      label: "Yaklasan Etkinlik",
      value: upcomingEvents.length,
      loading: eventsQuery.isLoading,
      accentBackground: "rgba(59, 130, 246, 0.12)",
      accentColor: "#2563eb",
    },
    {
      icon: Users,
      label: "Grup Uyeligi",
      value: (groupsQuery.data ?? []).filter((group) => group.isMember).length,
      loading: groupsQuery.isLoading,
      accentBackground: "rgba(124, 58, 237, 0.12)",
      accentColor: "#7c3aed",
    },
    {
      icon: MessageCircle,
      label: "Feed Paylasimi",
      value: postsQuery.data?.totalCount ?? 0,
      loading: postsQuery.isLoading,
      accentBackground: "rgba(16, 185, 129, 0.12)",
      accentColor: "#059669",
    },
    {
      icon: Tag,
      label: "Aktif Indirim",
      value: mockDiscounts.filter((discount) => discount.isActive).length,
      accentBackground: "rgba(245, 158, 11, 0.12)",
      accentColor: "#d97706",
    },
  ] as const;

  return (
    <div
      style={{
        maxWidth: 1280,
        margin: "0 auto",
        padding: pagePadding,
      }}
    >
      <Flex vertical gap={24}>
        {showWelcome && (
          <Alert
            type="success"
            showIcon
            icon={<PartyPopper size={18} />}
            title={`Hos geldin, ${firstName}!`}
            description="EduConnect'e katildin. Kampusu kesfetmeye basla."
            action={
              <Button type="text" onClick={() => setShowWelcome(false)}>
                Kapat
              </Button>
            }
          />
        )}

        <Flex
          align={screens.sm ? "center" : "flex-start"}
          justify="space-between"
          gap={16}
          wrap="wrap"
        >
          <div>
            <Typography.Title
              level={screens.lg ? 2 : 3}
              style={{ margin: 0, color: token.colorText }}
            >
              {greeting}, <span style={{ color: token.colorPrimary }}>{firstName}</span>
            </Typography.Title>
            <Typography.Paragraph
              type="secondary"
              style={{ margin: "8px 0 0", maxWidth: 640 }}
            >
              Bugun kampuste neler oluyor? Etkinlikleri, son paylasimlari ve ogrenci
              firsatlarini tek yerden takip edin.
            </Typography.Paragraph>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<Sparkles size={16} />}
            onClick={openChat}
          >
            AI Asistanina Sor
          </Button>
        </Flex>

        <Row gutter={[16, 16]}>
          {statItems.map((item) => (
            <Col key={item.label} xs={12} xl={6}>
              <DashboardStatCard {...item} />
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} xl={16}>
            <Flex vertical gap={16}>
              <DashboardUpcomingEventsCard
                events={upcomingEvents}
                errorMessage={
                  eventsQuery.error instanceof Error ? eventsQuery.error.message : undefined
                }
                isLoading={eventsQuery.isLoading}
              />

              <DashboardRecentPostsCard
                errorMessage={
                  postsQuery.error instanceof Error ? postsQuery.error.message : undefined
                }
                isLoading={postsQuery.isLoading}
                posts={recentPosts}
              />
            </Flex>
          </Col>

          <Col xs={24} xl={8}>
            <DashboardHighlightsColumn
              discounts={topDiscounts}
              onOpenChat={openChat}
            />
          </Col>
        </Row>
      </Flex>
    </div>
  );
}

function getFirstName(fullName?: string) {
  const trimmed = fullName?.trim();

  if (!trimmed) {
    return "Arkadasim";
  }

  return trimmed.split(/\s+/)[0];
}
