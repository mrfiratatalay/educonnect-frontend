import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Carousel,
  Descriptions,
  Empty,
  Flex,
  Grid,
  Image,
  Popconfirm,
  Spin,
  Tag,
  Typography,
  message,
  theme,
} from "antd";
import { ArrowLeft, MapPin, Pencil, Store, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import { useProductDetailQuery, useDeleteProductMutation } from "@/features/products/hooks";
import { CONDITION_LABELS, CONDITION_COLORS } from "@/features/products/types";
import { useAuthStore } from "@/store/authStore";
import ProductFormModal from "@/pages/Market/components/ProductFormModal";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const padding = screens.xs ? 16 : 24;
  const [isEditOpen, setIsEditOpen] = useState(false);

  const productQuery = useProductDetailQuery(id ?? null);
  const deleteMutation = useDeleteProductMutation();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const product = productQuery.data;
  const isOwner = product && currentUserId && product.sellerId === currentUserId;

  const handleDelete = async () => {
    if (!product) return;
    try {
      await deleteMutation.mutateAsync(product.id);
      message.success("Ilan silindi.");
      navigate("/market");
    } catch {
      message.error("Silinemedi.");
    }
  };

  if (productQuery.isLoading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "50vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!product) {
    return (
      <Flex vertical align="center" style={{ padding: 60 }}>
        <Empty description="Urun bulunamadi." />
        <Button type="link" onClick={() => navigate("/market")}>Pazara don</Button>
      </Flex>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding }}>
      <Button
        type="text"
        icon={<ArrowLeft size={16} />}
        onClick={() => navigate("/market")}
        style={{ marginBottom: 16 }}
      >
        Pazara Don
      </Button>

      <Flex gap={24} wrap vertical={!screens.md}>
        <div style={{ flex: "0 0 360px", maxWidth: screens.md ? 360 : "100%" }}>
          {product.imageUrls.length > 0 ? (
            product.imageUrls.length === 1 ? (
              <Image
                src={product.imageUrls[0]}
                alt={product.title}
                style={{ borderRadius: 12, width: "100%", objectFit: "cover" }}
              />
            ) : (
              <Carousel autoplay style={{ borderRadius: 12, overflow: "hidden" }}>
                {product.imageUrls.map((url, i) => (
                  <div key={i}>
                    <Image
                      src={url}
                      alt={`${product.title} ${i + 1}`}
                      style={{ width: "100%", aspectRatio: "1", objectFit: "cover" }}
                      preview={false}
                    />
                  </div>
                ))}
              </Carousel>
            )
          ) : (
            <Card>
              <Flex align="center" justify="center" style={{ height: 240 }}>
                <Store size={48} color="#ccc" />
              </Flex>
            </Card>
          )}
        </div>

        <Flex vertical gap={16} style={{ flex: 1 }}>
          <Flex align="center" gap={8} wrap>
            <Tag color="processing">{product.categoryName ?? "Diger"}</Tag>
            <Tag color={CONDITION_COLORS[product.condition]}>
              {CONDITION_LABELS[product.condition]}
            </Tag>
            {product.isNegotiable && <Tag color="orange">Pazarlik yapilir</Tag>}
          </Flex>

          <Typography.Title level={3} style={{ margin: 0 }}>
            {product.title}
          </Typography.Title>

          <Typography.Title level={2} style={{ margin: 0, color: token.colorPrimary }}>
            {product.price.toLocaleString("tr-TR")} TL
          </Typography.Title>

          <Typography.Paragraph style={{ fontSize: 15, whiteSpace: "pre-wrap" }}>
            {product.description}
          </Typography.Paragraph>

          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="Satici">{product.sellerName}</Descriptions.Item>
            <Descriptions.Item label="Sehir">
              <Flex align="center" gap={4}><MapPin size={14} /> {product.city}</Flex>
            </Descriptions.Item>
            <Descriptions.Item label="Ilan Tarihi">
              {dayjs(product.createdAtUtc).format("DD MMMM YYYY")}
            </Descriptions.Item>
          </Descriptions>

          {isOwner && (
            <Flex gap={8}>
              <Button icon={<Pencil size={14} />} onClick={() => setIsEditOpen(true)}>
                Ilani Duzenle
              </Button>
              <Popconfirm
                title="Bu ilani silmek istediginize emin misiniz?"
                onConfirm={handleDelete}
                okText="Evet, sil"
                cancelText="Vazgec"
              >
                <Button danger icon={<Trash2 size={14} />} loading={deleteMutation.isPending}>
                  Ilani Sil
                </Button>
              </Popconfirm>
            </Flex>
          )}
        </Flex>
      </Flex>

      <ProductFormModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        product={product}
      />
    </div>
  );
}
