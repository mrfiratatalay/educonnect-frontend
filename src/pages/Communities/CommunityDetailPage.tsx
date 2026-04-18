import { type ReactNode, useRef, useState } from "react";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Flex,
  Grid,
  Empty,
  Modal,
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
import type { CreatePostInput, FeedPost, UpdatePostInput } from "@/features/posts/types";
import {
  groupKeys,
  useDemoteGroupMemberMutation,
  useDeleteGroupMutation,
  useGroupBySlugQuery,
  useInfiniteGroupPostsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  usePromoteGroupMemberMutation,
  useGroupMembersQuery,
  useRemoveGroupMemberMutation,
  useUpdateGroupMutation,
} from "@/features/groups/hooks";
import type {
  AppGroup,
  AppGroupMember,
  AppGroupMemberRole,
  CreateGroupInput,
} from "@/features/groups/types";
import {
  useCancelEventMutation,
  useEventsQuery,
  useRegisterEventMutation,
} from "@/features/events/hooks";
import type { AppEvent } from "@/features/events/types";
import FollowSuggestionsCard from "@/components/shared/FollowSuggestionsCard";
import CreateGroupDialog from "@/pages/Explore/components/CreateGroupDialog";
import CommunityMembersModal from "@/pages/Communities/components/CommunityMembersModal";
import PostComposer from "@/pages/Feed/components/PostComposer";
import PostList from "@/pages/Feed/components/PostList";
import EventCard from "@/pages/Explore/components/EventCard";
import EventDetailDialog from "@/pages/Explore/components/EventDetailDialog";
import { useAuthStore } from "@/store/authStore";
import {
  getCommunityRules,
  formatCommunityMemberCount,
  getCommunityInitials,
  getCommunitySummary,
} from "@/pages/Communities/communitySurface";

type DetailTab = "latest" | "popular" | "events" | "about";

export default function CommunityDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [activeTab, setActiveTab] = useState<DetailTab>("popular");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [memberActionTargetId, setMemberActionTargetId] = useState<string>();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showComposer, setShowComposer] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();
  const composerRef = useRef<HTMLDivElement | null>(null);
  const groupQuery = useGroupBySlugQuery(slug);
  const group = groupQuery.data;
  const postsQuery = useInfiniteGroupPostsQuery(group?.id, 10, Boolean(group?.id));
  const groupMembersQuery = useGroupMembersQuery(group?.id, isMembersOpen && Boolean(group?.id));
  const eventsQuery = useEventsQuery({ groupId: group?.id }, Boolean(group?.id));
  const joinGroupMutation = useJoinGroupMutation(group?.slug);
  const leaveGroupMutation = useLeaveGroupMutation(group?.slug);
  const promoteMemberMutation = usePromoteGroupMemberMutation(group?.id, group?.slug);
  const demoteMemberMutation = useDemoteGroupMemberMutation(group?.id, group?.slug);
  const removeMemberMutation = useRemoveGroupMemberMutation(group?.id, group?.slug);
  const updateGroupMutation = useUpdateGroupMutation(group?.id, group?.slug);
  const deleteGroupMutation = useDeleteGroupMutation();
  const registerEventMutation = useRegisterEventMutation();
  const cancelEventMutation = useCancelEventMutation();
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
  const actingEventId = registerEventMutation.isPending
    ? registerEventMutation.variables
    : cancelEventMutation.isPending
      ? cancelEventMutation.variables
      : undefined;

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
  const groupEvents = eventsQuery.data ?? [];
  const summary = group ? getCommunitySummary(group) : "";
  const communityRules = group ? getCommunityRules(group) : [];
  const isOwner = user?.id === group?.creatorUserId;

  async function handleToggleMembership(targetGroup: AppGroup) {
    if (targetGroup.isMember) {
      await leaveGroupMutation.mutateAsync(targetGroup.id);
      return;
    }

    await joinGroupMutation.mutateAsync(targetGroup.id);
  }

  async function handleToggleRegistration(event: AppEvent) {
    if (event.isRegistered) {
      await cancelEventMutation.mutateAsync(event.id);
      return;
    }

    await registerEventMutation.mutateAsync(event.id);
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

  async function handlePromoteMember(member: AppGroupMember) {
    setMemberActionTargetId(member.userId);
    try {
      await promoteMemberMutation.mutateAsync(member.userId);
      messageApi.success("Kullanıcı moderatör yapildi.");
    } finally {
      setMemberActionTargetId(undefined);
    }
  }

  async function handleDemoteMember(member: AppGroupMember) {
    setMemberActionTargetId(member.userId);
    try {
      await demoteMemberMutation.mutateAsync(member.userId);
      messageApi.success("Moderatörluk kaldirildi.");
    } finally {
      setMemberActionTargetId(undefined);
    }
  }

  function handleRemoveMember(member: AppGroupMember) {
    Modal.confirm({
      title: `${member.fullName} topluluktan cikarilsin mi?`,
      content: "Bu kullanıcı topluluk üyeliginin disina alinacak.",
      okText: "Cikar",
      cancelText: "Vazgeç",
      okButtonProps: { danger: true },
      onOk: async () => {
        setMemberActionTargetId(member.userId);
        try {
          await removeMemberMutation.mutateAsync(member.userId);
          messageApi.success("Üye topluluktan cikarildi.");
        } finally {
          setMemberActionTargetId(undefined);
        }
      },
    });
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

  function handleHeaderAction() {
    setIsMembersOpen(true);
  }

  function handleDeleteGroup() {
    if (!group) {
      return;
    }

    Modal.confirm({
      title: "Topluluk silinsin mi?",
      content: "Topluluk listelerden kalkaçak ve artik kullanilamayacak.",
      okText: "Topluluğu sil",
      cancelText: "Vazgeç",
      okButtonProps: { danger: true, loading: deleteGroupMutation.isPending },
      onOk: async () => {
        await deleteGroupMutation.mutateAsync(group.id);
        messageApi.success("Topluluk silindi.");
        navigate("/communities", { replace: true });
      },
    });
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
          message={groupQuery.error instanceof Error ? groupQuery.error.message : "Topluluk yüklenemedi."}
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
                  <Button type="text" onClick={handleHeaderAction}>
                    Üyeler
                  </Button>
                  <Button type="text" shape="circle" icon={<LinkOutlined />} onClick={() => void handleCopyLink()} />
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
              <Flex vertical align="stretch" gap={16}>
                <div style={{ minWidth: 0, width: "100%" }}>
                  <Typography.Title
                    level={1}
                    style={{
                      margin: 0,
                      fontSize: screens.md ? 32 : 28,
                      lineHeight: 1.1,
                      wordBreak: "break-word",
                      overflowWrap: "anywhere",
                    }}
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
                    <Button type="link" onClick={() => setIsMembersOpen(true)} style={{ paddingInline: 0 }}>
                      Tüm üyeleri gor
                    </Button>
                  </Flex>
                </div>

                <Flex
                  align="center"
                  gap={8}
                  wrap="wrap"
                  style={{
                    marginTop: 4,
                    width: "100%",
                    justifyContent: "flex-start",
                  }}
                >
                  <Button
                    shape="circle"
                    icon={<LinkOutlined />}
                    onClick={() => void handleCopyLink()}
                    style={{ borderColor: token.colorBorderSecondary, boxShadow: "none" }}
                  />
                  {isOwner ? (
                    <>
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
                        Topluluğu düzenle
                      </Button>
                      <Button
                        danger
                        shape="round"
                        size="large"
                        loading={deleteGroupMutation.isPending}
                        onClick={handleDeleteGroup}
                      >
                        Topluluğu sil
                      </Button>
                    </>
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
                      {actingGroupId === group.id ? "Isleniyor" : group.isMember ? "Katıldi" : "Katıl"}
                    </Button>
                  )}
                  {group.canManageMembers ? (
                    <Button
                      shape="round"
                      size="large"
                      onClick={() => setIsMembersOpen(true)}
                      style={{
                        borderColor: token.colorBorderSecondary,
                        background: token.colorBgContainer,
                        color: token.colorText,
                        boxShadow: "none",
                        paddingInline: 18,
                      }}
                    >
                      Üye yönetimi
                    </Button>
                  ) : null}
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
                { key: "events", label: "Etkinlikler" },
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
                  <PlainFact label="Gönderiler" value={`${group.postCount}`} />
                  <PlainFact label="Etkinlikler" value={`${group.eventCount}`} />
                  <PlainFact label="Rolun" value={formatRoleLabel(group.currentUserRole)} />
                  <PlainFact
                    label="Paylaşım yetkişi"
                    value={group.canCurrentUserPost ? "Üyelere açık" : "Üyelik gerekiyor"}
                  />
                  <PlainFact
                    label="Etkinlik yönetimi"
                    value={group.canCreateEvents ? "Moderatör veya kurucu" : "Yetkin yok"}
                  />

                  {group.moderatörPreviewMembers?.length ? (
                    <div>
                      <Typography.Title level={5} style={{ margin: 0 }}>
                        Moderatör ve yöneticiler
                      </Typography.Title>
                      <Flex vertical gap={12} style={{ marginTop: 12 }}>
                        {(group.moderatörPreviewMembers ?? []).map((member) => (
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
            ) : activeTab === "events" ? (
              <div style={{ padding: "18px 16px 28px" }}>
                {eventsQuery.isLoading ? (
                  <Skeleton active paragraph={{ rows: 4 }} />
                ) : eventsQuery.error instanceof Error ? (
                  <Alert type="error" showIcon message={eventsQuery.error.message} />
                ) : groupEvents.length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: screens.md ? "repeat(2, minmax(0, 1fr))" : "1fr",
                      gap: 16,
                    }}
                  >
                    {groupEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        isActing={actingEventId === event.id}
                        onOpen={(eventId) => setSelectedEventId(eventId)}
                        onToggleRegistration={(targetEvent) => void handleToggleRegistration(targetEvent)}
                      />
                    ))}
                  </div>
                ) : (
                  <Empty
                    description="Bu toplulukta henuz etkinlik yok."
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
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
                    onUpdate={async (postId: string, input: Omit<UpdatePostInput, "postId">) => {
                      await updatePostMutation.mutateAsync({ postId, ...input });
                    }}
                  />
                )}

                {postsQuery.hasNextPage ? (
                  <Flex justify="center" style={{ padding: "8px 0 24px" }}>
                    <Button
                      loading={postsQuery.isFetchingNextPage}
                      onClick={() => void postsQuery.fetchNextPage()}
                    >
                      Daha fazla yükle
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
                  <AsideCard title={`${group.name} Kurallari`}>
                    <Flex vertical gap={16}>
                      {communityRules.map((rule, index) => (
                        <RuleRow key={rule} index={index + 1} text={rule} />
                      ))}
                    </Flex>
                  </AsideCard>

                  <AsideCard
                    title="Topluluk özeti"
                    footer={
                      <Button type="link" style={{ padding: 0 }} onClick={() => setIsMembersOpen(true)}>
                        Üyeleri ac
                      </Button>
                    }
                  >
                    <Flex vertical gap={16}>
                      <TrendRow label="Üyeler" title={formatCommunityMemberCount(group.memberCount)} />
                      <TrendRow label="Gönderiler" title={`${group.postCount} paylaşım`} />
                      <TrendRow label="Etkinlikler" title={`${group.eventCount} etkinlik`} />
                      <TrendRow label="Rolun" title={formatRoleLabel(group.currentUserRole)} />
                    </Flex>
                  </AsideCard>

                  <FollowSuggestionsCard />
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
          rules: group.rules,
          category: group.category,
          avatarUrl: group.avatarUrl,
          bannerUrl: group.bannerUrl,
        }}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateGroup}
        submitLabel="Degisiklikleri kaydet"
        title="Topluluğu düzenle"
      />
      <CommunityMembersModal
        open={isMembersOpen}
        members={groupMembersQuery.data}
        loading={groupMembersQuery.isLoading}
        actingUserId={memberActionTargetId}
        canManageMembers={group.canManageMembers}
        onClose={() => setIsMembersOpen(false)}
        onPromote={handlePromoteMember}
        onDemote={handleDemoteMember}
        onRemove={handleRemoveMember}
      />
      <EventDetailDialog
        eventId={selectedEventId}
        event={groupEvents.find((event) => event.id === selectedEventId) ?? null}
        actingEventId={actingEventId}
        onClose={() => setSelectedEventId(null)}
        onToggleRegistration={(event) => void handleToggleRegistration(event)}
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
          borderRadius: 8,
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

function CommunityDetailSkeleton() {
  return (
    <div style={{ maxWidth: 990, margin: "0 auto", padding: 24 }}>
      <Skeleton active avatar paragraph={{ rows: 8 }} />
    </div>
  );
}

function getVisiblePosts(posts: FeedPost[], activeTab: DetailTab) {
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

function formatRoleLabel(role?: AppGroupMemberRole) {
  switch (role) {
    case "owner":
      return "Kurucu";
    case "moderatör":
      return "Moderatör";
    case "member":
      return "Üye";
    default:
      return "Misafir";
  }
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
