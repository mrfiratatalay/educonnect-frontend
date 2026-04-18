import { useState } from "react";
import { Alert, Button, Empty, Flex, Spin, Tag, Typography } from "antd";
import { useUserLikedPostsQuery } from "@/features/posts/hooks";
import PostCard from "@/pages/Feed/components/PostCard";

interface ProfileLikesTabProps {
  userId: string;
}

export default function ProfileLikesTab({ userId }: ProfileLikesTabProps) {
  const [page, setPage] = useState(1);
  const likesQuery = useUserLikedPostsQuery(userId, page);
  const posts = likesQuery.data?.items ?? [];
  const totalCount = likesQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  if (likesQuery.isLoading) {
    return <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>;
  }

  if (likesQuery.isError) {
    return <Alert type="error" showIcon message="Beğeniler yüklenirken bir hata olustu." />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text type="secondary">Beğeni gecmisi bulunmuyor.</Typography.Text>}
      />
    );
  }

  return (
    <Flex vertical gap={12}>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {totalPages > 1 && (
        <Flex justify="center" gap={8}>
          <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
          <Tag style={{ lineHeight: "32px" }}>{page} / {totalPages}</Tag>
          <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
        </Flex>
      )}
    </Flex>
  );
}
