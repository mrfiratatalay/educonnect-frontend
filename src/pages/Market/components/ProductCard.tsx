import { Avatar, Button, Card, Flex, Tag, Typography } from "antd";
import { Store } from "lucide-react";
import dayjs from "dayjs";
import type { ProductResponse } from "@/features/products/types";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/features/products/types";

interface ProductCardProps {
  product: ProductResponse;
  onClick?: () => void;
  onSellerClick?: (sellerId: string) => void;
}

export default function ProductCard({ product, onClick, onSellerClick }: ProductCardProps) {
  const coverUrl = product.imageUrls[0];

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : undefined }}
      cover={
        coverUrl ? (
          <div
            style={{
              aspectRatio: "1 / 1",
              backgroundImage: `url(${coverUrl})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            style={{ aspectRatio: "1 / 1", background: "#f5f5f5" }}
          >
            <Store size={40} color="#bbb" />
          </Flex>
        )
      }
      styles={{ body: { padding: 18 } }}
    >
      <Flex vertical gap={12}>
        <Flex align="center" justify="space-between" gap={8}>
          <Tag color="processing">{product.categoryName ?? "Diğer"}</Tag>
          <Tag color={CONDITION_COLORS[product.condition]}>
            {CONDITION_LABELS[product.condition]}
          </Tag>
        </Flex>

        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {product.title}
          </Typography.Title>
          <Typography.Paragraph
            ellipsis={{ rows: 2 }}
            type="secondary"
            style={{ margin: "6px 0 0" }}
          >
            {product.description}
          </Typography.Paragraph>
        </div>

        <Flex align="center" justify="space-between" gap={8}>
          <Typography.Text strong style={{ fontSize: 18 }}>
            {product.price.toLocaleString("tr-TR")} TL
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(product.createdAtUtc).format("DD MMM")}
          </Typography.Text>
        </Flex>

        <Flex align="center" justify="space-between" gap={8}>
          <Avatar size="small" icon={<Store size={14} />} />
          <Flex align="center" justify="space-between" gap={8} style={{ flex: 1, minWidth: 0 }}>
            <div style={{ minWidth: 0 }}>
              <Typography.Text strong ellipsis style={{ fontSize: 13, display: "block" }}>
                {product.sellerName}
              </Typography.Text>
              {product.city && (
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: 11, display: "block" }}
                >
                  {product.city}
                </Typography.Text>
              )}
            </div>
            {onSellerClick ? (
              <Button
                type="link"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onSellerClick(product.sellerId);
                }}
                style={{ paddingInline: 0, flexShrink: 0 }}
              >
                Profili gor
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}
