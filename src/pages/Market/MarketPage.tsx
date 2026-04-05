import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Tabs,
  Tag,
  Typography,
  theme,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { MessageSquare, Store } from "lucide-react";
import { mockDiscounts, mockProducts } from "@/data/mock";
import ExploreDiscountGrid from "@/pages/Explore/components/ExploreDiscountGrid";
import ExplorePageActions from "@/pages/Explore/components/ExplorePageActions";
import type { Product } from "@/types";

type MarketTab = "second-hand" | "discounts";
type ProductConditionFilter = Product["condition"] | "all";
type ProductSort = "newest" | "price_asc" | "price_desc";

const productConditionLabels: Record<Product["condition"], string> = {
  new: "Sifir",
  "like-new": "Yeni gibi",
  good: "Iyi",
  fair: "Kullanilmis",
};

const productConditionColors: Record<Product["condition"], string> = {
  new: "green",
  "like-new": "cyan",
  good: "blue",
  fair: "default",
};

const conditionOptions = [
  { label: "Tum durumlar", value: "all" },
  { label: "Sifir", value: "new" },
  { label: "Yeni gibi", value: "like-new" },
  { label: "Iyi", value: "good" },
  { label: "Kullanilmis", value: "fair" },
] as const satisfies Array<{ label: string; value: ProductConditionFilter }>;

const sortOptions = [
  { label: "En yeni ilanlar", value: "newest" },
  { label: "Fiyat: once dusuk", value: "price_asc" },
  { label: "Fiyat: once yuksek", value: "price_desc" },
] as const satisfies Array<{ label: string; value: ProductSort }>;

interface CreateListingFormValues {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: Product["condition"];
}

export default function MarketPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;
  const [products, setProducts] = useState<Product[]>(() => mockProducts.filter((product) => product.isActive));
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<ProductConditionFilter>("all");
  const [sortBy, setSortBy] = useState<ProductSort>("newest");
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [createForm] = Form.useForm<CreateListingFormValues>();
  const activeTab: MarketTab = searchParams.get("tab") === "discounts" ? "discounts" : "second-hand";

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort((left, right) => left.localeCompare(right, "tr")),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr");
    const nextProducts = products.filter((product) => {
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }

      if (selectedCondition !== "all" && product.condition !== selectedCondition) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [product.title, product.description, product.category, product.sellerName]
        .some((value) => value.toLocaleLowerCase("tr").includes(normalizedQuery));
    });

    return [...nextProducts].sort((left, right) => {
      if (sortBy === "price_asc") {
        return left.price - right.price;
      }

      if (sortBy === "price_desc") {
        return right.price - left.price;
      }

      return dayjs(right.createdAt).valueOf() - dayjs(left.createdAt).valueOf();
    });
  }, [products, searchQuery, selectedCategory, selectedCondition, sortBy]);

  const filteredDiscounts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLocaleLowerCase("tr");

    if (!normalizedQuery) {
      return mockDiscounts.filter((discount) => discount.isActive);
    }

    return mockDiscounts.filter(
      (discount) =>
        discount.isActive &&
        [discount.businessName, discount.title, discount.description, discount.code]
          .filter(Boolean)
          .some((value) => value?.toLocaleLowerCase("tr").includes(normalizedQuery)),
    );
  }, [searchQuery]);

  const activeFilterCount =
    Number(Boolean(selectedCategory)) +
    Number(selectedCondition !== "all") +
    Number(sortBy !== "newest");

  function handleTabChange(nextTab: string) {
    const resolvedTab: MarketTab = nextTab === "discounts" ? "discounts" : "second-hand";
    setSearchQuery("");
    setIsFilterBarOpen(false);
    setSearchParams(resolvedTab === "second-hand" ? {} : { tab: resolvedTab }, { replace: true });
  }

  function handleResetFilters() {
    setSelectedCategory(null);
    setSelectedCondition("all");
    setSortBy("newest");
  }

  async function handleCreateListing() {
    const values = await createForm.validateFields();
    const coverImage = products.find((product) => product.category === values.category)?.imageUrl ?? mockProducts[0]?.imageUrl ?? "";

    setProducts((currentProducts) => [
      {
        id: `local-product-${Date.now()}`,
        title: values.title.trim(),
        description: values.description.trim(),
        price: values.price,
        imageUrl: coverImage,
        category: values.category,
        sellerName: "Sen",
        condition: values.condition,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      ...currentProducts,
    ]);

    setIsCreateListingOpen(false);
    createForm.resetFields();
  }

  const actionBar = (
    <ExplorePageActions
      createButtonLabel={activeTab === "second-hand" ? "Ilan Olustur" : null}
      filterCount={activeTab === "second-hand" ? activeFilterCount : 0}
      isFilterOpen={isFilterBarOpen}
      onCreate={() => setIsCreateListingOpen(true)}
      onSearchQueryChange={setSearchQuery}
      onToggleFilters={activeTab === "second-hand" ? () => setIsFilterBarOpen((currentValue) => !currentValue) : undefined}
      searchPlaceholder={activeTab === "second-hand" ? "Ikinci el ilani ara" : "Indirim ara"}
      searchQuery={searchQuery}
    />
  );

  const tabItems = [
    {
      key: "second-hand",
      label: "Ikinci El",
      children: (
        <Flex vertical gap={20}>
          {isFilterBarOpen && (
            <Card
              size="small"
              style={{ borderColor: token.colorBorderSecondary, background: token.colorFillQuaternary }}
              styles={{ body: { padding: 16 } }}
            >
              <Flex vertical gap={16}>
                <Flex align="center" justify="space-between" gap={12} wrap="wrap">
                  <Typography.Text strong>Filtreler</Typography.Text>
                  <Button icon={<ReloadOutlined />} onClick={handleResetFilters} type="text">
                    Sifirla
                  </Button>
                </Flex>

                <Flex gap={8} wrap="wrap">
                  <Tag.CheckableTag checked={selectedCategory === null} onChange={() => setSelectedCategory(null)}>
                    Tumu
                  </Tag.CheckableTag>
                  {categories.map((category) => (
                    <Tag.CheckableTag
                      key={category}
                      checked={selectedCategory === category}
                      onChange={(checked) => setSelectedCategory(checked ? category : null)}
                    >
                      {category}
                    </Tag.CheckableTag>
                  ))}
                </Flex>

                <Flex gap={12} wrap="wrap">
                  <Select
                    options={conditionOptions}
                    style={{ minWidth: 220 }}
                    value={selectedCondition}
                    onChange={setSelectedCondition}
                  />
                  <Select options={sortOptions} style={{ minWidth: 220 }} value={sortBy} onChange={setSortBy} />
                </Flex>
              </Flex>
            </Card>
          )}

          <ProductGrid products={filteredProducts} />
        </Flex>
      ),
    },
    {
      key: "discounts",
      label: "Indirimler",
      children: <ExploreDiscountGrid discounts={filteredDiscounts} />,
    },
  ];

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: pagePadding }}>
      <Flex vertical gap={24}>
        <div>
          <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0 }}>
            Pazar
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginTop: 4, display: "block" }}>
            Ogrenciden ogrenciye ikinci el ilanlari ve kampus indirimlerini ayni akista yonet.
          </Typography.Text>
        </div>

        <Tabs
          activeKey={activeTab}
          items={tabItems}
          onChange={handleTabChange}
          tabBarExtraContent={screens.md ? actionBar : undefined}
        />
        {!screens.md && actionBar}
      </Flex>

      <Modal
        destroyOnHidden
        okText="Ilani Yayinla"
        onCancel={() => {
          setIsCreateListingOpen(false);
          createForm.resetFields();
        }}
        onOk={() => void handleCreateListing()}
        open={isCreateListingOpen}
        title="Ikinci El Ilani Olustur"
      >
        <Form
          form={createForm}
          initialValues={{ condition: "good" as Product["condition"], category: categories[0] ?? "Kitap" }}
          layout="vertical"
        >
          <Form.Item
            label="Baslik"
            name="title"
            rules={[{ required: true, message: "Ilan basligi gerekli." }]}
          >
            <Input placeholder="Orn: Veri Yapilari kitabi" />
          </Form.Item>
          <Form.Item
            label="Aciklama"
            name="description"
            rules={[{ required: true, message: "Kisa bir aciklama gir." }]}
          >
            <Input.TextArea placeholder="Urun durumu, teslim sekli ve notlar..." rows={4} />
          </Form.Item>
          <Flex align="flex-start" gap={12}>
            <Form.Item
              label="Fiyat"
              name="price"
              rules={[{ required: true, message: "Fiyat gerekli." }]}
              style={{ flex: 1 }}
            >
              <InputNumber min={1} placeholder="250" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              label="Kategori"
              name="category"
              rules={[{ required: true, message: "Kategori sec." }]}
              style={{ flex: 1 }}
            >
              <Select
                options={
                  categories.length > 0
                    ? categories.map((category) => ({ label: category, value: category }))
                    : [{ label: "Kitap", value: "Kitap" }]
                }
              />
            </Form.Item>
          </Flex>
          <Form.Item
            label="Durum"
            name="condition"
            rules={[{ required: true, message: "Urun durumu sec." }]}
          >
            <Select options={conditionOptions.filter((option) => option.value !== "all")} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Card>
        <Empty description="Aradigin kriterlerde ilan bulunamadi." />
      </Card>
    );
  }

  return (
    <Row gutter={[20, 20]}>
      {products.map((product) => (
        <Col key={product.id} xs={24} md={12} xl={8}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card
      cover={
        <div
          style={{
            aspectRatio: "1 / 1",
            backgroundImage: `url(${product.imageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
      }
      hoverable
      styles={{ body: { padding: 18 } }}
    >
      <Flex vertical gap={14}>
        <Flex align="center" justify="space-between" gap={12}>
          <Tag color="processing">{product.category}</Tag>
          <Tag color={productConditionColors[product.condition]}>
            {productConditionLabels[product.condition]}
          </Tag>
        </Flex>

        <div>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {product.title}
          </Typography.Title>
          <Typography.Paragraph ellipsis={{ rows: 3 }} style={{ margin: "8px 0 0" }} type="secondary">
            {product.description}
          </Typography.Paragraph>
        </div>

        <Flex align="center" justify="space-between" gap={12}>
          <Typography.Text strong style={{ fontSize: 20 }}>
            {product.price} TL
          </Typography.Text>
          <Typography.Text style={{ fontSize: 12 }} type="secondary">
            {dayjs(product.createdAt).format("DD MMM")}
          </Typography.Text>
        </Flex>

        <Flex align="center" justify="space-between" gap={12}>
          <Flex align="center" gap={10}>
            <Avatar icon={<Store size={16} />} src={product.sellerAvatar} />
            <div>
              <Typography.Text strong style={{ display: "block" }}>
                {product.sellerName}
              </Typography.Text>
              <Typography.Text style={{ fontSize: 12 }} type="secondary">
                Kampuste teslim
              </Typography.Text>
            </div>
          </Flex>

          <Button icon={<MessageSquare size={16} />}>Mesaj Gonder</Button>
        </Flex>
      </Flex>
    </Card>
  );
}
