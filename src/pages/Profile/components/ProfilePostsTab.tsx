import { useState } from "react";
import { Alert, Button, Empty, Flex, Spin, Tag, Typography } from "antd";
import { useUserPostsQuery } from "@/features/posts/hooks";
import PostCard from "@/pages/Feed/components/PostCard";

interface ProfilePostsTabProps {
  userId: string;
}

export default function ProfilePostsTab({ userId }: ProfilePostsTabProps) {
  const [page, setPage] = useState(1);
  const postsQuery = useUserPostsQuery(userId, page);
  const posts = postsQuery.data?.items ?? [];
  const totalCount = postsQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 10);

  if (postsQuery.isLoading) {
    return <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>;
  }

  if (postsQuery.isError) {
    return <Alert type="error" showIcon message="Gonderiler yuklenirken bir hata olustu." />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text type="secondary">Henuz gonderi paylasilmadi.</Typography.Text>}
      />
    );
  }

  return (
    <Flex vertical gap={12}>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {totalPages > 1 && (
        <Flex justify="center" gap={8}>
          <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Onceki</Button>
          <Tag style={{ lineHeight: "32px" }}>{page} / {totalPages}</Tag>
          <Button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
        </Flex>
      )}
    </Flex>
  );
}
