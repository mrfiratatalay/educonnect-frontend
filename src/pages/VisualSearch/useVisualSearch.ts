import { useRef, useState } from "react";
import { runVisualSearch } from "./api";
import {
  exampleQueries,
  fetchRemoteFile,
  formatBytes,
  readFileAsDataUrl,
  toSearchSession,
} from "./helpers";
import type { QueryImage, QuerySource, SearchMode, SearchSession } from "./types";

export function useVisualSearch() {
  const cameraRef = useRef<HTMLInputElement>(null);
  const [queryImage, setQueryImage] = useState<QueryImage | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>("strict");
  const [resultLimit, setResultLimit] = useState(6);
  const [searching, setSearching] = useState(false);
  const [session, setSession] = useState<SearchSession | null>(null);
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeResult =
    session?.results.find((item) => item.id === activeResultId) ??
    session?.results[0] ??
    null;

  const setQueryState = (nextQuery: QueryImage) => {
    setQueryImage(nextQuery);
    setSession(null);
    setActiveResultId(null);
    setError(null);
  };

  const handleIncomingFile = async (file: File, source: QuerySource) => {
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyasi sec.");
      return;
    }

    const src = await readFileAsDataUrl(file);
    setQueryState({
      src,
      name: file.name,
      sizeLabel: formatBytes(file.size),
      source,
      file,
    });
  };

  const selectExample = (exampleId: string) => {
    const example = exampleQueries.find((item) => item.id === exampleId);
    if (!example) return;

    setQueryState({
      src: example.imageUrl,
      name: example.label,
      sizeLabel: "Örnek",
      source: "example",
      presetId: example.id,
    });
  };

  const resolveQueryFile = async () => {
    if (!queryImage) return null;
    if (queryImage.file) return queryImage.file;
    return fetchRemoteFile(queryImage.src, queryImage.name);
  };

  const runSearch = async () => {
    if (!queryImage) return;
    setSearching(true);
    setError(null);

    try {
      const file = await resolveQueryFile();
      if (!file) return;

      const response = await runVisualSearch({
        file,
        maxResults: resultLimit,
        mode: searchMode,
      });

      const nextSession = toSearchSession(response);
      setSession(nextSession);
      setActiveResultId(nextSession.results[0]?.id ?? null);
    } catch {
      setSession(null);
      setActiveResultId(null);
      setError("Arama başarısız.");
    } finally {
      setSearching(false);
    }
  };

  const clear = () => {
    setQueryImage(null);
    setSession(null);
    setActiveResultId(null);
    setError(null);
    if (cameraRef.current) cameraRef.current.value = "";
  };

  return {
    activeResult,
    cameraRef,
    clear,
    error,
    exampleQueries,
    handleIncomingFile,
    queryImage,
    resultLimit,
    runSearch,
    searchMode,
    searching,
    selectExample,
    session,
    setActiveResultId,
    setResultLimit,
    setSearchMode,
  };
}
