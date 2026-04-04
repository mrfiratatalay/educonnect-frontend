import type { Dayjs } from "dayjs";
import { CalendarOutlined, FilterOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Flex, Select, Tag, Typography, theme } from "antd";
import type {
  EventRegistrationFilter,
  ExploreEventSort,
  ExploreGroupSort,
  GroupMembershipFilter,
} from "@/pages/Explore/exploreFilters";
import { eventSortOptions, groupSortOptions } from "@/pages/Explore/exploreFilters";
import type { ExploreTab } from "@/pages/Explore/components/ExploreTabs";

const membershipOptions = [
  { label: "Tümü", value: "all" },
  { label: "Üye olduklarım", value: "member" },
  { label: "Keşfet", value: "discover" },
] as const satisfies Array<{ label: string; value: GroupMembershipFilter }>;

const registrationOptions = [
  { label: "Tümü", value: "all" },
  { label: "Kayıtlı olduklarım", value: "registered" },
  { label: "Uygun olanlar", value: "available" },
] as const satisfies Array<{ label: string; value: EventRegistrationFilter }>;

interface ExploreFilterBarProps {
  activeTab: ExploreTab;
  categories: string[];
  selectedCategory: string | null;
  selectedEventDate: Dayjs | null;
  groupMembershipFilter: GroupMembershipFilter;
  groupSort: ExploreGroupSort;
  eventRegistrationFilter: EventRegistrationFilter;
  eventSort: ExploreEventSort;
  onCategoryChange: (category: string | null) => void;
  onEventDateChange: (date: Dayjs | null) => void;
  onGroupMembershipFilterChange: (value: GroupMembershipFilter) => void;
  onGroupSortChange: (value: ExploreGroupSort) => void;
  onEventRegistrationFilterChange: (value: EventRegistrationFilter) => void;
  onEventSortChange: (value: ExploreEventSort) => void;
  onReset: () => void;
}

export default function ExploreFilterBar({
  activeTab,
  categories,
  selectedCategory,
  selectedEventDate,
  groupMembershipFilter,
  groupSort,
  eventRegistrationFilter,
  eventSort,
  onCategoryChange,
  onEventDateChange,
  onGroupMembershipFilterChange,
  onGroupSortChange,
  onEventRegistrationFilterChange,
  onEventSortChange,
  onReset,
}: ExploreFilterBarProps) {
  const { token } = theme.useToken();
  const hasCategories = categories.length > 0;
  const CheckableTag = Tag.CheckableTag;

  return (
    <Card
      size="small"
      style={{ borderColor: token.colorBorderSecondary, background: token.colorFillQuaternary }}
      styles={{ body: { padding: 16 } }}
    >
      <Flex vertical gap={16}>
        <Flex align="center" justify="space-between" gap={12} wrap="wrap">
          <Flex align="center" gap={8}>
            <FilterOutlined />
            <Typography.Text strong>Filtreler</Typography.Text>
          </Flex>

          <Button icon={<ReloadOutlined />} onClick={onReset} type="text">
            Sıfırla
          </Button>
        </Flex>

        {hasCategories && (
          <Flex gap={8} wrap="wrap">
            <CheckableTag
              checked={selectedCategory === null}
              onChange={() => onCategoryChange(null)}
            >
              Tümü
            </CheckableTag>
            {categories.map((category) => (
              <CheckableTag
                key={category}
                checked={selectedCategory === category}
                onChange={(checked) => onCategoryChange(checked ? category : null)}
              >
                {category}
              </CheckableTag>
            ))}
          </Flex>
        )}

        {activeTab === "groups" ? (
          <Flex gap={12} wrap="wrap">
            <Select
              options={membershipOptions}
              style={{ minWidth: 200 }}
              value={groupMembershipFilter}
              onChange={onGroupMembershipFilterChange}
            />
            <Select
              options={groupSortOptions}
              style={{ minWidth: 180 }}
              value={groupSort}
              onChange={onGroupSortChange}
            />
          </Flex>
        ) : activeTab === "events" ? (
          <Flex gap={12} wrap="wrap">
            <Select
              options={registrationOptions}
              style={{ minWidth: 220 }}
              value={eventRegistrationFilter}
              onChange={onEventRegistrationFilterChange}
            />
            <DatePicker
              allowClear
              placeholder="Tarih seç"
              prefix={<CalendarOutlined />}
              style={{ minWidth: 180 }}
              value={selectedEventDate}
              onChange={onEventDateChange}
            />
            <Select
              options={eventSortOptions}
              style={{ minWidth: 180 }}
              value={eventSort}
              onChange={onEventSortChange}
            />
          </Flex>
        ) : null}
      </Flex>
    </Card>
  );
}
