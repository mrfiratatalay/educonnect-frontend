import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Col, Empty, Flex, Row, Spin, Tag, Typography } from "antd";
import { useProductsQuery } from "@/features/products/hooks";
import ProductCard from "@/pages/Market/components/ProductCard";

interface ProfileListingsTabProps {
  userId: string;
}

const PAGE_SIZE = 6;

export default function ProfileListingsTab({ userId }: ProfileListingsTabProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const productsQuery = useProductsQuery({ sellerId: userId, page, pageSize: PAGE_SIZE });
  const products = productsQuery.data?.items ?? [];
  const totalCount = productsQuery.data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  if (productsQuery.isLoading) {
    return <Flex justify="center" style={{ padding: 40 }}><Spin /></Flex>;
  }

  if (productsQuery.isError) {
    return <Alert type="error" showIcon message="Ilanlar yuklenirken bir hata olustu." />;
  }

  if (products.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={<Typography.Text type="secondary">Aktif ilan bulunmuyor.</Typography.Text>}
      />
    );
  }

  return (
    <Flex vertical gap={16}>
      <Row gutter={[16, 16]}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12}>
            <ProductCard
              product={product}
              onClick={() => navigate(`/market/${product.id}`)}
              onSellerClick={(sellerId) => navigate(`/profile/${sellerId}`)}
            />
          </Col>
        ))}
      </Row>
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
