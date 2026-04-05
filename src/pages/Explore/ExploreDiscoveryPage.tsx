import { useMemo, useState, type ReactNode } from "react";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Tabs,
  Typography,
  theme,
} from "antd";
import { Ellipsis, Search, Settings } from "lucide-react";

type ExploreTrendTabKey =
  | "for-you"
  | "campus"
  | "academic"
  | "career"
  | "events";

interface TrendItem {
  id: string;
  tab: Exclude<ExploreTrendTabKey, "for-you">;
  eyebrow: string;
  title: string;
}

const trendItems: TrendItem[] = [
  {
    id: "trend-1",
    tab: "campus",
    eyebrow: "Kampuste gundemde",
    title: "#FinalHaftasiHayattaKalma",
  },
  {
    id: "trend-2",
    tab: "academic",
    eyebrow: "Akademik · Gundemdekiler",
    title: "Bitirme proje sunum tarihleri",
  },
  {
    id: "trend-3",
    tab: "campus",
    eyebrow: "Kampuste gundemde",
    title: "Yemekhane menusu degisti",
  },
  {
    id: "trend-4",
    tab: "events",
    eyebrow: "Etkinlikler · Gundemdekiler",
    title: "Bahar senligi kayitlari",
  },
  {
    id: "trend-5",
    tab: "career",
    eyebrow: "Kariyer · Gundemdekiler",
    title: "Yaz staji basvurulari",
  },
  {
    id: "trend-6",
    tab: "academic",
    eyebrow: "Akademik · Gundemdekiler",
    title: "Lab telafi programi",
  },
  {
    id: "trend-7",
    tab: "events",
    eyebrow: "Etkinlikler · Gundemdekiler",
    title: "IEEE workshop serisi",
  },
  {
    id: "trend-8",
    tab: "career",
    eyebrow: "Kariyer · Gundemdekiler",
    title: "#CVHazirlamaAtolyesi",
  },
  {
    id: "trend-9",
    tab: "campus",
    eyebrow: "Kampuste gundemde",
    title: "Kutuphane gece acik kalacak",
  },
  {
    id: "trend-10",
    tab: "academic",
    eyebrow: "Akademik · Gundemdekiler",
    title: "Vize cozum oturumlari",
  },
];

const followItems = [
  {
    id: "follow-1",
    name: "Bilgisayar Muh. Kulubu",
    handle: "@bmkulubu",
    avatarSeed: "BMKulubu",
  },
  {
    id: "follow-2",
    name: "Kampus Duyurular",
    handle: "@kampusduyuru",
    avatarSeed: "KampusDuyuru",
  },
  {
    id: "follow-3",
    name: "Kariyer Merkezi",
    handle: "@kariyermerkezi",
    avatarSeed: "KariyerMerkezi",
  },
];

const footerLinks = [
  "Hizmet Sartlari",
  "Gizlilik Politikasi",
  "Cerez Politikasi",
  "Imprint",
  "Erisilebilirlik",
  "Reklam bilgisi",
  "Daha fazla ...",
];

export default function ExploreDiscoveryPage() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ExploreTrendTabKey>("for-you");
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();

  const isDesktop = !!screens.xl;
  const isDarkMode = token.colorBgBase === "#000000";
  const shellBorderColor = token.colorBorderSecondary;
  const stickyBackground = isDarkMode
    ? "rgba(0, 0, 0, 0.84)"
    : "rgba(255, 255, 255, 0.84)";
  const sidebarSurface = isDarkMode ? "#16181C" : "#FFFFFF";

  const filteredItems = useMemo(() => {
    const scopedItems =
      activeTab === "for-you"
        ? trendItems
        : trendItems.filter((item) => item.tab === activeTab);
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return scopedItems;
    }

    return scopedItems.filter((item) =>
      `${item.eyebrow} ${item.title}`.toLowerCase().includes(normalizedQuery),
    );
  }, [activeTab, query]);

  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: "0 16px" }}>
      <Flex align="flex-start">
        <div style={{ flex: 1, maxWidth: 600, minWidth: 0 }}>
          <div
            style={{
              minHeight: "100vh",
              background: token.colorBgContainer,
              borderInline: `1px solid ${shellBorderColor}`,
            }}
          >
            <Affix offsetTop={0}>
              <div
                style={{
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
                  style={{ padding: "8px 12px 10px 16px" }}
                >
                  <Input
                    size="large"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ara"
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
                    }}
                    icon={<Settings size={18} />}
                  />
                </Flex>

                <Tabs
                  activeKey={activeTab}
                  onChange={(value) => setActiveTab(value as ExploreTrendTabKey)}
                  size="large"
                  tabBarGutter={24}
                  indicator={{ size: 72, align: "center" }}
                  tabBarStyle={{
                    margin: 0,
                    paddingInline: 16,
                    borderBottom: "none",
                  }}
                  items={[
                    {
                      key: "for-you",
                      label: (
                        <span style={{ fontWeight: activeTab === "for-you" ? 800 : 700 }}>
                          Sana Ozel
                        </span>
                      ),
                    },
                    {
                      key: "campus",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "campus" ? 800 : 700,
                          }}
                        >
                          Kampus Gundemi
                        </span>
                      ),
                    },
                    {
                      key: "academic",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "academic" ? 800 : 700,
                          }}
                        >
                          Akademik
                        </span>
                      ),
                    },
                    {
                      key: "career",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "career" ? 800 : 700,
                          }}
                        >
                          Kariyer
                        </span>
                      ),
                    },
                    {
                      key: "events",
                      label: (
                        <span
                          style={{
                            fontWeight: activeTab === "events" ? 800 : 700,
                          }}
                        >
                          Etkinlikler
                        </span>
                      ),
                    },
                  ]}
                />
              </div>
            </Affix>

            <Flex vertical>
              {filteredItems.map((item) => (
                <TrendRow
                  key={item.id}
                  item={item}
                  borderColor={shellBorderColor}
                />
              ))}
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
                {followItems.map((item) => (
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
                      >
                        Takip et
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
                {footerLinks.map((item) => (
                  <Typography.Text
                    key={item}
                    type="secondary"
                    style={{ fontSize: 13 }}
                  >
                    {item}
                  </Typography.Text>
                ))}
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  © 2026 X Corp.
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
}: {
  item: TrendItem;
  borderColor: string;
}) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        padding: "12px 16px 14px",
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Flex justify="space-between" align="flex-start" gap={12}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Typography.Text
            type="secondary"
            style={{ display: "block", fontSize: 14 }}
          >
            {item.eyebrow}
          </Typography.Text>
          <Typography.Text
            strong
            style={{
              display: "block",
              fontSize: 17,
              lineHeight: 1.35,
              marginTop: 2,
              color: token.colorText,
            }}
          >
            {item.title}
          </Typography.Text>
        </div>

        <Ellipsis size={18} color={token.colorTextTertiary} />
      </Flex>
    </div>
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
