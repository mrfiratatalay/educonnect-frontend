import { useDeferredValue, useState } from "react";
import {
  Alert,
  Button,
  Empty,
  Flex,
  Grid,
  Input,
  Typography,
  theme,
} from "antd";
import {
  ArrowLeftOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  useCreateGroupMutation,
  useDiscoverGroupsQuery,
  useJoinedGroupsQuery,
} from "@/features/groups/hooks";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";
import CreateGroupDialog from "@/pages/Explore/components/CreateGroupDialog";
import CommunitiesRail from "@/pages/Communities/components/CommunitiesRail";
import CommunityListItem, {
  CommunityListSkeleton,
} from "@/pages/Communities/components/CommunityListItem";
import { dedupeGroups, filterGroups } from "@/pages/Communities/communitySurface";

const ALL_CATEGORIES = "Tum";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const normalizedDiscoverQuery = deferredSearchQuery.trim() || undefined;
  const joinedQuery = useJoinedGroupsQuery(24);
  const discoverQuery = useDiscoverGroupsQuery({ query: normalizedDiscoverQuery, limit: 24 });
  const createGroupMutation = useCreateGroupMutation();
  const joinedGroups = filterGroups(joinedQuery.data ?? [], deferredSearchQuery);
  const discoverGroups = filterGroups(discoverQuery.data ?? [], deferredSearchQuery);
  const filteredDiscoverGroups =
    selectedCategory === ALL_CATEGORIES
      ? discoverGroups
      : discoverGroups.filter((group) => group.category === selectedCategory);
  const joinedPreviewGroups = joinedGroups.slice(0, 3);
  const suggestedGroups = discoverGroups.slice(0, 3);
  const allGroups = dedupeGroups([...(joinedQuery.data ?? []), ...(discoverQuery.data ?? [])]);
  const categories = [
    ALL_CATEGORIES,
    ...Array.from(new Set(allGroups.map((group) => group.category))).sort((left, right) =>
      left.localeCompare(right, "tr"),
    ),
  ];

  async function handleCreateGroup(input: CreateGroupInput) {
    const createdGroup = await createGroupMutation.mutateAsync(input);
    setIsCreateGroupOpen(false);

    if (createdGroup.slug) {
      navigate(`/communities/${createdGroup.slug}`);
    }
  }

  function handleOpenGroup(group: AppGroup) {
    if (!group.slug) {
      return;
    }

    navigate(`/communities/${group.slug}`);
  }

  return (
    <>
      <div
        className="communities-surface"
        style={{
          width: "100%",
          maxWidth: 990,
          margin: "0 auto",
        }}
      >
        <Flex align="flex-start">
          <div
            style={{
              flex: 1,
              maxWidth: screens.xl ? 620 : "100%",
              minWidth: 0,
              borderInline: screens.sm ? `1px solid ${token.colorBorderSecondary}` : "none",
              background: token.colorBgContainer,
              minHeight: "100vh",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 20,
                background: `${token.colorBgContainer}F2`,
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              <Flex align="center" gap={12} style={{ padding: "10px 12px" }}>
                <Button
                  type="text"
                  shape="circle"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(-1)}
                />
                <Input
                  className="communities-search"
                  allowClear
                  placeholder="Topluluklar ve Gonderileri Ara"
                  prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  variant="filled"
                  styles={{
                    input: {
                      height: 40,
                    },
                  }}
                />
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => setIsCreateGroupOpen(true)}
                  shape="round"
                  style={{
                    height: 40,
                    paddingInline: screens.md ? 16 : 0,
                    minWidth: 40,
                    borderColor: token.colorBorderSecondary,
                    background: token.colorBgContainer,
                    color: token.colorText,
                    boxShadow: "none",
                    flexShrink: 0,
                  }}
                >
                  {screens.md ? "Topluluk olustur" : null}
                </Button>
              </Flex>
            </div>

            <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
              <Typography.Title level={3} style={{ margin: 0, lineHeight: 1.15, fontSize: 32 }}>
                Topluluklari Kesfet
              </Typography.Title>

              <Flex gap={8} wrap="wrap" style={{ marginTop: 14 }}>
                {categories.map((category) => {
                  const isSelected = category === selectedCategory;

                  return (
                    <Button
                      key={category}
                      shape="round"
                      type="default"
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        borderColor: isSelected ? token.colorText : token.colorBorderSecondary,
                        background: isSelected ? token.colorFillSecondary : token.colorBgContainer,
                        color: token.colorText,
                        fontWeight: isSelected ? 700 : 600,
                        boxShadow: "none",
                        height: 36,
                        paddingInline: 14,
                      }}
                    >
                      {category}
                    </Button>
                  );
                })}
              </Flex>
            </div>

            {!normalizedDiscoverQuery && joinedPreviewGroups.length > 0 ? (
              <JoinedGroupsSection
                groups={joinedPreviewGroups}
                onOpen={handleOpenGroup}
              />
            ) : null}

            {discoverQuery.isLoading ? (
              <>
                <CommunityListSkeleton />
                <CommunityListSkeleton />
                <CommunityListSkeleton />
              </>
            ) : discoverQuery.error instanceof Error ? (
              <div style={{ padding: 24 }}>
                <Alert message={discoverQuery.error.message} showIcon type="error" />
              </div>
            ) : filteredDiscoverGroups.length > 0 ? (
              filteredDiscoverGroups.map((group) => (
                <CommunityListItem
                  key={group.id}
                  group={group}
                  onOpen={handleOpenGroup}
                />
              ))
            ) : (
              <CommunityEmptyState
                onCreateGroup={() => setIsCreateGroupOpen(true)}
                searchQuery={searchQuery}
              />
            )}
          </div>

          {screens.xl ? (
            <div style={{ width: 350, flexShrink: 0, paddingLeft: 20 }}>
              <div style={{ position: "sticky", top: 12 }}>
                <CommunitiesRail
                  suggestedGroups={suggestedGroups}
                />
              </div>
            </div>
          ) : null}
        </Flex>
      </div>

      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        isSubmitting={createGroupMutation.isPending}
        onClose={() => setIsCreateGroupOpen(false)}
        onSubmit={handleCreateGroup}
      />
    </>
  );
}

function JoinedGroupsSection({
  groups,
  onOpen,
}: {
  groups: AppGroup[];
  onOpen: (group: AppGroup) => void;
}) {
  const { token } = theme.useToken();

  return (
    <div style={{ padding: "16px 16px 10px", borderBottom: `1px solid ${token.colorBorderSecondary}` }}>
      <Flex align="center" justify="space-between" gap={12} style={{ marginBottom: 8 }}>
        <Typography.Title level={3} style={{ margin: 0, lineHeight: 1.15 }}>
          Katildigin topluluklar
        </Typography.Title>
        <Button type="text" shape="circle" icon={<EllipsisOutlined />} />
      </Flex>

      <Flex vertical>
        {groups.map((group) => (
          <CommunityListItem key={group.id} compact group={group} onOpen={onOpen} />
        ))}
      </Flex>
    </div>
  );
}

function CommunityEmptyState({
  onCreateGroup,
  searchQuery,
}: {
  onCreateGroup: () => void;
  searchQuery: string;
}) {
  const hasSearchQuery = searchQuery.trim().length > 0;
  const title = hasSearchQuery
    ? "Aramana uygun topluluk bulunamadi."
    : "Yeni topluluklar burada listelenecek.";
  const description = hasSearchQuery
    ? "Arama ifadesini sadelestir veya diger sekmeye goz at."
    : "Kendi toplulugunu kurarak ilk vitrini burada acabilirsin.";

  return (
    <Flex vertical align="center" gap={16} style={{ padding: "48px 24px 56px" }}>
      <Empty description={title} />
      <Typography.Paragraph
        type="secondary"
        style={{ textAlign: "center", maxWidth: 360, margin: 0 }}
      >
        {description}
      </Typography.Paragraph>
      <Flex align="center" gap={12} wrap="wrap" justify="center">
        <Button icon={<PlusOutlined />} onClick={onCreateGroup} shape="round" type="primary">
          Topluluk olustur
        </Button>
      </Flex>
    </Flex>
  );
}
