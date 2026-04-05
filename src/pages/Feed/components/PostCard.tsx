import { useState } from "react";
import {
  CommentOutlined,
  DeleteOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Dropdown, Flex, Image, Typography, theme, Space, List } from "antd";
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
    {
      type: "divider",
    },
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

  const actions = [
    <Space size={4} key="like">
      <Button
        type="text"
        shape="circle"
        onClick={handleToggleLike}
        loading={isLiking}
        icon={post.isLiked ? <HeartFilled style={{ color: "#EF4444" }} /> : <HeartOutlined />}
        style={{ color: post.isLiked ? "#EF4444" : token.colorTextSecondary }}
      />
      <Typography.Text style={{ color: post.isLiked ? "#EF4444" : token.colorTextSecondary, fontSize: 13, userSelect: 'none' }}>
        {post.likesCount > 0 ? post.likesCount : ''}
      </Typography.Text>
    </Space>,
    <Space size={4} key="comment">
      <Button
        type="text"
        shape="circle"
        onClick={() => setShowComments((current) => !current)}
        icon={<CommentOutlined />}
        style={{ color: showComments ? token.colorPrimary : token.colorTextSecondary }}
      />
      <Typography.Text style={{ color: showComments ? token.colorPrimary : token.colorTextSecondary, fontSize: 13, userSelect: 'none' }}>
        {post.commentsCount > 0 ? post.commentsCount : ''}
      </Typography.Text>
    </Space>
  ];

  return (
    <List.Item 
      style={{ padding: "16px 20px" }}
    >
      <Flex gap={16} align="flex-start" style={{ width: "100%" }}>
        <Avatar
          src={post.avatarUrl}
          size={48}
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

        <Flex vertical gap={12} style={{ flex: 1, minWidth: 0 }}>
          <Flex align="flex-start" justify="space-between" gap={12}>
            <div>
              <Typography.Link
                onClick={() => navigate(`/profile/${post.userId}`)}
                style={{ fontWeight: 600, fontSize: 14 }}
              >
                {post.userName}
              </Typography.Link>
              <Typography.Text
                type="secondary"
                style={{ fontSize: 12, display: "block", marginTop: 2 }}
              >
                {formatPostTime(post.createdAt)}
              </Typography.Text>
            </div>

            {canManage && (
              <Dropdown
                menu={{
                  items: managementItems,
                  onClick: ({ key }) => handleManagementClick(String(key)),
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button icon={<MoreOutlined />} shape="circle" type="text" />
              </Dropdown>
            )}
          </Flex>

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
                style={{ marginBottom: 0, lineHeight: 1.7, whiteSpace: "pre-wrap" }}
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
                    borderRadius: token.borderRadiusLG,
                  }}
                />
              )}
              <Flex gap={24} align="center" wrap="wrap" style={{ marginTop: 16 }}>
                {actions}
              </Flex>
            </>
          )}

          {!isEditing && <PostCommentsPanel postId={post.id} isOpen={showComments} />}
        </Flex>
      </Flex>
    </List.Item>
  );
}
