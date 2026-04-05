import { useMemo, useState, type ReactNode } from "react";
import {
  Affix,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Image,
  Input,
  Typography,
  theme,
} from "antd";
import {
  ArrowLeft,
  Bookmark,
  ChartColumn,
  Ellipsis,
  EyeOff,
  Heart,
  MessageCircle,
  Repeat2,
  Search,
  Share,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const bookmarkedItems = [
  {
    id: "bookmark-1",
    author: "Anubhav",
    handle: "@anubhavthing",
    dateLabel: "30 Mar",
    avatarSeed: "Anubhav",
    content:
      "This reddit post is literally GOLD\n\nA founder who's SaaS hit 9K/M shared his resources of what worked for him and what did not.\n\nHere is what worked:",
    previewTitle:
      "my saas hit $9k/month in 12 months. here's what worked and what was a complete waste of time",
    previewBody:
      "A concise breakdown of the experiments, channels and systems that actually moved the needle versus what only kept the team busy.",
    previewImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=700&fit=crop",
    metrics: {
      replies: "12",
      reposts: "45",
      likes: "675",
      views: "83 B",
    },
  },
  {
    id: "bookmark-2",
    author: "m0",
    handle: "@moulougueta",
    dateLabel: "30 Mar",
    avatarSeed: "m0",
    content: "This looks like a nice feature.",
    previewTitle:
      "I built a new plugin! You can now trigger Codex from Claude Code!",
    previewBody:
      "Use the Codex plugin for Claude Code to delegate tasks to Codex or have Codex review your changes using your ChatGPT subscription.",
    previewImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=700&fit=crop",
    metrics: {
      replies: "8",
      reposts: "19",
      likes: "241",
      views: "12 B",
    },
  },
];

const trendItems = [
  {
    id: "trend-1",
    category: "Spor · Gundemdekiler",
    title: "#TSvGS",
  },
  {
    id: "trend-2",
    category: "Spor · Gundemdekiler",
    title: "Ugurcan",
  },
  {
    id: "trend-3",
    category: "Spor · Gundemdekiler",
    title: "#Samsunspor",
  },
  {
    id: "trend-4",
    category: "Turkiye tarihinde gundemde",
    title: "dilara kirmit",
  },
];

const followItems = [
  {
    id: "follow-1",
    name: "Victor Enengedi",
    handle: "@kuffz999",
    avatarSeed: "VictorEnengedi",
  },
  {
    id: "follow-2",
    name: "HORLA",
    handle: "@horlayinka351",
    avatarSeed: "Horla",
  },
  {
    id: "follow-3",
    name: "SolidJS",
    handle: "@solid_js",
    avatarSeed: "SolidJS",
  },
];

export default function BookmarksPage() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();

  const isDesktop = !!screens.xl;
  const isDarkMode = token.colorBgBase === "#000000";
  const shellBorderColor = token.colorBorderSecondary;
  const stickyBackground = isDarkMode
    ? "rgba(0, 0, 0, 0.82)"
    : "rgba(255, 255, 255, 0.82)";
  const sidebarSurface = isDarkMode ? "#16181C" : "#F7F9F9";

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return bookmarkedItems;
    }

    return bookmarkedItems.filter((item) =>
      `${item.author} ${item.handle} ${item.content} ${item.previewTitle} ${item.previewBody}`
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

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
                  gap={18}
                  style={{ padding: "8px 16px 6px" }}
                >
                  <Button
                    type="text"
                    shape="circle"
                    aria-label="Geri don"
                    style={{
                      width: 36,
                      height: 36,
                      color: token.colorText,
                    }}
                    icon={<ArrowLeft size={18} />}
                    onClick={() => navigate(-1)}
                  />

                  <Typography.Title
                    level={3}
                    style={{
                      margin: 0,
                      fontSize: 31,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    Yer Isaretleri
                  </Typography.Title>
                </Flex>

                <div style={{ padding: "0 16px 14px" }}>
                  <Input
                    size="large"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Yer Isaretlerinde Ara"
                    prefix={
                      <Search
                        size={18}
                        style={{ color: token.colorTextTertiary }}
                      />
                    }
                    variant="outlined"
                    style={{
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>
            </Affix>

            {filteredItems.length === 0 ? (
              <Flex
                vertical
                justify="center"
                style={{
                  minHeight: "calc(100vh - 142px)",
                  padding: "56px 32px",
                }}
              >
                <div style={{ maxWidth: 360 }}>
                  <Typography.Title
                    level={1}
                    style={{
                      margin: 0,
                      fontSize: 46,
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      fontWeight: 900,
                    }}
                  >
                    Kayitli bir sey bulunamadi.
                  </Typography.Title>
                  <Typography.Paragraph
                    type="secondary"
                    style={{
                      marginTop: 14,
                      marginBottom: 0,
                      fontSize: 18,
                      lineHeight: 1.45,
                    }}
                  >
                    Aramani degistir ya da daha sonra tekrar kontrol et.
                  </Typography.Paragraph>
                </div>
              </Flex>
            ) : (
              <Flex vertical>
                {filteredItems.map((item) => (
                  <BookmarkItemCard
                    key={item.id}
                    item={item}
                    borderColor={shellBorderColor}
                  />
                ))}
              </Flex>
            )}
          </div>
        </div>

        {isDesktop && (
          <div style={{ width: 350, flexShrink: 0, paddingLeft: 32 }}>
            <div style={{ position: "sticky", top: 12 }}>
              <Flex vertical gap={16}>
                <Input
                  size="large"
                  placeholder="Ara"
                  prefix={
                    <Search
                      size={18}
                      style={{ color: token.colorTextTertiary }}
                    />
                  }
                  variant="filled"
                  style={{
                    borderRadius: 999,
                    background: sidebarSurface,
                  }}
                />

                <SidebarCard title="Neler oluyor?" background={sidebarSurface}>
                  {trendItems.map((item) => (
                    <SidebarRow key={item.id}>
                      <Flex justify="space-between" align="flex-start" gap={12}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <Typography.Text
                            type="secondary"
                            style={{ display: "block", fontSize: 13 }}
                          >
                            {item.category}
                          </Typography.Text>
                          <Typography.Text
                            strong
                            style={{
                              display: "block",
                              fontSize: 16,
                              lineHeight: 1.35,
                              marginTop: 2,
                            }}
                          >
                            {item.title}
                          </Typography.Text>
                        </div>

                        <Ellipsis size={18} color={token.colorTextTertiary} />
                      </Flex>
                    </SidebarRow>
                  ))}

                  <Typography.Link style={{ padding: "0 16px 16px", fontSize: 15 }}>
                    Daha fazla goster
                  </Typography.Link>
                </SidebarCard>

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
              </Flex>
            </div>
          </div>
        )}
      </Flex>
    </div>
  );
}

function BookmarkItemCard({
  item,
  borderColor,
}: {
  item: (typeof bookmarkedItems)[number];
  borderColor: string;
}) {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        padding: "12px 16px 10px",
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Flex gap={12} align="flex-start">
        <Avatar
          size={40}
          src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${item.avatarSeed}`}
          style={{
            flexShrink: 0,
            background: token.colorPrimaryBg,
            color: token.colorPrimary,
          }}
        >
          {item.author.charAt(0)}
        </Avatar>

        <div style={{ minWidth: 0, flex: 1 }}>
          <Flex justify="space-between" align="flex-start" gap={12}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Flex align="center" gap={6} wrap>
                <Typography.Text strong style={{ fontSize: 15 }}>
                  {item.author}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                  {item.handle}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                  ·
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                  {item.dateLabel}
                </Typography.Text>
              </Flex>

              <Typography.Paragraph
                style={{
                  marginTop: 2,
                  marginBottom: 0,
                  fontSize: 15,
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                }}
              >
                {item.content}
              </Typography.Paragraph>
            </div>

            <Flex align="center" gap={12}>
              <EyeOff size={18} color={token.colorTextSecondary} />
              <Ellipsis size={18} color={token.colorTextSecondary} />
            </Flex>
          </Flex>

          <Card
            variant="outlined"
            style={{
              overflow: "hidden",
              marginTop: 14,
              borderRadius: 18,
              borderColor: token.colorBorderSecondary,
            }}
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <Image
              preview={false}
              src={item.previewImage}
              alt={item.previewTitle}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                display: "block",
              }}
            />

            <div style={{ padding: "14px 16px 16px" }}>
              <Typography.Text
                strong
                style={{
                  display: "block",
                  fontSize: 18,
                  lineHeight: 1.35,
                  letterSpacing: "-0.02em",
                }}
              >
                {item.previewTitle}
              </Typography.Text>
              <Typography.Paragraph
                type="secondary"
                style={{
                  marginTop: 8,
                  marginBottom: 0,
                  fontSize: 14,
                  lineHeight: 1.45,
                }}
                ellipsis={{ rows: 3, tooltip: item.previewBody }}
              >
                {item.previewBody}
              </Typography.Paragraph>
            </div>
          </Card>

          <Flex
            justify="space-between"
            align="center"
            style={{
              marginTop: 14,
              maxWidth: 470,
              color: token.colorTextTertiary,
            }}
          >
            <Metric icon={<MessageCircle size={18} />} value={item.metrics.replies} />
            <Metric icon={<Repeat2 size={18} />} value={item.metrics.reposts} />
            <Metric icon={<Heart size={18} />} value={item.metrics.likes} />
            <Metric icon={<ChartColumn size={18} />} value={item.metrics.views} />
            <Flex align="center" gap={18}>
              <Bookmark size={18} />
              <Share size={18} />
            </Flex>
          </Flex>
        </div>
      </Flex>
    </div>
  );
}

function Metric({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <Flex align="center" gap={6}>
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <Typography.Text type="secondary" style={{ fontSize: 13 }}>
        {value}
      </Typography.Text>
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
  return (
    <Card
      variant="borderless"
      style={{ background, overflow: "hidden" }}
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
