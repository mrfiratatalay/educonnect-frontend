import {
  Badge,
  Divider,
  Group,
  Modal,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { formatPrice } from "../helpers";
import type { SearchResult, SearchSession } from "../types";

interface SearchResultDialogProps {
  open: boolean;
  result: SearchResult | null;
  session: SearchSession | null;
  onOpenChange: (open: boolean) => void;
}

export function SearchResultDialog({
  open,
  result,
  session,
  onOpenChange,
}: SearchResultDialogProps) {
  return (
    <Modal
      opened={open}
      onClose={() => onOpenChange(false)}
      centered
      size={980}
      padding={0}
      radius={32}
      overlayProps={{ blur: 8, backgroundOpacity: 0.45 }}
      styles={{
        content: {
          overflow: "hidden",
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, #fbfaf7 100%)",
        },
        header: {
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          background: "transparent",
        },
        body: { padding: 0 },
      }}
    >
      {result ? (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={0}>
          <div style={{ background: "#f2eee6", padding: 12 }}>
            <img
              src={result.imageUrl}
              alt={result.title}
              style={{
                width: "100%",
                minHeight: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 26,
                display: "block",
              }}
            />
          </div>

          <Stack gap="xl" p={{ base: 24, md: 30 }}>
            <Stack gap="sm">
              <Group gap="xs" wrap="wrap">
                <Badge radius="xl" variant="light" color="ink">
                  {result.categoryLabel}
                </Badge>
                <Badge radius="xl" variant="outline">
                  {result.conditionLabel}
                </Badge>
                <Badge radius="xl" variant="light" color="dark">
                  %{result.score}
                </Badge>
              </Group>
              <Title order={2} size="1.9rem" maw={420}>
                {result.title}
              </Title>
              <Text c="dimmed" lh={1.65}>
                {result.description || session?.analysis.productName || "Detay yok."}
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="md">
              <Paper
                withBorder
                radius={24}
                p="md"
                style={{ borderColor: "rgba(23, 24, 28, 0.08)" }}
              >
                <Text size="sm" c="dimmed">
                  Fiyat
                </Text>
                <Text fw={800} size="1.45rem" c="ink.7" mt={6}>
                  {formatPrice(result.price)}
                </Text>
              </Paper>
              <Paper
                withBorder
                radius={24}
                p="md"
                style={{ borderColor: "rgba(23, 24, 28, 0.08)" }}
              >
                <Text size="sm" c="dimmed">
                  Sehir
                </Text>
                <Text fw={700} size="1.05rem" mt={6}>
                  {result.city || "-"}
                </Text>
              </Paper>
            </SimpleGrid>

            <Group gap="xs" wrap="wrap">
              {result.matchedSignals.map((signal) => (
                <Badge key={signal} radius="xl" variant="light" color="gray">
                  {signal}
                </Badge>
              ))}
            </Group>

            <Divider />

            <Stack gap="sm">
              {result.breakdown.map((item) => (
                <Stack key={item.label} gap={6}>
                  <Group justify="space-between" gap="sm">
                    <Text size="sm" fw={600}>
                      {item.label}
                    </Text>
                    <Text size="sm" c="dimmed">
                      %{item.value}
                    </Text>
                  </Group>
                  <Progress value={item.value} radius="xl" size="sm" color="ink" />
                </Stack>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      ) : null}
    </Modal>
  );
}
