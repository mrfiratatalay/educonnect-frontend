import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Empty,
  Flex,
  Grid,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Tabs,
  Tag,
  Typography,
  theme,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Camera, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useDiscountsQuery } from "@/features/discounts/hooks";
import type { AppDiscount } from "@/features/discounts/types";
import { useCategoriesQuery, useProductsQuery } from "@/features/products/hooks";
import type { ProductCondition, ProductFilters } from "@/features/products/types";
import DiscountCard from "@/pages/Market/components/DiscountCard";
import ProductCard from "@/pages/Market/components/ProductCard";
import VisualSearchPanel from "@/pages/Market/components/VisualSearchPanel";
import ProductFormModal from "@/pages/Market/components/ProductFormModal";
import type { VisualSearchResult } from "@/pages/Market/components/VisualSearchPanel";

const conditionOptions: { label: string; value: ProductCondition | "all" }[] = [
  { label: "Tüm durumlar", value: "all" },
  { label: "Sıfır", value: "new" },
  { label: "Yeni gibi", value: "likeNew" },
  { label: "İyi", value: "good" },
  { label: "Kullanılmış", value: "fair" },
];

const PAGE_SIZE = 12;
type MarketTabKey = "products" | "discounts";
type DiscountCategory =
  | "all"
  | "Yeme İçme"
  | "Kırtasiye"
  | "Teknoloji"
  | "Ulaşım"
  | "Giyim"
  | "Diğer";

export default function MarketPage() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const padding = screens.xs ? 16 : screens.lg ? 32 : 24;
  const activeTab: MarketTabKey =
    searchParams.get("tab") === "discounts" ? "discounts" : "products";

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showVsPanel, setShowVsPanel] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [vsResults, setVsResults] = useState<VisualSearchResult[] | null>(null);
  const [selectedDiscountCategory, setSelectedDiscountCategory] =
    useState<DiscountCategory>("all");
  const [selectedBusiness, setSelectedBusiness] = useState<string | undefined>();
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const categoriesQuery = useCategoriesQuery(activeTab === "products");
  const discountsQuery = useDiscountsQuery(activeTab === "discounts");
  const filters: ProductFilters = {
    searchTerm: debouncedSearch || undefined,
    categoryId: selectedCategory,
    minPrice, maxPrice,
    condition: selectedCondition === "all" ? undefined : selectedCondition,
    page, pageSize: PAGE_SIZE,
  };
  const productsQuery = useProductsQuery(filters, activeTab === "products");
  const products = productsQuery.data?.items ?? [];
  const totalCount = productsQuery.data?.totalCount ?? 0;
  const discountQuery = debouncedSearch.toLocaleLowerCase("tr-TR");
  const discountBusinesses = Array.from(
    new Set((discountsQuery.data ?? []).map((discount) => discount.businessName)),
  ).sort((left, right) => left.localeCompare(right, "tr"));
  const discounts = (discountsQuery.data ?? []).filter((discount) => {
    const inferredCategory = inferDiscountCategory(discount);

    if (selectedDiscountCategory !== "all" && inferredCategory !== selectedDiscountCategory) {
      return false;
    }

    if (selectedBusiness && discount.businessName !== selectedBusiness) {
      return false;
    }

    if (!discountQuery) return true;

    return (
      discount.title.toLocaleLowerCase("tr-TR").includes(discountQuery) ||
      discount.businessName.toLocaleLowerCase("tr-TR").includes(discountQuery) ||
      discount.description.toLocaleLowerCase("tr-TR").includes(discountQuery) ||
      (discount.code?.toLocaleLowerCase("tr-TR").includes(discountQuery) ?? false)
    );
  });
  const showingVs = vsResults !== null && vsResults.length > 0;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
    clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setDebouncedSearch(value.trim()), 400);
  };

  const handleResetFilters = () => {
    setSearchQuery(""); setDebouncedSearch("");
    setSelectedCondition("all"); setSelectedCategory(undefined);
    setMinPrice(undefined); setMaxPrice(undefined);
    setSelectedDiscountCategory("all"); setSelectedBusiness(undefined);
    setPage(1);
  };

  const handleVsResults = (results: VisualSearchResult[] | null) => {
    setVsResults(results);
    if (!results) setShowVsPanel(false);
  };

  const categoryOptions = (categoriesQuery.data ?? []).map((c) => ({ label: c.name, value: c.id }));

  const handleTabChange = (key: string) => {
    const nextTab = key === "discounts" ? "discounts" : "products";
    setSearchParams(nextTab === "products" ? {} : { tab: nextTab }, { replace: true });
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
    setShowFilters(false);
    setShowVsPanel(false);
    setVsResults(null);
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding }}>
      <Flex vertical gap={16}>
        <Flex align="center" justify="space-between" wrap gap={12}>
          <div>
            <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0 }}>Pazar</Typography.Title>
            <Typography.Text type="secondary">
              Öğrenciden öğrenciye ikinci el ilanlar ve öğrenciye özel indirimler
            </Typography.Text>
          </div>
          {activeTab === "products" ? (
            <Button type="primary" icon={<Plus size={14} />} onClick={() => setIsCreateOpen(true)}>
              İlan Oluştur
            </Button>
          ) : null}
        </Flex>

        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={[
            { key: "products", label: "İlanlar" },
            { key: "discounts", label: "İndirimler" },
          ]}
          style={{ marginBottom: -8 }}
        />

        <Flex gap={8} align="center" wrap>
          <Input.Search
            placeholder={activeTab === "products" ? "Ürün ara..." : "İndirim veya işletme ara..."}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={(v) => setDebouncedSearch(v.trim())}
            style={{ flex: 1, minWidth: 200, maxWidth: 400 }}
            allowClear
            size="large"
          />
          {activeTab === "products" ? (
            <>
              <Button
                icon={<Camera size={16} />}
                size="large"
                type={showVsPanel ? "primary" : "default"}
                onClick={() => setShowVsPanel((v) => !v)}
              >
                {screens.sm ? "Görsel Ara" : undefined}
              </Button>
              <Button
                icon={showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                size="large"
                onClick={() => setShowFilters((v) => !v)}
              >
                {screens.sm ? "Filtrele" : undefined}
              </Button>
            </>
          ) : (
            <Button
              icon={showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              size="large"
              onClick={() => setShowFilters((v) => !v)}
            >
              {screens.sm ? "Filtrele" : undefined}
            </Button>
          )}
        </Flex>

        {showFilters && activeTab === "products" && (
          <Card size="small" style={{ borderColor: token.colorBorderSecondary }} styles={{ body: { padding: 12 } }}>
            <Flex align="center" gap={12} wrap>
              <Select placeholder="Kategori" options={categoryOptions} value={selectedCategory}
                onChange={(v) => { setSelectedCategory(v); setPage(1); }}
                style={{ minWidth: 160 }} allowClear loading={categoriesQuery.isLoading} />
              <Select options={conditionOptions} value={selectedCondition}
                onChange={(v) => { setSelectedCondition(v); setPage(1); }}
                style={{ minWidth: 160 }} />
              <InputNumber placeholder="Min TL" min={0} value={minPrice}
                onChange={(v) => { setMinPrice(v ?? undefined); setPage(1); }}
                style={{ width: 110 }} />
              <InputNumber placeholder="Max TL" min={0} value={maxPrice}
                onChange={(v) => { setMaxPrice(v ?? undefined); setPage(1); }}
                style={{ width: 110 }} />
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters} type="text">Sıfırla</Button>
            </Flex>
          </Card>
        )}

        {showFilters && activeTab === "discounts" ? (
          <Card
            size="small"
            style={{ borderColor: token.colorBorderSecondary }}
            styles={{ body: { padding: 12 } }}
          >
            <Flex align="center" gap={12} wrap>
              <Select
                value={selectedDiscountCategory}
                onChange={(value) => setSelectedDiscountCategory(value)}
                options={[
                  { label: "Tüm kategoriler", value: "all" },
                  { label: "Yeme İçme", value: "Yeme İçme" },
                  { label: "Kırtasiye", value: "Kırtasiye" },
                  { label: "Teknoloji", value: "Teknoloji" },
                  { label: "Ulaşım", value: "Ulaşım" },
                  { label: "Giyim", value: "Giyim" },
                  { label: "Diğer", value: "Diğer" },
                ]}
                style={{ minWidth: 180 }}
              />
              <Select
                placeholder="İşletme"
                value={selectedBusiness}
                onChange={(value) => setSelectedBusiness(value)}
                options={discountBusinesses.map((business) => ({
                  label: business,
                  value: business,
                }))}
                style={{ minWidth: 220 }}
                allowClear
              />
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters} type="text">
                Sıfırla
              </Button>
            </Flex>
          </Card>
        ) : null}

        {activeTab === "products" && showVsPanel ? (
          <VisualSearchPanel onResultsChange={handleVsResults} />
        ) : null}

        {activeTab === "products" && showingVs ? (
          <VsResultsGrid results={vsResults} onNavigate={(id) => navigate(`/market/${id}`)} />
        ) : activeTab === "products" ? productsQuery.isLoading ? (
          <Flex justify="center" style={{ padding: 60 }}><Spin size="large" /></Flex>
        ) : products.length === 0 ? (
          <Card><Empty description="Henüz ilan bulunamadı." /></Card>
        ) : (
          <>
            <Row gutter={[20, 20]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} md={12} xl={8}>
                  <ProductCard
                    product={product}
                    onClick={() => navigate(`/market/${product.id}`)}
                    onSellerClick={(sellerId) => navigate(`/profile/${sellerId}`)}
                  />
                </Col>
              ))}
            </Row>
            {totalCount > PAGE_SIZE && (
              <Flex justify="center" gap={8} style={{ marginTop: 8 }}>
                <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Önceki</Button>
                <Tag style={{ lineHeight: "32px" }}>{page} / {Math.ceil(totalCount / PAGE_SIZE)}</Tag>
                <Button disabled={page >= Math.ceil(totalCount / PAGE_SIZE)} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
              </Flex>
            )}
          </>
        ) : discountsQuery.isLoading ? (
          <Flex justify="center" style={{ padding: 60 }}><Spin size="large" /></Flex>
        ) : discounts.length === 0 ? (
          <Card><Empty description="Aramanıza uygun aktif indirim bulunamadı." /></Card>
        ) : (
          <Row gutter={[20, 20]}>
            {discounts.map((discount) => (
              <Col key={discount.id} xs={24} md={12} xl={8}>
                <DiscountCard discount={discount} />
              </Col>
            ))}
          </Row>
        )}

        {activeTab === "products" && productsQuery.isError && !showingVs && (
          <Card><Empty description="Ürünler yüklenirken hata oluştu." /></Card>
        )}
        {activeTab === "discounts" && discountsQuery.isError ? (
          <Card><Empty description="İndirimler yüklenirken hata oluştu." /></Card>
        ) : null}
      </Flex>

      <ProductFormModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

function VsResultsGrid({ results, onNavigate }: { results: VisualSearchResult[]; onNavigate: (id: string) => void }) {
  const { token } = theme.useToken();
  return (
    <>
      <Typography.Text strong style={{ fontSize: 15 }}>
        Görsel Arama Sonuçları ({results.length})
      </Typography.Text>
      <Row gutter={[16, 16]}>
        {results.map((r) => (
          <Col key={r.productId} xs={12} md={8} lg={6}>
            <Card size="small" hoverable onClick={() => onNavigate(r.productId)}
              cover={r.imageUrl ? (
                <div style={{ height: 140, backgroundImage: `url(${r.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              ) : undefined}
              styles={{ body: { padding: 10 } }}>
              <Typography.Text strong ellipsis style={{ fontSize: 13, display: "block" }}>{r.title}</Typography.Text>
              <Flex align="center" justify="space-between" style={{ marginTop: 4 }}>
                <Typography.Text strong style={{ color: token.colorPrimary }}>
                  {r.price.toLocaleString("tr-TR")} TL
                </Typography.Text>
                <Tag color="green" style={{ fontSize: 11 }}>%{Math.round(r.similarityScore * 100)}</Tag>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}

function inferDiscountCategory(discount: AppDiscount): DiscountCategory {
  const source = `${discount.businessName} ${discount.title} ${discount.description}`.toLocaleLowerCase("tr-TR");

  if (containsAny(source, ["kafe", "cafe", "kahve", "burger", "pizza", "yemek", "restoran"])) {
    return "Yeme İçme";
  }

  if (containsAny(source, ["kirtasiye", "defter", "kalem", "baski", "fotokopi", "kitap"])) {
    return "Kırtasiye";
  }

  if (containsAny(source, ["teknoloji", "telefon", "laptop", "kulaklik", "bilgisayar", "tablet"])) {
    return "Teknoloji";
  }

  if (containsAny(source, ["ulasim", "otobus", "servis", "taksi", "yolculuk"])) {
    return "Ulaşım";
  }

  if (containsAny(source, ["giyim", "ayakkabi", "ceket", "magaza", "tekstil"])) {
    return "Giyim";
  }

  return "Diğer";
}

function containsAny(source: string, terms: string[]) {
  return terms.some((term) => source.includes(term));
}
