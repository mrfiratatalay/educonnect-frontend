import { type ReactNode, useRef, useState } from "react";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EllipsisOutlined,
  LinkOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Empty,
  Flex,
  Grid,
  Input,
  Skeleton,
  Tabs,
  Typography,
  theme,
  message,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/features/posts/api";
import {
  postKeys,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import type { CreatePostInput, FeedPost } from "@/features/posts/types";
import {
  groupKeys,
  useGroupBySlugQuery,
  useInfiniteGroupPostsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useUpdateGroupMutation,
} from "@/features/groups/hooks";
import type {
  AppGroup,
  AppGroupDetail,
  AppGroupMemberPreview,
  CreateGroupInput,
} from "@/features/groups/types";
import CreateGroupDialog from "@/pages/Explore/components/CreateGroupDialog";
import PostComposer from "@/pages/Feed/components/PostComposer";
import PostList from "@/pages/Feed/components/PostList";
import { useAuthStore } from "@/store/authStore";
import {
  formatCommunityMemberCount,
  getCommunityInitials,
  getCommunitySummary,
} from "@/pages/Communities/communitySurface";

type DetailTab = "latest" | "popular" | "media" | "about";

const trendItems = [
  { label: "Gundemdekiler", title: "Hayfa" },
  { label: "Haberler", title: "SON DAKIKA" },
  { label: "Turkiye tarihinde gundemde", title: "Narin Guran" },
  { label: "Gundemdekiler", title: "Sokakta" },
];

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState<DetailTab>("popular");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showComposer, setShowComposer] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const groupQuery = useGroupBySlugQuery(slug);
  const group = groupQuery.data;
  const postsQuery = useInfiniteGroupPostsQuery(group?.id, 10, Boolean(group?.id));
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();
  const updateGroupMutation = useUpdateGroupMutation(group?.id, group?.slug);
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();
  const actingGroupId = joinGroupMutation.isPending
    ? joinGroupMutation.variables
    : leaveGroupMutation.isPending
      ? leaveGroupMutation.variables
      : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  const createGroupPostMutation = useMutation({
    mutationFn: async (input: CreatePostInput) => {
      if (!group?.id) {
        throw new Error("Topluluk bulunamadi.");
      }

      return createPost({ ...input, groupId: group.id });
    },
    onSuccess: async () => {
      if (!group?.id) {
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "groups" &&
            query.queryKey[1] === "posts" &&
            query.queryKey[2] === group.id,
        }),
        queryClient.invalidateQueries({ queryKey: groupKeys.detailBySlug(group.slug ?? "") }),
      ]);
    },
  });

  const allPosts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const visiblePosts = getVisiblePosts(allPosts, activeTab);
  const summary = group ? getCommunitySummary(group) : "";
  const followSuggestions = group ? getFollowSuggestionsFromMembers(group) : [];
  const isOwner = user?.id === group?.creatorUserId;

  async function handleToggleMembership(targetGroup: AppGroup) {
    if (targetGroup.isMember) {
      await leaveGroupMutation.mutateAsync(targetGroup.id);
      return;
    }

    await joinGroupMutation.mutateAsync(targetGroup.id);
  }

  async function handleCreatePost(input: CreatePostInput) {
    await createGroupPostMutation.mutateAsync(input);
    setShowComposer(false);
  }

  async function handleUpdateGroup(input: CreateGroupInput) {
    await updateGroupMutation.mutateAsync(input);
    setIsEditDialogOpen(false);
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
  }

  async function handleCopyLink() {
    if (!group?.slug) {
      return;
    }

    const pageUrl = `${window.location.origin}/communities/${group.slug}`;

    try {
      await copyTextToClipboard(pageUrl);
      messageApi.success("Topluluk baglantisi kopyalandi.");
    } catch {
      messageApi.error("Baglanti kopyalanamadi.");
    }
  }

  function handleCreatePostClick() {
    setShowComposer(true);
    window.setTimeout(() => {
      composerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const textarea = composerRef.current?.querySelector("textarea");

      if (textarea instanceof HTMLTextAreaElement) {
        textarea.focus();
      }
    }, 60);
  }

  if (groupQuery.isLoading) {
    return <CommunityDetailSkeleton />;
  }

  if (groupQuery.error instanceof Error || !group) {
    return (
      <div style={{ maxWidth: 990, margin: "0 auto", padding: 24 }}>
        <Alert
          type="error"
          showIcon
          message={groupQuery.error instanceof Error ? groupQuery.error.message : "Topluluk yuklenemedi."}
        />
      </div>
    );
  }

  return (
    <>
      {messageContextHolder}
      <div className="communities-surface" style={{ width: "100%", maxWidth: 990, margin: "0 auto" }}>
        <Flex align="flex-start">
          <div
            style={{
              flex: 1,
              maxWidth: screens.xl ? 620 : "100%",
              minWidth: 0,
              borderInline: screens.sm ? `1px solid ${token.colorBorderSecondary}` : "none",
              background: token.colorBgContainer,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: `${token.colorBgContainer}F2`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Flex align="center" justify="space-between" style={{ padding: "10px 12px" }}>
                <Flex align="center" gap={8} style={{ minWidth: 0 }}>
                  <Button
                    type="text"
                    shape="circle"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/communities")}
                  />
                  <Typography.Text strong ellipsis style={{ display: "block", fontSize: 20 }}>
                    {group.name}
                  </Typography.Text>
                </Flex>

                <Flex align="center" gap={4}>
                  <Button type="text" shape="circle" icon={<SearchOutlined />} />
                  <Button type="text" shape="circle" icon={<EllipsisOutlined />} />
                </Flex>
              </Flex>
            </div>

            <div
              style={{
                height: screens.md ? 220 : 180,
                background: group.bannerUrl
                  ? `url(${group.bannerUrl}) center / cover`
                  : token.colorFillSecondary,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            />

            <div style={{ padding: "16px 16px 0" }}>
              <Flex align="flex-start" justify="space-between" gap={16} wrap="wrap">
                <div style={{ minWidth: 0, flex: 1 }}>
                  <Typography.Title
                    level={1}
                    style={{ margin: 0, fontSize: screens.md ? 32 : 28, lineHeight: 1.1 }}
                  >
                    {group.name}
                  </Typography.Title>

                  <Typography.Paragraph
                    type="secondary"
                    ellipsis={{ rows: 3, expandable: true, symbol: "Daha Fazla Goruntule" }}
                    style={{ marginTop: 8, marginBottom: 0, fontSize: 16, lineHeight: 1.55 }}
                  >
                    {summary}
                  </Typography.Paragraph>

                  <Flex align="center" gap={12} wrap="wrap" style={{ marginTop: 14 }}>
                    {group.previewMembers?.length ? (
                      <Avatar.Group size={36} max={{ count: 4 }}>
                        {group.previewMembers.map((member) => (
                          <Avatar key={member.userId} src={member.avatarUrl}>
                            {!member.avatarUrl ? getCommunityInitials(member.fullName) : null}
                          </Avatar>
                        ))}
                      </Avatar.Group>
                    ) : null}
                    <Typography.Text strong style={{ fontSize: 16 }}>
                      {formatCommunityMemberCount(group.memberCount)}
                    </Typography.Text>
                  </Flex>
                </div>

                <Flex align="center" gap={8} wrap="wrap" style={{ marginTop: 4 }}>
                  {group.canCurrentUserPost ? (
                    <Button
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => setShowComposer((current) => !current)}
                      style={{ borderColor: token.colorBorderSecondary, boxShadow: "none" }}
                    />
                  ) : null}
                  <Button
                    shape="circle"
                    icon={<LinkOutlined />}
                    onClick={() => void handleCopyLink()}
                    style={{ borderColor: token.colorBorderSecondary, boxShadow: "none" }}
                  />
                  {isOwner ? (
                    <Button
                      shape="round"
                      size="large"
                      loading={updateGroupMutation.isPending}
                      onClick={() => setIsEditDialogOpen(true)}
                      style={{
                        borderColor: token.colorBorderSecondary,
                        background: token.colorBgContainer,
                        color: token.colorText,
                        boxShadow: "none",
                        paddingInline: 18,
                      }}
                    >
                      Toplulugu duzenle
                    </Button>
                  ) : (
                    <Button
                      shape="round"
                      size="large"
                      loading={actingGroupId === group.id}
                      onClick={() => void handleToggleMembership(group)}
                      style={{
                        borderColor: token.colorBorderSecondary,
                        background: token.colorBgContainer,
                        color: token.colorText,
                        boxShadow: "none",
                        paddingInline: 18,
                      }}
                    >
                      {actingGroupId === group.id ? "Isleniyor" : group.isMember ? "Katildi" : "Katil"}
                    </Button>
                  )}
                </Flex>
              </Flex>
            </div>

            <Tabs
              className="communities-page-tabs"
              activeKey={activeTab}
              onChange={(value) => setActiveTab(value as DetailTab)}
              size="large"
              indicator={{ size: screens.md ? 84 : 64, align: "center" }}
              tabBarStyle={{
                margin: "12px 0 0",
              }}
              items={[
                { key: "popular", label: "Populer" },
                { key: "latest", label: "En Son" },
                { key: "media", label: "Medya" },
                { key: "about", label: "Hakkinda" },
              ]}
            />

            {activeTab === "about" ? (
              <div style={{ padding: "18px 16px 28px" }}>
                <Flex vertical gap={18}>
                  <div>
                    <Typography.Title level={4} style={{ margin: 0 }}>
                      Hakkinda
                    </Typography.Title>
                    <Typography.Paragraph style={{ margin: "8px 0 0", lineHeight: 1.75 }}>
                      {group.description}
                    </Typography.Paragraph>
                  </div>

                  <PlainFact label="Kategori" value={group.category} />
                  <PlainFact label="Kurucu" value={group.creatorName} />
                  <PlainFact label="Gonderiler" value={`${group.postCount}`} />
                  <PlainFact label="Etkinlikler" value={`${group.eventCount}`} />
                  <PlainFact
                    label="Paylasim yetkisi"
                    value={group.canCurrentUserPost ? "Uyelere acik" : "Uyelik gerekiyor"}
                  />

                  {group.moderatorPreviewMembers.length ? (
                    <div>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        Moderator ve yoneticiler
                      </Typography.Title>
                      <Flex vertical gap={12} style={{ marginTop: 12 }}>
                        {group.moderatorPreviewMembers.map((member) => (
                          <Flex key={member.userId} align="center" gap={10}>
                            <Avatar src={member.avatarUrl}>
                              {!member.avatarUrl ? getCommunityInitials(member.fullName) : null}
                            </Avatar>
                            <div>
                              <Typography.Text strong style={{ display: "block" }}>
                                {member.fullName}
                              </Typography.Text>
                              <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                                {member.role}
                              </Typography.Text>
                            </div>
                          </Flex>
                        ))}
                      </Flex>
                    </div>
                  ) : null}
                </Flex>
              </div>
            ) : (
              <>
                {showComposer && group.canCurrentUserPost ? (
                  <div ref={composerRef}>
                    <PostComposer
                      avatarUrl={user?.avatarUrl}
                      fullName={user?.fullName}
                      isSubmitting={createGroupPostMutation.isPending}
                      onSubmit={handleCreatePost}
                    />
                  </div>
                ) : null}

                {postsQuery.error instanceof Error ? (
                  <div style={{ padding: 16 }}>
                    <Alert type="error" showIcon message={postsQuery.error.message} />
                  </div>
                ) : (
                  <PostList
                    mode="detail"
                    posts={visiblePosts}
                    currentUserId={user?.id}
                    currentUserRole={user?.role}
                    deletingPostId={deletingPostId}
                    updatingPostId={updatingPostId}
                    isLoading={postsQuery.isLoading}
                    showCreateAction={group.canCurrentUserPost}
                    onCreatePostClick={handleCreatePostClick}
                    onDelete={handleDeletePost}
                    onUpdate={async (postId, content) => {
                      await updatePostMutation.mutateAsync({ postId, content });
                    }}
                  />
                )}

                {postsQuery.hasNextPage ? (
                  <Flex justify="center" style={{ padding: "8px 0 24px" }}>
                    <Button
                      loading={postsQuery.isFetchingNextPage}
                      onClick={() => void postsQuery.fetchNextPage()}
                    >
                      Daha fazla yukle
                    </Button>
                  </Flex>
                ) : null}
              </>
            )}
          </div>

          {screens.xl ? (
            <div style={{ width: 350, flexShrink: 0, paddingLeft: 20 }}>
              <div style={{ position: "sticky", top: 12, padding: "0 16px 24px" }}>
                <Flex vertical gap={16}>
                  <Input
                    className="communities-search"
                    allowClear
                    placeholder="Ara"
                    prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                    variant="filled"
                    styles={{
                      input: {
                        height: 40,
                      },
                    }}
                  />

                  <AsideCard title={`${group.name} Kurallari`}>
                    <Flex vertical gap={16}>
                      <RuleRow index={1} text="Saygili ol ve iyi niyetli kal." />
                      <RuleRow index={2} text="Paylasimlarini topluluk konusu icinde tut." />
                      <RuleRow index={3} text="Uret, sor ve faydali katki ver." />
                    </Flex>
                  </AsideCard>

                  <AsideCard
                    title="Neler oluyor?"
                    footer={
                      <Button type="link" style={{ padding: 0 }}>
                        Daha fazla goster
                      </Button>
                    }
                  >
                    <Flex vertical gap={16}>
                      {trendItems.map((item) => (
                        <TrendRow key={item.title} label={item.label} title={item.title} />
                      ))}
                    </Flex>
                  </AsideCard>

                  <AsideCard
                    title="Kimi takip etmeli"
                    footer={
                      <Button type="link" style={{ padding: 0 }}>
                        Daha fazla goster
                      </Button>
                    }
                  >
                    <Flex vertical gap={18}>
                      {followSuggestions.length > 0 ? (
                        followSuggestions.map((person) => (
                          <FollowRow
                            key={person.key}
                            name={person.name}
                            handle={person.handle}
                            avatarUrl={person.avatarUrl}
                          />
                        ))
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Oneri bulunamadi" />
                      )}
                    </Flex>
                  </AsideCard>
                </Flex>
              </div>
            </div>
          ) : null}
        </Flex>
      </div>

      <CreateGroupDialog
        isOpen={isEditDialogOpen}
        isSubmitting={updateGroupMutation.isPending}
        initialValues={{
          name: group.name,
          shortDescription: group.shortDescription,
          description: group.description,
          category: group.category,
          avatarUrl: group.avatarUrl,
          bannerUrl: group.bannerUrl,
        }}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateGroup}
        submitLabel="Degisiklikleri kaydet"
        title="Toplulugu duzenle"
      />
    </>
  );
}

function RuleRow({ index, text }: { index: number; text: string }) {
  const { token } = theme.useToken();

  return (
    <Flex align="flex-start" gap={12}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 999,
          background: token.colorFillTertiary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {index}
      </div>
      <Typography.Text style={{ lineHeight: 1.7 }}>{text}</Typography.Text>
    </Flex>
  );
}

function PlainFact({ label, value }: { label: string; value: string }) {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={12}
      style={{ paddingBottom: 12, borderBottom: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text strong>{value}</Typography.Text>
    </Flex>
  );
}

function AsideCard({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      className="communities-side-card"
      variant="outlined"
      style={{ borderColor: token.colorBorderSecondary }}
    >
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
          {title}
        </Typography.Title>
        {children}
        {footer ? <div>{footer}</div> : null}
      </Flex>
    </Card>
  );
}

function TrendRow({ label, title }: { label: string; title: string }) {
  const { token } = theme.useToken();

  return (
    <Flex align="flex-start" justify="space-between" gap={12}>
      <div style={{ minWidth: 0 }}>
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
          {label}
        </Typography.Text>
        <Typography.Text strong style={{ display: "block", fontSize: 17, lineHeight: 1.25 }}>
          {title}
        </Typography.Text>
      </div>
      <EllipsisOutlined style={{ color: token.colorTextTertiary, marginTop: 4 }} />
    </Flex>
  );
}

function FollowRow({
  name,
  handle,
  avatarUrl,
}: {
  name: string;
  handle: string;
  avatarUrl?: string;
}) {
  const { token } = theme.useToken();

  return (
    <Flex align="center" gap={12}>
      <Avatar
        size={40}
        src={avatarUrl}
        style={{
          background: token.colorFillSecondary,
          color: token.colorText,
          flexShrink: 0,
        }}
      >
        {!avatarUrl ? getCommunityInitials(name) : null}
      </Avatar>

      <div style={{ minWidth: 0, flex: 1 }}>
        <Typography.Text strong ellipsis style={{ display: "block", fontSize: 16 }}>
          {name}
        </Typography.Text>
        <Typography.Text type="secondary" ellipsis style={{ display: "block", fontSize: 14 }}>
          @{handle}
        </Typography.Text>
      </div>

      <Button type="primary" shape="round" style={{ paddingInline: 16 }}>
        Takip et
      </Button>
    </Flex>
  );
}

function CommunityDetailSkeleton() {
  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: 24 }}>
      <Skeleton active avatar paragraph={{ rows: 8 }} />
    </div>
  );
}

function getVisiblePosts(posts: FeedPost[], activeTab: DetailTab) {
  if (activeTab === "media") {
    return posts.filter((post) => Boolean(post.imageUrl));
  }

  if (activeTab === "popular") {
    return [...posts].sort(
      (left, right) =>
        right.likesCount +
        right.commentsCount -
        (left.likesCount + left.commentsCount),
    );
  }

  return posts;
}

function getFollowSuggestionsFromMembers(group: AppGroupDetail) {
  const map = new Map<
    string,
    { key: string; name: string; handle: string; avatarUrl?: string }
  >();

  const pool: AppGroupMemberPreview[] = [
    ...group.moderatorPreviewMembers,
    ...(group.previewMembers ?? []),
  ];

  pool.forEach((member) => {
    if (map.size >= 3 || map.has(member.userId)) {
      return;
    }

    map.set(member.userId, {
      key: member.userId,
      name: member.fullName,
      handle: member.fullName.replace(/\s+/g, "").toLowerCase(),
      avatarUrl: member.avatarUrl,
    });
  });

  if (map.size === 0) {
    return [
      { key: "1", name: "Astro", handle: "astrodotbuild" },
      { key: "2", name: "Yusuf Demirci", handle: "meyusufdemirci" },
      { key: "3", name: "Deniz Oktar", handle: "denizoktar" },
    ];
  }

  return Array.from(map.values()).slice(0, 3);
}

async function copyTextToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  const hasCopied = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!hasCopied) {
    throw new Error("copy_failed");
  }
}
