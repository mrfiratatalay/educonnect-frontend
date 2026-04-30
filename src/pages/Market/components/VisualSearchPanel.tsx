import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Flex,
  Image,
  Tag,
  Typography,
  Upload,
  theme,
} from "antd";
import { Camera, ImagePlus, Search, X } from "lucide-react";
import { useVisualSearchMutation } from "@/features/products/hooks";

export interface VisualSearchResult {
  productId: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string | null;
  categoryLabel: string;
  sellerName: string;
  similarityScore: number;
  rank: number;
  matchedSignals: string[];
}

interface VisualSearchAnalysis {
  productName: string;
  categoryLabel: string;
  description: string;
  keywords: string[];
  confidence: number;
}

interface VisualSearchPanelProps {
  onResultsChange: (results: VisualSearchResult[] | null) => void;
}

export default function VisualSearchPanel({ onResultsChange }: VisualSearchPanelProps) {
  const { token } = theme.useToken();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VisualSearchAnalysis | null>(null);
  const visualSearch = useVisualSearchMutation();

  const handleUpload = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("maxResults", "8");
    formData.append("mode", "strict");

    try {
      const response = await visualSearch.mutateAsync(formData);
      setAnalysis(response.analysis);
      onResultsChange(response.results);
    } catch {
      setAnalysis(null);
      onResultsChange(null);
    }

    return false;
  };

  const handleClear = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setAnalysis(null);
    onResultsChange(null);
  };

  return (
    <Card
      size="small"
      style={{ borderColor: token.colorBorderSecondary, background: token.colorBgLayout }}
      styles={{ body: { padding: 16 } }}
    >
      {!previewUrl ? (
        <Upload.Dragger
          accept="image/jpeg,image/png,image/webp"
          showUploadList={false}
          beforeUpload={handleUpload}
          style={{ border: "none", background: "transparent", padding: 0 }}
        >
          <Flex vertical align="center" gap={8} style={{ padding: "12px 0" }}>
            <Camera size={28} color={token.colorTextSecondary} />
            <Typography.Text strong>Fotoğrafla Ürün Ara</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              Bir ürün fotoğrafı yükleyin, bütçenize uygun benzer ürünleri bulalım
            </Typography.Text>
          </Flex>
        </Upload.Dragger>
      ) : (
        <Flex vertical gap={12}>
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={8}>
              <ImagePlus size={16} />
              <Typography.Text strong>Görsel Arama</Typography.Text>
            </Flex>
            <Button type="text" size="small" icon={<X size={14} />} onClick={handleClear}>
              Temizle
            </Button>
          </Flex>

          <Flex gap={16} align="start" wrap>
            <Image
              src={previewUrl}
              alt="Yüklenen görsel"
              width={120}
              height={120}
              style={{ objectFit: "cover", borderRadius: 8 }}
              preview={false}
            />
            <Flex vertical gap={6} style={{ flex: 1, minWidth: 200 }}>
              {visualSearch.isPending && (
                <Alert message="Görsel analiz ediliyor..." type="info" showIcon />
              )}
              {visualSearch.isError && (
                <Alert message="Arama sırasında hata oluştu." type="error" showIcon />
              )}
              {analysis && (
                <>
                  <Flex align="center" gap={8} wrap>
                    <Search size={14} />
                    <Typography.Text strong>{analysis.productName}</Typography.Text>
                    <Tag color="blue">{analysis.categoryLabel}</Tag>
                    <Tag>%{analysis.confidence} güven</Tag>
                  </Flex>
                  {analysis.keywords.length > 0 && (
                    <Flex gap={4} wrap>
                      {analysis.keywords.map((kw) => (
                        <Tag key={kw} style={{ fontSize: 11 }}>{kw}</Tag>
                      ))}
                    </Flex>
                  )}
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      )}
    </Card>
  );
}
