import { useRef } from "react";
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Camera, ImagePlus, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { getSourceLabel } from "../helpers";
import type { ExampleQuery, QueryImage, QuerySource, SearchMode } from "../types";

interface SearchInputPanelProps {
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
  const openRef = useRef<() => void>(null);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    if (file) await onHandleFile(file, "upload");
  };

  return (
    <Paper
      withBorder
      radius={32}
      p={{ base: 18, md: 24 }}
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, #fbfaf7 100%)",
        borderColor: "rgba(23, 24, 28, 0.08)",
        boxShadow: "0 30px 90px rgba(20, 28, 45, 0.08)",
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={1} size="h2">
            Gorsel Arama
          </Title>
          {queryImage ? (
            <Badge variant="light" radius="xl" color="ink">
              Hazir
            </Badge>
          ) : null}
        </Group>

        <Dropzone
          openRef={openRef}
          onDrop={(files) => void handleDrop(files)}
          accept={IMAGE_MIME_TYPE}
          multiple={false}
          maxFiles={1}
          activateOnClick={false}
          style={{
            background: queryImage
              ? "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245, 242, 236, 0.98) 100%)"
              : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(245, 240, 232, 0.9) 100%)",
            border: "1px dashed rgba(36, 38, 47, 0.15)",
            borderRadius: 30,
            padding: 12,
          }}
        >
          {!queryImage ? (
            <Stack
              align="center"
              justify="center"
              gap="md"
              mih={430}
              px="md"
              style={{ borderRadius: 24 }}
            >
              <ThemeIcon size={84} radius={28} variant="light" color="ink">
                <Upload size={38} />
              </ThemeIcon>

              <Stack gap={4} align="center">
                <Title order={2} size="1.7rem">
                  Gorsel sec
                </Title>
                <Text size="sm" c="dimmed">
                  Surukle birak ya da dogrudan ac
                </Text>
              </Stack>

              <Group gap="sm">
                <Button
                  radius="xl"
                  size="md"
                  leftSection={<ImagePlus size={16} />}
                  onClick={() => openRef.current?.()}
                >
                  Dosya
                </Button>
                <Button
                  radius="xl"
                  size="md"
                  variant="default"
                  leftSection={<Camera size={16} />}
                  onClick={() => cameraRef.current?.click()}
                >
                  Kamera
                </Button>
              </Group>
            </Stack>
          ) : (
            <AspectRatio ratio={16 / 10}>
              <Paper radius={24} style={{ overflow: "hidden", position: "relative" }}>
                <img
                  src={queryImage.src}
                  alt={queryImage.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />

                <Group
                  gap="xs"
                  style={{ position: "absolute", top: 16, right: 16, zIndex: 1 }}
                >
                  <ActionIcon
                    size={42}
                    radius="xl"
                    variant="default"
                    onClick={() => openRef.current?.()}
                    style={{ background: "rgba(255,255,255,0.92)" }}
                    aria-label="Dosya sec"
                  >
                    <RefreshCw size={18} />
                  </ActionIcon>
                  <ActionIcon
                    size={42}
                    radius="xl"
                    variant="default"
                    onClick={() => cameraRef.current?.click()}
                    style={{ background: "rgba(255,255,255,0.92)" }}
                    aria-label="Kamera ac"
                  >
                    <Camera size={18} />
                  </ActionIcon>
                  <ActionIcon
                    size={42}
                    radius="xl"
                    variant="default"
                    color="red"
                    onClick={onClear}
                    style={{ background: "rgba(255,255,255,0.92)" }}
                    aria-label="Temizle"
                  >
                    <Trash2 size={18} />
                  </ActionIcon>
                </Group>

                <Stack
                  gap={8}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 18,
                    color: "white",
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(9,12,20,0.78) 100%)",
                  }}
                >
                  <Text fw={700} size="lg" truncate>
                    {queryImage.name}
                  </Text>
                  <Group gap="xs">
                    <Badge radius="xl" variant="filled" color="dark">
                      {getSourceLabel(queryImage.source)}
                    </Badge>
                    <Badge radius="xl" variant="white">
                      {queryImage.sizeLabel}
                    </Badge>
                  </Group>
                </Stack>
              </Paper>
            </AspectRatio>
          )}
        </Dropzone>

        <Group justify="space-between" align="flex-end" gap="md" wrap="wrap">
          <Group gap="sm" wrap="wrap">
            {exampleQueries.map((example) => {
              const active = queryImage?.presetId === example.id;

              return (
                <UnstyledButton key={example.id} onClick={() => onPickExample(example.id)}>
                  <Stack gap={8} align="center">
                    <Paper
                      withBorder
                      radius={22}
                      p={4}
                      style={{
                        borderColor: active ? "var(--mantine-color-ink-5)" : "rgba(23, 24, 28, 0.1)",
                        background: active ? "rgba(95, 116, 246, 0.08)" : "rgba(255,255,255,0.86)",
                      }}
                    >
                      <img
                        src={example.imageUrl}
                        alt={example.label}
                        style={{
                          width: 74,
                          height: 74,
                          objectFit: "cover",
                          borderRadius: 18,
                          display: "block",
                        }}
                      />
                    </Paper>
                    <Text size="xs" c={active ? "ink.7" : "dimmed"} fw={active ? 700 : 500}>
                      {example.label}
                    </Text>
                  </Stack>
                </UnstyledButton>
              );
            })}
          </Group>

          <Stack gap="sm" align="flex-end">
            <Group gap="sm" wrap="wrap" justify="flex-end">
              <SegmentedControl
                radius="xl"
                value={searchMode}
                onChange={(value) => onSetSearchMode(value as SearchMode)}
                data={[
                  { label: "Kesin", value: "strict" },
                  { label: "Kesif", value: "discovery" },
                ]}
              />
              <SegmentedControl
                radius="xl"
                value={String(resultLimit)}
                onChange={(value) => onSetResultLimit(Number(value))}
                data={[
                  { label: "4", value: "4" },
                  { label: "6", value: "6" },
                  { label: "8", value: "8" },
                ]}
              />
            </Group>

            <Button
              radius="xl"
              size="lg"
              px={28}
              leftSection={<Search size={17} />}
              loading={searching}
              disabled={!queryImage}
              onClick={onRunSearch}
            >
              Ara
            </Button>
          </Stack>
        </Group>
      </Stack>

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onHandleFile(file, "camera");
          event.currentTarget.value = "";
        }}
      />
    </Paper>
  );
}
