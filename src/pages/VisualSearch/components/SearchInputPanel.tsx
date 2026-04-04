import {
  Button,
  Card,
  Flex,
  Radio,
  Segmented,
  Tag,
  Tooltip,
  Typography,
  Upload,
  theme,
  Space
} from "antd";
import {
  Camera,
  ImagePlus,
  RefreshCw,
  Search,
  Trash2,
  Upload as UploadIcon,
  Zap,
  Sparkles
} from "lucide-react";
import { getSourceLabel } from "../helpers";
import type { ExampleQuery, QueryImage, QuerySource, SearchMode } from "../types";

interface SearchInputPanelProps {
  isSidebar?: boolean;
  exampleQueries: ExampleQuery[];
  cameraRef: React.RefObject<HTMLInputElement | null>;
  queryImage: QueryImage | null;
  resultLimit: number;
  searchMode: SearchMode;
  searching: boolean;
  onClear: () => void;
  onHandleFile: (file: File, source: QuerySource) => Promise<void>;
  onPickExample: (id: string) => void;
  onRunSearch: () => void;
  onSetResultLimit: (count: number) => void;
  onSetSearchMode: (mode: SearchMode) => void;
}

export function SearchInputPanel({
  isSidebar = false,
  exampleQueries,
  cameraRef,
  queryImage,
  resultLimit,
  searchMode,
  searching,
  onClear,
  onHandleFile,
  onPickExample,
  onRunSearch,
  onSetResultLimit,
  onSetSearchMode,
}: SearchInputPanelProps) {
  const { token } = theme.useToken();

  return (
    <Flex vertical gap={24}>
      {/* ── Main Upload / Preview Area ── */}
      {!queryImage ? (
        <Upload.Dragger
          accept="image/*"
          multiple={false}
          maxCount={1}
          showUploadList={false}
          beforeUpload={(file) => {
            void onHandleFile(file, "upload");
            return false;
          }}
          style={{
            borderRadius: token.borderRadiusLG * 1.5,
            padding: 0,
            border: "none",
            background: "transparent",
            width: "100%",
          }}
        >
          <div
            className="upload-dragger-area"
            style={{
              minHeight: isSidebar ? 280 : 360,
              borderRadius: token.borderRadiusLG * 1.5,
              background: token.colorFillQuaternary,
              border: `2px dashed ${token.colorBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              padding: 32,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: token.colorBgContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${token.colorBorder}`,
                boxShadow: token.boxShadowSecondary,
              }}
            >
              <UploadIcon size={32} color={token.colorPrimary} />
            </div>

            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <Typography.Title level={4} style={{ marginBottom: 8, fontWeight: 700 }}>
                Görselle arayın
              </Typography.Title>
              {!isSidebar && (
                <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                  Sürükle-bırak, dosya seç veya kamera kullan
                </Typography.Text>
              )}
            </div>

            <Flex gap={12} wrap="wrap" justify="center">
              <Button
                type="primary"
                size="middle"
                icon={<ImagePlus size={16} />}
                style={{ borderRadius: 10, pointerEvents: "none", boxShadow: `0 4px 12px ${token.colorPrimary}40` }}
              >
                Dosya Seç
              </Button>
              <Button
                size="middle"
                icon={<Camera size={16} />}
                onClick={(e) => {
                  e.stopPropagation();
                  cameraRef.current?.click();
                }}
                style={{ borderRadius: 10, fontWeight: 500 }}
              >
                Kamera
              </Button>
            </Flex>
          </div>
          <style>{`
            .upload-dragger-area:hover {
              border-color: ${token.colorPrimary} !important;
              background-color: ${token.colorPrimary}0A !important;
              transform: translateY(-2px);
              box-shadow: 0 8px 24px rgba(0,0,0,0.04);
            }
          `}</style>
        </Upload.Dragger>
      ) : (
        <Card
          styles={{ body: { padding: 0 } }}
          style={{
            borderRadius: token.borderRadiusLG * 1.5,
            overflow: "hidden",
            border: `1px solid ${token.colorBorder}`
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "4/3",
              background: token.colorFillQuaternary,
            }}
          >
            <img
              src={queryImage.src}
              alt={queryImage.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
              }}
            />

            {/* ── Overlay controls ── */}
            <Flex
              gap={8}
              style={{ position: "absolute", top: 12, right: 12, zIndex: 2 }}
            >
              <Upload
                accept="image/*"
                multiple={false}
                maxCount={1}
                showUploadList={false}
                beforeUpload={(file) => {
                  void onHandleFile(file, "upload");
                  return false;
                }}
              >
                <Tooltip title="Değiştir">
                  <Button
                    shape="circle"
                    icon={<RefreshCw size={16} />}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      border: "none",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Tooltip>
              </Upload>
              <Tooltip title="Kamera">
                <Button
                  shape="circle"
                  icon={<Camera size={16} />}
                  onClick={() => cameraRef.current?.click()}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Tooltip>
              <Tooltip title="İptal Et">
                <Button
                  shape="circle"
                  danger
                  icon={<Trash2 size={16} />}
                  onClick={onClear}
                  style={{
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </Tooltip>
            </Flex>

            {/* ── Image Info ── */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                padding: "24px 16px 12px",
                background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 100%)",
              }}
            >
              <Flex gap={6} align="center">
                <Tag style={{ borderRadius: 6, margin: 0, border: "none" }}>
                  {getSourceLabel(queryImage.source)}
                </Tag>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>
                  {queryImage.sizeLabel}
                </span>
              </Flex>
            </div>
          </div>
        </Card>
      )}

      {/* ── Quick Examples ── */}
      {!queryImage && (
        <div>
          <Typography.Text type="secondary" style={{ fontSize: 12, marginBottom: 8, display: "block" }}>
            Veya hızlıca deneyin:
          </Typography.Text>
          <Space size={12} wrap>
            {exampleQueries.map((example) => (
              <Flex
                key={example.id}
                align="center"
                gap={8}
                onClick={() => onPickExample(example.id)}
                style={{
                  padding: "6px 16px 6px 6px",
                  background: token.colorBgContainer,
                  border: `1px solid ${token.colorBorder}`,
                  borderRadius: 100,
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: token.boxShadowTertiary
                }}
                className="hover-example-chip"
              >
                <img
                  src={example.imageUrl}
                  alt={example.label}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{example.label}</span>
              </Flex>
            ))}
          </Space>
          <style>{`
            .hover-example-chip:hover {
              border-color: ${token.colorPrimary};
              background: ${token.colorPrimary}0A;
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.06) !important;
            }
          `}</style>
        </div>
      )}

      {/* ── Settings Toolbar ── */}
      <Flex gap={16} vertical={isSidebar} wrap="wrap">
        <div style={{ flex: isSidebar ? "none" : 1 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
            Arama Modu
          </Typography.Text>
          <Radio.Group
            value={searchMode}
            onChange={(e) => onSetSearchMode(e.target.value)}
            style={{ width: "100%", display: "flex" }}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="strict" style={{ flex: 1, textAlign: "center", borderRadius: "8px 0 0 8px" }}>
              <Flex justify="center" align="center" gap={6}><Zap size={14}/>Kesin</Flex>
            </Radio.Button>
            <Radio.Button value="discovery" style={{ flex: 1, textAlign: "center", borderRadius: "0 8px 8px 0" }}>
              <Flex justify="center" align="center" gap={6}><Sparkles size={14}/>Keşif</Flex>
            </Radio.Button>
          </Radio.Group>
        </div>

        <div style={{ flex: isSidebar ? "none" : 1 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 6 }}>
            Sonuç Sayısı
          </Typography.Text>
          <Segmented
            value={String(resultLimit)}
            onChange={(value) => onSetResultLimit(Number(value))}
            options={["4", "6", "8", "12"]}
            block
            style={{ padding: 4 }}
          />
        </div>
      </Flex>

      {/* ── CTA Submit ── */}
      <Button
        type="primary"
        size="large"
        icon={<Search size={18} />}
        loading={searching}
        disabled={!queryImage}
        onClick={onRunSearch}
        block
        className="premium-cta-btn"
        style={{
          marginTop: isSidebar ? 0 : 8,
          height: 56,
          borderRadius: 14,
          fontSize: 16,
          fontWeight: 700,
          boxShadow: !queryImage ? undefined : `0 8px 24px ${token.colorPrimary}50`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {searching ? "Analiz Ediliyor..." : "Benzer İlanları Bul"}
      </Button>
      <style>{`
        .premium-cta-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px ${token.colorPrimary}70 !important;
        }
      `}</style>

      {/* ── Hidden Camera Input ── */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onHandleFile(file, "camera");
          event.currentTarget.value = "";
        }}
      />
    </Flex>
  );
}
