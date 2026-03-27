import { Box, Container, Stack } from "@mantine/core";
import { SearchInputPanel } from "./components/SearchInputPanel";
import { SearchResultDialog } from "./components/SearchResultDialog";
import { SearchResults } from "./components/SearchResults";
import { useVisualSearch } from "./useVisualSearch";

export default function VisualSearchPage() {
  const search = useVisualSearch();

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: [
          "radial-gradient(circle at top left, rgba(95, 116, 246, 0.14), transparent 26%)",
          "radial-gradient(circle at top right, rgba(243, 208, 126, 0.18), transparent 22%)",
          "linear-gradient(180deg, #f3eee6 0%, #f8f5ef 42%, #fcfbf8 100%)",
        ].join(", "),
      }}
    >
      <Container size={1240} py={{ base: 20, md: 36 }}>
        <Stack gap="xl">
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

          <SearchResults
            activeResultId={search.activeResult?.id ?? null}
            error={search.error}
            searching={search.searching}
            session={search.session}
            onSelect={search.setActiveResultId}
          />
        </Stack>

        <SearchResultDialog
          open={Boolean(search.activeResult)}
          result={search.activeResult}
          session={search.session}
          onOpenChange={(open) => {
            if (!open) search.setActiveResultId(null);
          }}
        />
      </Container>
    </Box>
  );
}
