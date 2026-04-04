import { FilterOutlined, PlusOutlined } from "@ant-design/icons";
import { Badge, Button, Flex, Grid, Input } from "antd";

interface ExplorePageActionsProps {
  createButtonLabel: string | null;
  filterCount?: number;
  isFilterOpen?: boolean;
  searchPlaceholder: string;
  searchQuery: string;
  onCreate: () => void;
  onSearchQueryChange: (value: string) => void;
  onToggleFilters?: () => void;
}

export default function ExplorePageActions({
  createButtonLabel,
  filterCount = 0,
  isFilterOpen = false,
  searchPlaceholder,
  searchQuery,
  onCreate,
  onSearchQueryChange,
  onToggleFilters,
}: ExplorePageActionsProps) {
  const screens = Grid.useBreakpoint();

  return (
    <Flex gap={12} wrap="wrap">
      <Input.Search
        allowClear
        onChange={(event) => onSearchQueryChange(event.target.value)}
        placeholder={searchPlaceholder}
        style={{ width: screens.md ? 280 : "100%" }}
        value={searchQuery}
      />

      {onToggleFilters && (
        <Badge count={filterCount} offset={[-6, 4]} size="small">
          <Button
            icon={<FilterOutlined />}
            onClick={onToggleFilters}
            type={isFilterOpen ? "primary" : "default"}
          >
            Filtreler
          </Button>
        </Badge>
      )}

      {createButtonLabel && (
        <Button icon={<PlusOutlined />} onClick={onCreate} type="primary">
          {createButtonLabel}
        </Button>
      )}
    </Flex>
  );
}
