import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Tag,
  Typography,
  theme,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { Camera, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useCategoriesQuery, useProductsQuery } from "@/features/products/hooks";
import type { ProductCondition, ProductFilters } from "@/features/products/types";
import ProductCard from "@/pages/Market/components/ProductCard";
import VisualSearchPanel from "@/pages/Market/components/VisualSearchPanel";
import ProductFormModal from "@/pages/Market/components/ProductFormModal";
import type { VisualSearchResult } from "@/pages/Market/components/VisualSearchPanel";

const conditionOptions: { label: string; value: ProductCondition | "all" }[] = [
  { label: "Tum durumlar", value: "all" },
  { label: "Sifir", value: "new" },
  { label: "Yeni gibi", value: "likeNew" },
  { label: "Iyi", value: "good" },
  { label: "Kullanilmis", value: "fair" },
];

const PAGE_SIZE = 12;

export default function MarketPage() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const padding = screens.xs ? 16 : screens.lg ? 32 : 24;

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
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const categoriesQuery = useCategoriesQuery();
  const filters: ProductFilters = {
    searchTerm: debouncedSearch || undefined,
    categoryId: selectedCategory,
    minPrice, maxPrice,
    condition: selectedCondition === "all" ? undefined : selectedCondition,
    page, pageSize: PAGE_SIZE,
  };
  const productsQuery = useProductsQuery(filters);
  const products = productsQuery.data?.items ?? [];
  const totalCount = productsQuery.data?.totalCount ?? 0;
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
    setPage(1);
  };

  const handleVsResults = (results: VisualSearchResult[] | null) => {
    setVsResults(results);
    if (!results) setShowVsPanel(false);
  };

  const categoryOptions = (categoriesQuery.data ?? []).map((c) => ({ label: c.name, value: c.id }));

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding }}>
      <Flex vertical gap={16}>
        <Flex align="center" justify="space-between" wrap gap={12}>
          <div>
            <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0 }}>Pazar</Typography.Title>
            <Typography.Text type="secondary">Ogrenciden ogrenciye ikinci el ilanlari</Typography.Text>
          </div>
          <Button type="primary" icon={<Plus size={14} />} onClick={() => setIsCreateOpen(true)}>
            Ilan Olustur
          </Button>
        </Flex>

        <Flex gap={8} align="center" wrap>
          <Input.Search
            placeholder="Urun ara..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={(v) => setDebouncedSearch(v.trim())}
            style={{ flex: 1, minWidth: 200, maxWidth: 400 }}
            allowClear
            size="large"
          />
          <Button
            icon={<Camera size={16} />}
            size="large"
            type={showVsPanel ? "primary" : "default"}
            onClick={() => setShowVsPanel((v) => !v)}
          >
            {screens.sm ? "Gorsel Ara" : undefined}
          </Button>
          <Button
            icon={showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            size="large"
            onClick={() => setShowFilters((v) => !v)}
          >
            {screens.sm ? "Filtrele" : undefined}
          </Button>
        </Flex>

        {showFilters && (
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
              <Button icon={<ReloadOutlined />} onClick={handleResetFilters} type="text">Sifirla</Button>
            </Flex>
          </Card>
        )}

        {showVsPanel && <VisualSearchPanel onResultsChange={handleVsResults} />}

        {showingVs ? (
          <VsResultsGrid results={vsResults} onNavigate={(id) => navigate(`/market/${id}`)} />
        ) : productsQuery.isLoading ? (
          <Flex justify="center" style={{ padding: 60 }}><Spin size="large" /></Flex>
        ) : products.length === 0 ? (
          <Card><Empty description="Henuz ilan bulunamadi." /></Card>
        ) : (
          <>
            <Row gutter={[20, 20]}>
              {products.map((product) => (
                <Col key={product.id} xs={24} md={12} xl={8}>
                  <ProductCard product={product} onClick={() => navigate(`/market/${product.id}`)} />
                </Col>
              ))}
            </Row>
            {totalCount > PAGE_SIZE && (
              <Flex justify="center" gap={8} style={{ marginTop: 8 }}>
                <Button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Onceki</Button>
                <Tag style={{ lineHeight: "32px" }}>{page} / {Math.ceil(totalCount / PAGE_SIZE)}</Tag>
                <Button disabled={page >= Math.ceil(totalCount / PAGE_SIZE)} onClick={() => setPage((p) => p + 1)}>Sonraki</Button>
              </Flex>
            )}
          </>
        )}

        {productsQuery.isError && !showingVs && (
          <Card><Empty description="Urunler yuklenirken hata olustu." /></Card>
        )}
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
        Gorsel Arama Sonuclari ({results.length})
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
