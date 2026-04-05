import { useState } from "react";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  MoreOutlined,
  RetweetOutlined,
  BarChartOutlined,
  BookOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Flex, Image, Typography, theme, List } from "antd";
import type { MenuProps } from "antd";
import { useTogglePostLikeMutation } from "@/features/posts/hooks";
import type { FeedPost } from "@/features/posts/types";
import { formatPostTime } from "@/features/posts/utils";
import PostCommentsPanel from "@/pages/Feed/components/PostCommentsPanel";
import PostEditForm from "@/pages/Feed/components/PostEditForm";

interface PostCardProps {
  post: FeedPost;
  canManage: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (postId: string) => void;
  onUpdate: (postId: string, content: string) => Promise<void>;
}

export default function PostCard({
  post,
  canManage,
  isDeleting,
  isUpdating,
  onDelete,
  onUpdate,
}: PostCardProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const toggleLikeMutation = useTogglePostLikeMutation();
  const { token } = theme.useToken();

  const isLiking =
    toggleLikeMutation.isPending &&
    toggleLikeMutation.variables === post.id;

  const managementItems: MenuProps["items"] = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: isEditing ? "Düzenlemeyi kapat" : "Gönderiyi düzenle",
      disabled: isUpdating,
    },
    { type: "divider" },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: isDeleting ? "Siliniyor..." : "Gönderiyi sil",
      danger: true,
      disabled: isDeleting,
    },
  ];

  function handleToggleLike() {
    void toggleLikeMutation.mutateAsync(post.id);
  }

  async function handleUpdate(content: string) {
    await onUpdate(post.id, content);
    setIsEditing(false);
  }

  function handleManagementClick(key: string) {
    if (key === "edit") {
      setIsEditing((current) => !current);
      return;
    }
    if (key === "delete") {
      onDelete(post.id);
    }
  }

  // X-style interaction button
  const ActionBtn = ({ icon, count, color, hoverColor, onClick }: { icon: React.ReactNode; count?: number; color: string; hoverColor: string; onClick?: () => void }) => (
    <Flex
      align="center"
      gap={4}
      style={{ cursor: "pointer", color, transition: "color 0.2s" }}
      onClick={onClick}
      onMouseEnter={(e) => { e.currentTarget.style.color = hoverColor; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = color; }}
    >
      <Button type="text" shape="circle" size="small" icon={icon} style={{ color: "inherit" }} />
      <span style={{ fontSize: 13, minWidth: 16 }}>{count && count > 0 ? count : ""}</span>
    </Flex>
  );

  return (
    <List.Item style={{ padding: "12px 16px" }}>
      <Flex gap={12} align="flex-start" style={{ width: "100%" }}>
        <Avatar
          src={post.avatarUrl}
          size={40}
          onClick={() => navigate(`/profile/${post.userId}`)}
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
          {/* Header row: Name · @handle · time · ... */}
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={4} style={{ minWidth: 0 }}>
              <Typography.Text
                strong
                style={{ fontSize: 15, cursor: "pointer", lineHeight: 1.2 }}
                onClick={() => navigate(`/profile/${post.userId}`)}
              >
                {post.userName}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                @{post.userName.replace(/\s+/g, "").toLowerCase()}
              </Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 15 }}>·</Typography.Text>
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
                <Button icon={<MoreOutlined />} shape="circle" type="text" size="small" />
              </Dropdown>
            )}
          </Flex>

          {/* Content */}
          {isEditing ? (
            <PostEditForm
              initialContent={post.content}
              isSubmitting={isUpdating}
              onCancel={() => setIsEditing(false)}
              onSubmit={handleUpdate}
            />
          ) : (
            <>
              <Typography.Paragraph
                style={{ marginBottom: 0, marginTop: 4, lineHeight: 1.5, whiteSpace: "pre-wrap", fontSize: 15 }}
              >
                {post.content}
              </Typography.Paragraph>

              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt="Gönderi görseli"
                  style={{
                    maxHeight: 384,
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 16,
                    marginTop: 12,
                  }}
                />
              )}

              {/* X-style action row: Reply · Repost · Like · Views · Bookmark · Share */}
              <Flex justify="space-between" align="center" style={{ marginTop: 12, maxWidth: 425 }}>
                <ActionBtn
                  icon={<CommentOutlined />}
                  count={post.commentsCount}
                  color={token.colorTextTertiary}
                  hoverColor="#1D9BF0"
                  onClick={() => setShowComments((c) => !c)}
                />
                <ActionBtn
                  icon={<RetweetOutlined />}
                  color={token.colorTextTertiary}
                  hoverColor="#00BA7C"
                />
                <ActionBtn
                  icon={post.isLiked ? <HeartFilled /> : <HeartOutlined />}
                  count={post.likesCount}
                  color={post.isLiked ? "#F91880" : token.colorTextTertiary}
                  hoverColor="#F91880"
                  onClick={handleToggleLike}
                />
                <ActionBtn
                  icon={<BarChartOutlined />}
                  count={Math.floor(Math.random() * 500) + 50}
                  color={token.colorTextTertiary}
                  hoverColor="#1D9BF0"
                />
                <Flex align="center" gap={8}>
                  <ActionBtn
                    icon={<BookOutlined />}
                    color={token.colorTextTertiary}
                    hoverColor="#1D9BF0"
                  />
                  <ActionBtn
                    icon={<ShareAltOutlined />}
                    color={token.colorTextTertiary}
                    hoverColor="#1D9BF0"
                  />
                </Flex>
              </Flex>
            </>
          )}

          {!isEditing && <PostCommentsPanel postId={post.id} isOpen={showComments} />}
        </Flex>
      </Flex>
    </List.Item>
  );
}
