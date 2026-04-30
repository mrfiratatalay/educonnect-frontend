import { useState, useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import {
  Bookmark,
  ChartColumn,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Dropdown,
  Flex,
  Image,
  List,
  Typography,
  message,
  theme,
} from "antd";
import type { MenuProps } from "antd";
import {
  useTogglePostBookmarkMutation,
  useTogglePostLikeMutation,
  useTrackPostViewMutation,
} from "@/features/posts/hooks";
import type { FeedPost, UpdatePostInput } from "@/features/posts/types";
import { formatPostMetric, formatPostTime } from "@/features/posts/utils";
import PostCommentsPanel from "@/pages/Feed/components/PostCommentsPanel";
import PostEditForm from "@/pages/Feed/components/PostEditForm";

interface PostCardProps {
  post: FeedPost;
  canManage?: boolean;
  isDeleting?: boolean;
  isUpdating?: boolean;
  mode?: "feed" | "detail";
  onDelete?: (postId: string) => void;
  showGroupContext?: boolean;
  showRecommendationReason?: boolean;
  onUpdate?: (postId: string, input: Omit<UpdatePostInput, "postId">) => Promise<void>;
}

interface ActionBtnProps {
  icon: ReactNode;
  count?: number;
  color: string;
  hoverColor: string;
  hoverBgColor: string;
  onClick?: (event: MouseEvent) => void;
}

function ActionBtn({
  icon,
  count,
  color,
  hoverColor,
  hoverBgColor,
  onClick,
}: ActionBtnProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Flex
      align="center"
      style={{
        cursor: "pointer",
        color: isHovered ? hoverColor : color,
        transition: "color 0.2s",
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          borderRadius: "50%",
          backgroundColor: isHovered ? hoverBgColor : "transparent",
          transition: "background-color 0.2s",
        }}
      >
        {icon}
      </div>
      {count !== undefined && (
        <span style={{ fontSize: 13, minWidth: 16 }}>
          {count > 0 ? formatPostMetric(count) : ""}
        </span>
      )}
    </Flex>
  );
}

function ActionStat({
  icon,
  value,
  color,
}: {
  icon: ReactNode;
  value: number;
  color: string;
}) {
  return (
    <Flex align="center" gap={6} style={{ color }}>
      <span style={{ display: "inline-flex", alignItems: "center" }}>{icon}</span>
      <span style={{ fontSize: 13 }}>{formatPostMetric(value)}</span>
    </Flex>
  );
}

export default function PostCard({
  post,
  canManage = false,
  isDeleting = false,
  isUpdating = false,
  mode = "feed",
  onDelete,
  showGroupContext = false,
  showRecommendationReason = false,
  onUpdate,
}: PostCardProps) {
  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const toggleLikeMutation = useTogglePostLikeMutation();
  const toggleBookmarkMutation = useTogglePostBookmarkMutation();
  const trackViewMutation = useTrackPostViewMutation();
  const { token } = theme.useToken();
  const isFeedMode = mode === "feed";
  const cardRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    if (!isFeedMode || hasTrackedView.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasTrackedView.current) {
          hasTrackedView.current = true;
          void trackViewMutation.mutateAsync(post.id);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id, isFeedMode]);

  const managementItems: MenuProps["items"] = [
    {
      key: "edit",
      icon: <Pencil size={16} />,
      label: isEditing ? "Düzenlemeyi kapat" : "Gönderiyi düzenle",
      disabled: isUpdating,
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <Trash2 size={16} />,
      label: isDeleting ? "Siliniyor..." : "Gönderiyi sil",
      danger: true,
      disabled: isDeleting,
    },
  ];

  function handleOpenPost() {
    if (!isFeedMode || isEditing) {
      return;
    }

    navigate(`/post/${post.id}`);
  }

  function handleProfileClick(event?: MouseEvent<HTMLElement>) {
    if (!event) {
      return;
    }

    event.stopPropagation();
    navigate(`/profile/${post.userId}`);
  }

  function handleDropdownTriggerClick(event: MouseEvent) {
    event.stopPropagation();
  }

  function handleGroupClick(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();

    if (post.groupSlug) {
      navigate(`/communities/${post.groupSlug}`);
      return;
    }

    navigate("/communities");
  }

  function handleToggleLike() {
    if (toggleLikeMutation.isPending) return;
    void toggleLikeMutation.mutateAsync(post.id);
  }

  function handleToggleBookmark() {
    void toggleBookmarkMutation.mutateAsync(post.id);
  }

  async function handleShare() {
    const postUrl = `${window.location.origin}/post/${post.id}`;

    try {
      await copyTextToClipboard(postUrl);
      messageApi.success("Gönderi bağlantısı kopyalandı.");
    } catch {
      messageApi.error("Bağlantı kopyalanamadı.");
    }
  }

  function handleCommentClick() {
    if (isFeedMode) {
      setShowComments((current) => !current);
      return;
    }

    document
      .getElementById("post-comment-composer")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleUpdate(input: Omit<UpdatePostInput, "postId">) {
    await onUpdate?.(post.id, input);
    setIsEditing(false);
  }

  function handleManagementClick(key: string) {
    if (key === "edit") {
      setIsEditing((current) => !current);
      return;
    }

    if (key === "delete") {
      onDelete?.(post.id);
    }
  }

  return (
    <>
      {messageContextHolder}
      <List.Item style={{ padding: "12px 16px" }}>
        <div ref={cardRef} style={{ width: "100%" }}>
        <Flex gap={12} align="flex-start" style={{ width: "100%" }}>
          <Avatar
            src={post.avatarUrl}
            size={40}
            onClick={handleProfileClick}
            style={{
              backgroundColor: token.colorPrimaryBg,
              color: token.colorPrimary,
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            {post.userName.charAt(0)}
          </Avatar>

          <Flex vertical style={{ flex: 1, minWidth: 0 }}>
            {showRecommendationReason && post.recommendationReason ? (
              <Typography.Text
                type="secondary"
                style={{
                  display: "block",
                  fontSize: 13,
                  lineHeight: 1.3,
                  marginBottom: 6,
                }}
              >
                Senin için - {post.recommendationReason}
              </Typography.Text>
            ) : null}

            {showGroupContext && post.groupName ? (
              <Flex
                align="center"
                gap={8}
                style={{
                  marginBottom: 4,
                  color: token.colorTextSecondary,
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={handleGroupClick}
              >
                <Avatar
                  src={post.groupAvatarUrl}
                  size={20}
                  style={{
                    backgroundColor: token.colorFillSecondary,
                    color: token.colorText,
                    flexShrink: 0,
                  }}
                >
                  {!post.groupAvatarUrl ? getGroupInitials(post.groupName) : null}
                </Avatar>
                <Typography.Text
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: token.colorTextSecondary,
                  }}
                >
                  {post.groupName}
                </Typography.Text>
              </Flex>
            ) : null}

            {isEditing ? (
              <>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={4} style={{ minWidth: 0 }}>
                    <Typography.Text
                      strong
                      style={{ fontSize: 15, lineHeight: 1.2, cursor: "pointer" }}
                      onClick={handleProfileClick}
                    >
                      {post.userName}
                    </Typography.Text>
                    <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                      @{post.userName.replace(/\s+/g, "").toLowerCase()}
                    </Typography.Text>
                  </Flex>
                </Flex>

                <div style={{ marginTop: 8 }}>
                  <PostEditForm
                    postId={post.id}
                    initialContent={post.content}
                    initialImageUrl={post.imageUrl}
                    isSubmitting={isUpdating}
                    onCancel={() => setIsEditing(false)}
                    onSubmit={handleUpdate}
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  onClick={handleOpenPost}
                  style={{ cursor: isFeedMode ? "pointer" : "default" }}
                >
                  <Flex align="center" justify="space-between">
                    <Flex align="center" gap={4} style={{ minWidth: 0 }}>
                      <Typography.Text
                        strong
                        style={{ fontSize: 15, lineHeight: 1.2, cursor: "pointer" }}
                        onClick={handleProfileClick}
                      >
                        {post.userName}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                        @{post.userName.replace(/\s+/g, "").toLowerCase()}
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                        .
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                        {formatPostTime(post.createdAt)}
                      </Typography.Text>
                    </Flex>

                    {canManage && (
                      <Dropdown
                        menu={{
                          items: managementItems,
                          onClick: ({ key }) => handleManagementClick(String(key)),
                        }}
                        placement="bottomRight"
                        trigger={["click"]}
                      >
                        <div
                          style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: 4,
                          }}
                          onClick={handleDropdownTriggerClick}
                        >
                          <MoreHorizontal
                            size={18}
                            style={{ color: token.colorTextTertiary }}
                          />
                        </div>
                      </Dropdown>
                    )}
                  </Flex>

                  <Typography.Paragraph
                    style={{
                      marginBottom: 0,
                      marginTop: 4,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      fontSize: 15,
                    }}
                  >
                    {renderContentWithHashtags(post.content, (tag) => {
                      navigate(`/explore/tag/${encodeURIComponent(tag)}`);
                    })}
                  </Typography.Paragraph>

                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt="Gönderi görseli"
                      preview
                      style={{
                        maxHeight: 384,
                        width: "100%",
                        objectFit: "cover",
                        borderRadius: 16,
                        marginTop: 12,
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                  )}
                </div>

                <Flex
                  align="center"
                  justify="space-between"
                  gap={12}
                  style={{ marginTop: 4, width: "100%" }}
                >
                  <Flex align="center" gap={12} wrap>
                    <ActionBtn
                      icon={<MessageCircle size={18} />}
                      count={post.commentsCount}
                      color={token.colorTextTertiary}
                      hoverColor="#0D9488"
                      hoverBgColor="rgba(13, 148, 136, 0.1)"
                      onClick={handleCommentClick}
                    />
                    <ActionBtn
                      icon={
                        <Heart size={18} fill={post.isLiked ? "#F91880" : "transparent"} />
                      }
                      count={post.likesCount}
                      color={post.isLiked ? "#F91880" : token.colorTextTertiary}
                      hoverColor="#F91880"
                      hoverBgColor="rgba(249, 24, 128, 0.1)"
                      onClick={handleToggleLike}
                    />
                    <ActionBtn
                      icon={
                        <Bookmark
                          size={18}
                          fill={post.isBookmarked ? token.colorPrimary : "transparent"}
                        />
                      }
                      color={post.isBookmarked ? token.colorPrimary : token.colorTextTertiary}
                      hoverColor={token.colorPrimary}
                      hoverBgColor={token.colorPrimaryBg}
                      onClick={handleToggleBookmark}
                    />
                    <ActionBtn
                      icon={<Share2 size={18} />}
                      color={token.colorTextTertiary}
                      hoverColor="#0D9488"
                      hoverBgColor="rgba(13, 148, 136, 0.1)"
                      onClick={() => {
                        void handleShare();
                      }}
                    />
                  </Flex>

                  <ActionStat
                    icon={<ChartColumn size={18} />}
                    value={post.viewsCount}
                    color={token.colorTextTertiary}
                  />
                </Flex>
              </>
            )}

            {!isEditing && isFeedMode && (
              <PostCommentsPanel postId={post.id} isOpen={showComments} />
            )}
          </Flex>
        </Flex>
        </div>
      </List.Item>
    </>
  );
}

function renderContentWithHashtags(content: string, onHashtagClick: (tag: string) => void) {
  const parts = content.split(/(#[\w\u00C0-\u024F\u0100-\u024F]+)/g);
  return parts.map((part, index) => {
    if (part.startsWith("#") && part.length > 1) {
      const tag = part.slice(1);
      return (
        <span
          key={index}
          style={{ color: "#0D9488", cursor: "pointer", fontWeight: 500 }}
          onClick={(e) => {
            e.stopPropagation();
            onHashtagClick(tag);
          }}
        >
          {part}
        </span>
      );
    }
    return part;
  });
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

function getGroupInitials(groupName: string) {
  return groupName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
