import { useDeferredValue, useState, type KeyboardEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Skeleton,
  Tabs,
  Typography,
  theme,
} from "antd";
import { Ellipsis, Search, Settings } from "lucide-react";
import { useExploreDiscoveryQuery } from "@/features/explore/hooks";
import type { ExploreTrendItem, ExploreTrendTabKey } from "@/features/explore/types";
import {
  exploreDiscoveryTabs,
  exploreFooterLinks,
} from "@/pages/Explore/exploreDiscoveryData";

export default function ExploreDiscoveryPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ExploreTrendTabKey>("for-you");
  const deferredQuery = useDeferredValue(query);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const isDesktop = !!screens.xl;
  const isTablet = !!screens.md;
  const isDarkMode = token.colorBgBase === "#000000";
  const shellBorderColor = token.colorBorderSecondary;
  const stickyBackground = isDarkMode
    ? "rgba(0, 0, 0, 0.84)"
    : "rgba(255, 255, 255, 0.84)";
  const sidebarSurface = isDarkMode ? "#16181C" : "#FFFFFF";
  const pageHorizontalPadding = isTablet ? 16 : 0;
  const activeTabLabel =
    exploreDiscoveryTabs.find((tab) => tab.key === activeTab)?.label ?? "Kesfet";
  const discoveryQuery = useExploreDiscoveryQuery({
    tab: activeTab,
    query: deferredQuery.trim() || undefined,
  });
  const trends = discoveryQuery.data?.trends ?? [];
  const suggestions = discoveryQuery.data?.suggestions ?? [];

  return (
    <div
      style={{
        maxWidth: 990,
        margin: "0 auto",
        paddingInline: pageHorizontalPadding,
      }}
    >
      <Flex align="flex-start">
        <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>
          <div
            style={{
              minHeight: "100vh",
              background: token.colorBgContainer,
              borderInline: `1px solid ${shellBorderColor}`,
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                background: stickyBackground,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: `1px solid ${shellBorderColor}`,
                zIndex: 10,
              }}
            >
              <Flex
                align="center"
                gap={12}
                style={{ padding: isTablet ? "8px 12px 10px 16px" : "8px 12px 10px" }}
              >
                <Input
                  allowClear
                  size="large"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={getSearchPlaceholder(activeTab)}
                  prefix={
                    <Search
                      size={18}
                      style={{ color: token.colorTextTertiary }}
                    />
                  }
                  variant="outlined"
                  style={{
                    flex: 1,
                    borderRadius: 999,
                  }}
                />

                <Button
                  type="text"
                  shape="circle"
                  aria-label="Kesfet ayarlari"
                  style={{
                    width: 36,
                    height: 36,
                    color: token.colorText,
                    border: `1px solid ${shellBorderColor}`,
                    background: token.colorBgContainer,
                  }}
                  icon={<Settings size={18} />}
                />
              </Flex>

              <Tabs
                activeKey={activeTab}
                onChange={(value) => setActiveTab(value as ExploreTrendTabKey)}
                size="large"
                tabBarGutter={isTablet ? 24 : 14}
                indicator={{ size: isTablet ? 72 : 56, align: "center" }}
                tabBarStyle={{
                  margin: 0,
                  paddingInline: isTablet ? 16 : 12,
                  borderBottom: "none",
                }}
                items={exploreDiscoveryTabs.map((tab) => ({
                  key: tab.key,
                  label: (
                    <span
                      style={{
                        display: "inline-block",
                        fontWeight: activeTab === tab.key ? 800 : 700,
                        fontSize: 15,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tab.label}
                    </span>
                  ),
                }))}
              />
            </div>

            <Flex vertical>
              {discoveryQuery.isLoading ? (
                <ExploreTrendLoadingState borderColor={shellBorderColor} />
              ) : discoveryQuery.error instanceof Error ? (
                <div style={{ padding: 16 }}>
                  <Alert
                    message={discoveryQuery.error.message}
                    showIcon
                    type="error"
                  />
                </div>
              ) : trends.length > 0 ? (
                trends.map((item) => (
                  <TrendRow
                    key={item.id}
                    item={item}
                    borderColor={shellBorderColor}
                    onOpen={(targetPath) => navigate(targetPath)}
                  />
                ))
              ) : (
                <ExploreTrendEmptyState query={query} tabLabel={activeTabLabel} />
              )}
            </Flex>
          </div>
        </div>

        {isDesktop && (
          <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
            <div style={{ position: "sticky", top: 12 }}>
              <div
                style={{
                  borderTop: `1px solid ${token.colorBorderSecondary}`,
                  marginBottom: 20,
                }}
              />

              <SidebarCard title="Kimi takip etmeli" background={sidebarSurface}>
                {suggestions.map((item) => (
                  <SidebarRow key={item.id}>
                    <Flex align="center" gap={12} style={{ width: "100%" }}>
                      <Avatar
                        size={48}
                        src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${item.avatarSeed}`}
                        style={{
                          flexShrink: 0,
                          background: token.colorPrimaryBg,
                          color: token.colorPrimary,
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <Typography.Text
                          strong
                          ellipsis
                          style={{ display: "block", fontSize: 15 }}
                        >
                          {item.name}
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          ellipsis
                          style={{ display: "block", fontSize: 15 }}
                        >
                          {item.handle}
                        </Typography.Text>
                      </div>

                      <Button
                        color="default"
                        variant="solid"
                        shape="round"
                        style={{
                          height: 36,
                          paddingInline: 16,
                          border: "none",
                          background: "#111827",
                          color: "#FFFFFF",
                          fontWeight: 800,
                        }}
                        onClick={() => navigate(item.targetPath)}
                      >
                        {item.ctaLabel}
                      </Button>
                    </Flex>
                  </SidebarRow>
                ))}

                <Typography.Link style={{ padding: "0 16px 16px", fontSize: 15 }}>
                  Daha fazla goster
                </Typography.Link>
              </SidebarCard>

              <Flex
                wrap
                gap={8}
                style={{ padding: "16px 12px 0", maxWidth: 320 }}
              >
                {exploreFooterLinks.map((item) => (
                  <Typography.Text
                    key={item}
                    type="secondary"
                    style={{ fontSize: 13 }}
                  >
                    {item}
                  </Typography.Text>
                ))}
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  (c) 2026 EduConnect Corp.
                </Typography.Text>
              </Flex>
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
}

function TrendRow({
  item,
  borderColor,
  onOpen,
}: {
  item: ExploreTrendItem;
  borderColor: string;
  onOpen: (targetPath: string) => void;
}) {
  const { token } = theme.useToken();
  const [isHovered, setIsHovered] = useState(false);
  const isDarkMode = token.colorBgBase === "#000000";
  const hoverBackground = isDarkMode ? "#080B0F" : "#F7F9F9";
  const controlHoverBackground = isDarkMode ? "rgba(231, 233, 234, 0.1)" : "#EFF3F4";

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(item.targetPath);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item.targetPath)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label={`${item.contextLabel} ${item.title}`}
      style={{
        background: isHovered ? hoverBackground : "transparent",
        padding: "12px 16px 14px",
        borderBottom: `1px solid ${borderColor}`,
        cursor: "pointer",
        minHeight: 88,
        transition: "background-color 120ms ease, box-shadow 120ms ease",
        boxShadow: isHovered ? `inset 0 0 0 1px ${borderColor}` : "none",
      }}
    >
      <Flex justify="space-between" align="flex-start" gap={12}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 13, lineHeight: 1.3 }}
          >
            {item.contextLabel}
          </Typography.Text>
          <Typography.Paragraph
            style={{
              margin: "2px 0 0",
              fontSize: 18,
              lineHeight: 1.35,
              fontWeight: 800,
              color: token.colorText,
            }}
            ellipsis={{ rows: 2 }}
          >
            {item.title}
          </Typography.Paragraph>
          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 13, marginTop: 2 }}
          >
            {item.metricLabel}
          </Typography.Text>
        </div>

        <div
          aria-hidden
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            height: 30,
            borderRadius: 999,
            background: isHovered ? controlHoverBackground : "transparent",
            color: token.colorTextTertiary,
            flexShrink: 0,
            transition: "background-color 120ms ease",
          }}
        >
          <Ellipsis size={18} />
        </div>
      </Flex>
    </div>
  );
}

function ExploreTrendEmptyState({
  query,
  tabLabel,
}: {
  query: string;
  tabLabel: string;
}) {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={10}
      style={{ padding: "56px 24px 64px", textAlign: "center" }}
    >
      <Typography.Title level={5} style={{ margin: 0 }}>
        Trend bulunamadi
      </Typography.Title>
      <Typography.Text type="secondary" style={{ maxWidth: 320 }}>
        {query.trim()
          ? "Farkli bir kelime dene veya diger sekmelere gec."
          : `${tabLabel} sekmesinde gosterecek guncel bir trend yok.`}
      </Typography.Text>
    </Flex>
  );
}

function ExploreTrendLoadingState({ borderColor }: { borderColor: string }) {
  return (
    <Flex vertical>
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={`explore-skeleton-${index}`}
          style={{ padding: "14px 16px", borderBottom: `1px solid ${borderColor}` }}
        >
          <Skeleton active title={{ width: "48%" }} paragraph={{ rows: 2 }} />
        </div>
      ))}
    </Flex>
  );
}

function SidebarCard({
  title,
  background,
  children,
}: {
  title: string;
  background: string;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      variant="outlined"
      style={{
        background,
        overflow: "hidden",
        borderRadius: 24,
        borderColor: token.colorBorderSecondary,
      }}
      styles={{ body: { padding: 0 } }}
    >
      <Flex vertical gap={2}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            padding: "14px 16px 8px",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </Typography.Title>
        {children}
      </Flex>
    </Card>
  );
}

function SidebarRow({ children }: { children: ReactNode }) {
  return <div style={{ padding: "10px 16px" }}>{children}</div>;
}

function getSearchPlaceholder(tab: ExploreTrendTabKey) {
  switch (tab) {
    case "academic":
      return "Ders, sinav veya tez ara";
    case "career":
      return "Staj, kariyer veya cv ara";
    case "events":
      return "Etkinlik veya workshop ara";
    case "campus":
      return "Kampuste ne konusuluyor ara";
    default:
      return "Ara";
  }
}
