import { Alert, Button, Empty, Flex, Spin, Typography } from "antd";
import { useInfiniteBookmarkedPostsQuery } from "@/features/posts/hooks";
import PostCard from "@/pages/Feed/components/PostCard";

export default function ProfileSavedTab() {
  const bookmarksQuery = useInfiniteBookmarkedPostsQuery(10);
  const pages = bookmarksQuery.data?.pages ?? [];
  const posts = pages.flatMap((p) => p.items);

  if (bookmarksQuery.isLoading) {
    return <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>;
  }

  if (bookmarksQuery.isError) {
    return <Alert type="error" showIcon message="Kaydedilenler yuklenirken bir hata olustu." />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text type="secondary">Kaydedilmis icerik bulunmuyor.</Typography.Text>}
      />
    );
  }

  return (
    <Flex vertical gap={12}>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      {bookmarksQuery.hasNextPage && (
        <Flex justify="center">
          <Button onClick={() => bookmarksQuery.fetchNextPage()} loading={bookmarksQuery.isFetchingNextPage}>
            Daha fazla yukle
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
