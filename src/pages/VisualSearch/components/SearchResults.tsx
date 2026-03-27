import {
  AspectRatio,
  Badge,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { formatPrice } from "../helpers";
import type { SearchSession } from "../types";

interface SearchResultsProps {
  activeResultId: string | null;
  error: string | null;
  searching: boolean;
  session: SearchSession | null;
  onSelect: (id: string) => void;
}

export function SearchResults({
  activeResultId,
  error,
  searching,
  session,
  onSelect,
}: SearchResultsProps) {
  const surfaceStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.94) 0%, #ffffff 100%)",
    borderColor: "rgba(23, 24, 28, 0.08)",
    boxShadow: "0 24px 70px rgba(20, 28, 45, 0.06)",
  } as const;

  if (searching) {
    return (
      <Paper withBorder radius={32} p={{ base: 18, md: 24 }} style={surfaceStyle}>
        <Stack gap="lg">
          <Group gap="xs">
            <Loader size="sm" color="ink" />
            <Text size="sm" c="dimmed">
              Araniyor
            </Text>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {[0, 1, 2].map((item) => (
              <Paper
                key={item}
                withBorder
                radius={28}
                p="md"
                style={{ borderColor: "rgba(23, 24, 28, 0.08)" }}
              >
                <Skeleton radius={22} height={250} />
                <Skeleton mt="md" height={22} radius="xl" width="65%" />
                <Skeleton mt="sm" height={16} radius="xl" width="35%" />
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper withBorder radius={32} p={{ base: 18, md: 24 }} style={surfaceStyle}>
        <Text c="red.6">{error}</Text>
      </Paper>
    );
  }

  if (!session) {
    return (
      <Paper withBorder radius={32} p={{ base: 24, md: 32 }} style={surfaceStyle}>
        <Text c="dimmed">Gorsel sec ve ara.</Text>
      </Paper>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" gap="md" wrap="wrap">
        <Group gap="xs" wrap="wrap">
          <Badge radius="xl" variant="light" color="ink">
            {session.analysis.categoryLabel}
          </Badge>
          <Badge radius="xl" variant="outline">
            {session.analysis.conditionLabel}
          </Badge>
          <Badge radius="xl" variant="light" color="gray">
            {session.analysis.estimatedPriceRange}
          </Badge>
          <Badge radius="xl" variant="light" color="dark">
            %{session.analysis.confidence}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed">
          {session.results.length} sonuc · {(session.elapsedMs / 1000).toFixed(1)} sn ·{" "}
          {session.filteredCount}/{session.candidateCount}
        </Text>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {session.results.map((result) => {
          const active = result.id === activeResultId;

          return (
            <UnstyledButton
              key={result.id}
              onClick={() => onSelect(result.id)}
              className="block transition-transform duration-150 hover:-translate-y-1"
            >
              <Paper
                withBorder
                radius={28}
                p={0}
                style={{
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.94)",
                  borderColor: active ? "var(--mantine-color-ink-5)" : "rgba(23, 24, 28, 0.08)",
                  boxShadow: active
                    ? "0 24px 60px rgba(79, 99, 221, 0.16)"
                    : "0 16px 40px rgba(20, 28, 45, 0.07)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </AspectRatio>

                  <Group
                    justify="space-between"
                    style={{ position: "absolute", inset: "16px 16px auto 16px" }}
                  >
                    <Badge radius="xl" variant="filled" color="dark">
                      #{result.rank}
                    </Badge>
                    <Badge radius="xl" variant="white">
                      %{result.score}
                    </Badge>
                  </Group>
                </div>

                <Stack gap="md" p="lg">
                  <Group justify="space-between" align="flex-start" gap="md">
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Title order={3} size="1.05rem" lineClamp={2}>
                        {result.title}
                      </Title>
                      <Text size="sm" c="dimmed">
                        {result.city} · {result.conditionLabel}
                      </Text>
                    </Stack>
                    <Text fw={800} size="lg" c="ink.7">
                      {formatPrice(result.price)}
                    </Text>
                  </Group>

                  <Group gap="xs" wrap="wrap">
                    {result.matchedSignals.slice(0, 3).map((signal) => (
                      <Badge key={signal} radius="xl" variant="light" color="gray">
                        {signal}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              </Paper>
            </UnstyledButton>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
