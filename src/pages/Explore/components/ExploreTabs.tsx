import { CalendarOutlined, TagsOutlined, TeamOutlined } from "@ant-design/icons";
import { Flex, Tabs, Typography } from "antd";

export type ExploreTab = "groups" | "events" | "discounts";

interface ExploreTabsProps {
  activeTab: ExploreTab;
  counts?: Partial<Record<ExploreTab, number>>;
  extraContent?: React.ReactNode;
  onChange: (tab: ExploreTab) => void;
}

const tabs: Array<{ key: ExploreTab; label: string; icon: React.ReactNode }> = [
  { key: "groups", label: "Gruplar", icon: <TeamOutlined /> },
  { key: "events", label: "Etkinlikler", icon: <CalendarOutlined /> },
  { key: "discounts", label: "İndirimler", icon: <TagsOutlined /> },
];

export default function ExploreTabs({
  activeTab,
  counts,
  extraContent,
  onChange,
}: ExploreTabsProps) {
  return (
    <Tabs
      activeKey={activeTab}
      items={tabs.map((tab) => ({
        key: tab.key,
        label: (
          <Flex align="center" gap={8}>
            {tab.icon}
            <span>{tab.label}</span>
            {typeof counts?.[tab.key] === "number" && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {counts[tab.key]}
              </Typography.Text>
            )}
          </Flex>
        ),
      }))}
      onChange={(value) => onChange(value as ExploreTab)}
      size="large"
      tabBarExtraContent={extraContent}
    />
  );
}
