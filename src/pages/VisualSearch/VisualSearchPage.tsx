import { Flex, Grid, Row, Col, Typography, Space, theme } from "antd";
import { SearchInputPanel } from "./components/SearchInputPanel";
import { SearchResultDialog } from "./components/SearchResultDialog";
import { SearchResults } from "./components/SearchResults";
import { useVisualSearch } from "./useVisualSearch";
import { ScanSearch } from "lucide-react";

export default function VisualSearchPage() {
  const search = useVisualSearch();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;

  const hasImage = Boolean(search.queryImage);
  const showResults = Boolean(search.searching || search.session || search.error);
  
  // Center layout when no results/searching is active.
  const isCentered = !showResults;

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: pagePadding }}>
      {/* ── Page Header ── */}
      <Flex
        vertical={isCentered}
        align={isCentered ? "center" : "center"}
        gap={isCentered ? 20 : 16}
        style={{
          marginBottom: isCentered ? 56 : 32,
          marginTop: isCentered ? 48 : 0,
          justifyContent: isCentered ? "center" : "flex-start",
          textAlign: isCentered ? "center" : "left",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{
            width: isCentered ? 72 : 48,
            height: isCentered ? 72 : 48,
            borderRadius: isCentered ? 24 : 14,
            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorInfo})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 12px 32px ${token.colorPrimary}40`,
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ScanSearch strokeWidth={2.5} size={isCentered ? 36 : 24} color="#ffffff" />
        </div>
        <div>
          <Typography.Title
            level={isCentered ? 1 : 3}
            style={{
              margin: 0,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            Görselle Keşfet
          </Typography.Title>
          <Typography.Paragraph
            type="secondary"
            style={{
              margin: "8px 0 0",
              fontSize: isCentered ? 16 : 14,
              opacity: 0.85,
              maxWidth: 400,
              marginInline: "auto",
            }}
          >
            Aradığınız ürünü bulmak için sadece bir fotoğraf yükleyin, saniyeler içinde sizin için bulalım.
          </Typography.Paragraph>
        </div>
      </Flex>

      {/* ── Dynamic Layout ── */}
      {isCentered ? (
        <div style={{ maxWidth: 680, margin: "0 auto", transition: "all 0.4s ease" }}>
          <SearchInputPanel
            cameraRef={search.cameraRef}
            exampleQueries={search.exampleQueries}
            queryImage={search.queryImage}
            resultLimit={search.resultLimit}
            searchMode={search.searchMode}
            searching={search.searching}
            onClear={search.clear}
            onHandleFile={search.handleIncomingFile}
            onPickExample={search.selectExample}
            onRunSearch={search.runSearch}
            onSetResultLimit={search.setResultLimit}
            onSetSearchMode={search.setSearchMode}
          />
        </div>
      ) : (
        <Row gutter={[32, 32]} style={{ transition: "all 0.4s ease" }}>
          <Col xs={24} lg={7} xl={6}>
            <SearchInputPanel
              isSidebar
              cameraRef={search.cameraRef}
              exampleQueries={search.exampleQueries}
              queryImage={search.queryImage}
              resultLimit={search.resultLimit}
              searchMode={search.searchMode}
              searching={search.searching}
              onClear={search.clear}
              onHandleFile={search.handleIncomingFile}
              onPickExample={search.selectExample}
              onRunSearch={search.runSearch}
              onSetResultLimit={search.setResultLimit}
              onSetSearchMode={search.setSearchMode}
            />
          </Col>
          <Col xs={24} lg={17} xl={18}>
            <SearchResults
              activeResultId={search.activeResult?.id ?? null}
              error={search.error}
              searching={search.searching}
              session={search.session}
              onSelect={search.setActiveResultId}
            />
          </Col>
        </Row>
      )}

      {/* ── Dialog ── */}
      <SearchResultDialog
        open={Boolean(search.activeResult)}
        result={search.activeResult}
        session={search.session}
        onOpenChange={(open) => {
          if (!open) search.setActiveResultId(null);
        }}
      />
    </div>
  );
}
