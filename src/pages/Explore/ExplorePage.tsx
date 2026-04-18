import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
import { Alert, Flex, Grid, Typography } from "antd";
import { useDiscountsQuery } from "@/features/discounts/hooks";
import {
  useCancelEventMutation,
  useCreateEventMutation,
  useDeleteEventMutation,
  useEventsQuery,
  useRegisterEventMutation,
  useUpdateEventMutation,
} from "@/features/events/hooks";
import type { AppEvent, CreateEventInput, UpdateEventInput } from "@/features/events/types";
import {
  useCreateGroupMutation,
  useGroupsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "@/features/groups/hooks";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";
import { useAuthStore } from "@/store/authStore";
import ExploreContent from "@/pages/Explore/components/ExploreContent";
import ExploreDialogs from "@/pages/Explore/components/ExploreDialogs";
import ExploreFilterBar from "@/pages/Explore/components/ExploreFilterBar";
import ExplorePageActions from "@/pages/Explore/components/ExplorePageActions";
import ExploreTabs, { type ExploreTab } from "@/pages/Explore/components/ExploreTabs";
import {
  applyDiscountFilters, applyEventFilters, applyGroupFilters, getEventCategories, getGroupCategories, getUpcomingTimelineEvents,
  type EventRegistrationFilter,
  type ExploreEventSort,
  type ExploreGroupSort,
  type GroupMembershipFilter,
} from "@/pages/Explore/exploreFilters";
import { getActiveFilterCount, getExploreActionConfig, getExplorePreviewMessage, getExploreTab } from "@/pages/Explore/explorePageUtils";

interface ExploreWorkspacePageProps {
  forcedTab?: ExploreTab;
  title?: string;
  description?: string;
  showTabs?: boolean;
}

export function ExploreWorkspacePage({
  forcedTab,
  title = "Topluluklar",
  description = "Gruplari, etkinlikleri ve kampüsteki yeni firsatlari bu ekrandan takip et.",
  showTabs = false,
}: ExploreWorkspacePageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = forcedTab ?? getExploreTab(searchParams.get("tab"));
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const [groupCategory, setGroupCategory] = useState<string | null>(null);
  const [eventCategory, setEventCategory] = useState<string | null>(null);
  const [groupMembershipFilter, setGroupMembershipFilter] = useState<GroupMembershipFilter>("all");
  const [eventRegistrationFilter, setEventRegistrationFilter] = useState<EventRegistrationFilter>("all");
  const [groupSort, setGroupSort] = useState<ExploreGroupSort>("members_desc");
  const [eventSort, setEventSort] = useState<ExploreEventSort>("soonest");
  const [selectedEventDate, setSelectedEventDate] = useState<Dayjs | null>(null);
  const groupsQuery = useGroupsQuery(activeTab === "groups");
  const eventsQuery = useEventsQuery({}, activeTab === "events");
  const discountsQuery = useDiscountsQuery(activeTab === "discounts");
  const createGroupMutation = useCreateGroupMutation();
  const createEventMutation = useCreateEventMutation();
  const updateEventMutation = useUpdateEventMutation();
  const deleteEventMutation = useDeleteEventMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();
  const registerEventMutation = useRegisterEventMutation();
  const cancelEventMutation = useCancelEventMutation();
  const screens = Grid.useBreakpoint();
  const currentUser = useAuthStore((state) => state.user);
  const groups = groupsQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const discounts = discountsQuery.data ?? [];
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;
  const groupCategories = useMemo(() => getGroupCategories(groups), [groups]);
  const eventCategories = useMemo(() => getEventCategories(events), [events]);
  const filteredDiscounts = useMemo(
    () => applyDiscountFilters({ discounts, searchQuery }),
    [discounts, searchQuery],
  );
  const filteredGroups = useMemo(
    () =>
      applyGroupFilters({
        groups,
        searchQuery,
        selectedCategory: groupCategory,
        membershipFilter: groupMembershipFilter,
        sort: groupSort,
      }),
    [groupCategory, groupMembershipFilter, groupSort, groups, searchQuery],
  );
  const filteredEvents = useMemo(
    () =>
      applyEventFilters({
        events,
        searchQuery,
        selectedCategory: eventCategory,
        registrationFilter: eventRegistrationFilter,
        selectedDate: selectedEventDate,
        sort: eventSort,
      }),
    [eventCategory, eventRegistrationFilter, eventSort, events, searchQuery, selectedEventDate],
  );
  const timelineEvents = useMemo(() => getUpcomingTimelineEvents(filteredEvents.length > 0 ? filteredEvents : events), [events, filteredEvents]);
  const selectedEvent = useMemo(
    () => events.find((item) => item.id === selectedEventId) ?? null,
    [events, selectedEventId],
  );
  const selectedGroup = useMemo(
    () => groups.find((item) => item.id === selectedGroupId) ?? null,
    [groups, selectedGroupId],
  );
  const actingGroupId = joinGroupMutation.isPending ? joinGroupMutation.variables : leaveGroupMutation.isPending ? leaveGroupMutation.variables : undefined;
  const actingEventId = registerEventMutation.isPending ? registerEventMutation.variables : cancelEventMutation.isPending ? cancelEventMutation.variables : undefined;
  const errorMessage = activeTab === "groups"
    ? groupsQuery.error instanceof Error ? groupsQuery.error.message : undefined
    : activeTab === "events"
      ? eventsQuery.error instanceof Error ? eventsQuery.error.message : undefined
      : discountsQuery.error instanceof Error
        ? discountsQuery.error.message
        : undefined;
  const previewMessage = getExplorePreviewMessage({ activeTab, eventsUsePreview: false, groupsUsePreview: false });
  const activeFilterCount = getActiveFilterCount({
    activeTab,
    eventCategory,
    eventRegistrationFilter,
    eventSort,
    groupCategory,
    groupMembershipFilter,
    groupSort,
    selectedEventDate,
  });

  useEffect(() => {
    setActionErrorMessage(null);
    setIsFilterBarOpen(false);
    setSelectedGroupId(null);
    setSelectedEventId(null);
    setEditingEvent(null);
  }, [activeTab]);
  async function handleCreateGroup(input: CreateGroupInput) {
    setActionErrorMessage(null);
    await createGroupMutation.mutateAsync(input);
    setIsCreateGroupOpen(false);
  }
  async function handleCreateEvent(input: CreateEventInput) {
    setActionErrorMessage(null);
    if (editingEvent) {
      await updateEventMutation.mutateAsync({
        eventId: editingEvent.id,
        ...input,
      } satisfies UpdateEventInput);
    } else {
      await createEventMutation.mutateAsync(input);
    }
    setIsCreateEventOpen(false);
    setEditingEvent(null);
  }

  async function handleToggleMembership(group: AppGroup) {
    try {
      setActionErrorMessage(null);
      if (group.isMember) {
        await leaveGroupMutation.mutateAsync(group.id);
      } else {
        await joinGroupMutation.mutateAsync(group.id);
      }
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error ? error.message : "Grup işlemi tamamlanamadı.",
      );
    }
  }
  async function handleToggleRegistration(event: AppEvent) {
    try {
      setActionErrorMessage(null);
      if (event.isRegistered) {
        await cancelEventMutation.mutateAsync(event.id);
      } else {
        await registerEventMutation.mutateAsync(event.id);
      }
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error ? error.message : "Etkinlik işlemi tamamlanamadı.",
      );
    }
  }

  async function handleDeleteEvent(event: AppEvent) {
    try {
      setActionErrorMessage(null);
      await deleteEventMutation.mutateAsync(event.id);
      setSelectedEventId(null);
    } catch (error) {
      setActionErrorMessage(
        error instanceof Error ? error.message : "Etkinlik silinemedi.",
      );
    }
  }

  function resetActiveTabFilters(tab: ExploreTab) {
    if (tab === "groups") {
      setGroupCategory(null);
      setGroupMembershipFilter("all");
      setGroupSort("members_desc");
      return;
    }
    if (tab === "events") {
      setEventCategory(null);
      setEventRegistrationFilter("all");
      setEventSort("soonest");
      setSelectedEventDate(null);
    }
  }

  function handleTabChange(tab: ExploreTab) {
    if (forcedTab) {
      return;
    }
    setSearchQuery("");
    setActionErrorMessage(null);
    setSelectedGroupId(null);
    setSelectedEventId(null);
    resetActiveTabFilters(tab);
    setSearchParams(tab === "groups" ? {} : { tab }, { replace: true });
  }

  function handleOpenCreateDialog() {
    if (activeTab === "groups") {
      setIsCreateGroupOpen(true);
      return;
    }
    if (activeTab === "events") {
      setEditingEvent(null);
      setIsCreateEventOpen(true);
    }
  }

  function handleEditEvent(event: AppEvent) {
    const canManage = Boolean(
      currentUser &&
        (event.creatorUserId === currentUser.id ||
          currentUser.role === "admin" ||
          currentUser.role === "moderatör"),
    );

    if (!canManage) {
      return;
    }

    setSelectedEventId(null);
    setEditingEvent(event);
    setIsCreateEventOpen(true);
  }

  const { createButtonLabel, searchPlaceholder } = getExploreActionConfig(activeTab);
  const actionBar = (
    <ExplorePageActions
      createButtonLabel={createButtonLabel}
      filterCount={activeTab === "discounts" ? 0 : activeFilterCount}
      isFilterOpen={isFilterBarOpen}
      onCreate={handleOpenCreateDialog}
      onSearchQueryChange={setSearchQuery}
      onToggleFilters={activeTab === "discounts" ? undefined : () => setIsFilterBarOpen((currentValue) => !currentValue)}
      searchPlaceholder={searchPlaceholder}
      searchQuery={searchQuery}
    />
  );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: pagePadding }}>
      <Flex vertical gap={24}>
        <div>
          <Typography.Title level={screens.lg ? 2 : 3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginTop: 4, display: "block" }}>
            {description}
          </Typography.Text>
        </div>

        {showTabs ? (
          <>
            <ExploreTabs
              activeTab={activeTab}
              counts={{ groups: groups.length, events: events.length, discounts: discounts.length }}
              extraContent={screens.md ? actionBar : undefined}
              onChange={handleTabChange}
            />
            {!screens.md && actionBar}
          </>
        ) : (
          actionBar
        )}
        {activeTab !== "discounts" && isFilterBarOpen && (
          <ExploreFilterBar
            activeTab={activeTab}
            categories={activeTab === "groups" ? groupCategories : eventCategories}
            eventRegistrationFilter={eventRegistrationFilter}
            eventSort={eventSort}
            groupMembershipFilter={groupMembershipFilter}
            groupSort={groupSort}
            onCategoryChange={activeTab === "groups" ? setGroupCategory : setEventCategory}
            onEventDateChange={setSelectedEventDate}
            onEventRegistrationFilterChange={setEventRegistrationFilter}
            onEventSortChange={setEventSort}
            onGroupMembershipFilterChange={setGroupMembershipFilter}
            onGroupSortChange={setGroupSort}
            onReset={() => resetActiveTabFilters(activeTab)}
            selectedCategory={activeTab === "groups" ? groupCategory : eventCategory}
            selectedEventDate={selectedEventDate}
          />
        )}
        {previewMessage && <Alert message={previewMessage} showIcon type="info" />}
        {actionErrorMessage && <Alert closable message={actionErrorMessage} showIcon type="error" />}
        <ExploreContent
          activeTab={activeTab}
          actingEventId={actingEventId}
          actingGroupId={actingGroupId}
          discounts={filteredDiscounts}
          errorMessage={errorMessage}
          events={filteredEvents}
          groups={filteredGroups}
          isDiscountsLoading={discountsQuery.isLoading}
          isEventsLoading={eventsQuery.isLoading}
          isGroupsLoading={groupsQuery.isLoading}
          onOpenEvent={setSelectedEventId}
          onOpenGroup={setSelectedGroupId}
          onToggleMembership={handleToggleMembership}
          onToggleRegistration={handleToggleRegistration}
          timelineEvents={timelineEvents}
        />
      </Flex>

      <ExploreDialogs
        actingEventId={actingEventId}
        actingGroupId={actingGroupId}
        actionErrorMessage={actionErrorMessage}
        eventToEdit={editingEvent}
        isCreateEventOpen={isCreateEventOpen}
        isCreateEventSubmitting={createEventMutation.isPending || updateEventMutation.isPending}
        isCreateGroupOpen={isCreateGroupOpen}
        isCreateGroupSubmitting={createGroupMutation.isPending}
        isDeletingEvent={deleteEventMutation.isPending}
        selectedEvent={selectedEvent}
        selectedEventId={selectedEventId}
        selectedGroup={selectedGroup}
        selectedGroupId={selectedGroupId}
        onCloseCreateEvent={() => {
          setIsCreateEventOpen(false);
          setEditingEvent(null);
        }}
        onCloseCreateGroup={() => setIsCreateGroupOpen(false)}
        onCloseEventDetail={() => setSelectedEventId(null)}
        onCloseGroupDetail={() => setSelectedGroupId(null)}
        onDeleteEvent={handleDeleteEvent}
        onEditEvent={handleEditEvent}
        onCreateEvent={handleCreateEvent}
        onCreateGroup={handleCreateGroup}
        onToggleMembership={handleToggleMembership}
        onToggleRegistration={handleToggleRegistration}
      />
    </div>
  );
}
