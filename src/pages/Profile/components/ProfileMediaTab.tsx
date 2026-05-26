import { useState } from "react";
import { Alert, Button, Col, Empty, Flex, Image, Row, Spin, Tag, Typography } from "antd";
import { useUserMediaPostsQuery } from "@/features/posts/hooks";

interface ProfileMediaTabProps {
  userId: string;
}

export default function ProfileMediaTab({ userId }: ProfileMediaTabProps) {
  const [page, setPage] = useState(1);
  const mediaQuery = useUserMediaPostsQuery(userId, page);
  const posts = mediaQuery.data?.items ?? [];
  const totalCount = mediaQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / 20);

  if (mediaQuery.isLoading) {
    return <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>;
  }

  if (mediaQuery.isError) {
    return <Alert type="error" showIcon message="Medya içerikleri yüklenirken bir hata oluştu." />;
  }

  if (posts.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text type="secondary">Fotoğraf veya video iceren gönderi bulunmuyor.</Typography.Text>}
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Row gutter={[8, 8]}>
        {posts.map((post) => (
          <Col key={post.id} xs={8} sm={6}>
            <Image
              src={post.imageUrl}
              alt={post.content ? `Gönderi: ${post.content.slice(0, 60)}` : "Profil medya görseli"}
              style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8 }}
              preview
            />
          </Col>
        ))}
      </Row>
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
