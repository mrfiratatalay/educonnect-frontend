import { useEffect, useMemo, useState } from "react";
import type { Dayjs } from "dayjs";
import { useSearchParams } from "react-router-dom";
import { Alert, Flex, Grid, Typography } from "antd";
import {
  useCancelEventMutation,
  useCreateEventMutation,
  useEventsQuery,
  useRegisterEventMutation,
} from "@/features/events/hooks";
import type { AppEvent, CreateEventInput } from "@/features/events/types";
import {
  useCreateGroupMutation,
  useGroupsQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
} from "@/features/groups/hooks";
import type { AppGroup } from "@/features/groups/types";
import ExploreContent from "@/pages/Explore/components/ExploreContent";
import ExploreDialogs from "@/pages/Explore/components/ExploreDialogs";
import ExploreFilterBar from "@/pages/Explore/components/ExploreFilterBar";
import ExplorePageActions from "@/pages/Explore/components/ExplorePageActions";
import ExploreTabs, { type ExploreTab } from "@/pages/Explore/components/ExploreTabs";
import {
  applyEventFilters, applyGroupFilters, getEventCategories, getGroupCategories, getUpcomingTimelineEvents,
  type EventRegistrationFilter,
  type ExploreEventSort,
  type ExploreGroupSort,
  type GroupMembershipFilter,
} from "@/pages/Explore/exploreFilters";
import { filterPreviewDiscounts } from "@/pages/Explore/exploreMockData";
import { getActiveFilterCount, getExploreActionConfig, getExplorePreviewMessage, getExploreTab } from "@/pages/Explore/explorePageUtils";
import { useExplorePreviewState } from "@/pages/Explore/useExplorePreviewState";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getExploreTab(searchParams.get("tab"));
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const [groupCategory, setGroupCategory] = useState<string | null>(null);
  const [eventCategory, setEventCategory] = useState<string | null>(null);
  const [groupMembershipFilter, setGroupMembershipFilter] = useState<GroupMembershipFilter>("all");
  const [eventRegistrationFilter, setEventRegistrationFilter] = useState<EventRegistrationFilter>("all");
  const [groupSort, setGroupSort] = useState<ExploreGroupSort>("members_desc");
  const [eventSort, setEventSort] = useState<ExploreEventSort>("soonest");
  const [selectedEventDate, setSelectedEventDate] = useState<Dayjs | null>(null);
  const groupsQuery = useGroupsQuery(activeTab === "groups");
  const eventsQuery = useEventsQuery(activeTab === "events");
  const createGroupMutation = useCreateGroupMutation();
  const createEventMutation = useCreateEventMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();
  const registerEventMutation = useRegisterEventMutation();
  const cancelEventMutation = useCancelEventMutation();
  const screens = Grid.useBreakpoint();
  const previewState = useExplorePreviewState({ liveEvents: eventsQuery.data ?? [], liveGroups: groupsQuery.data ?? [], eventsError: eventsQuery.error, groupsError: groupsQuery.error });
  const groups = previewState.groups;
  const events = previewState.events;
  const discounts = useMemo(() => filterPreviewDiscounts(previewState.discounts, searchQuery), [previewState.discounts, searchQuery]);
  const pagePadding = screens.xs ? 16 : screens.lg ? 32 : 24;
  const groupCategories = useMemo(() => getGroupCategories(groups), [groups]);
  const eventCategories = useMemo(() => getEventCategories(events), [events]);
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
  const selectedPreviewGroup = previewState.getPreviewGroup(selectedGroupId);
  const selectedPreviewEvent = previewState.getPreviewEvent(selectedEventId);
  const actingGroupId = joinGroupMutation.isPending ? joinGroupMutation.variables : leaveGroupMutation.isPending ? leaveGroupMutation.variables : undefined;
  const actingEventId = registerEventMutation.isPending ? registerEventMutation.variables : cancelEventMutation.isPending ? cancelEventMutation.variables : undefined;
  const errorMessage = activeTab === "groups"
    ? !previewState.groupsUsePreview && groupsQuery.error instanceof Error ? groupsQuery.error.message : undefined
    : !previewState.eventsUsePreview && eventsQuery.error instanceof Error ? eventsQuery.error.message : undefined;
  const previewMessage = getExplorePreviewMessage({ activeTab, eventsUsePreview: previewState.eventsUsePreview, groupsUsePreview: previewState.groupsUsePreview });
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
  }, [activeTab]);
  async function handleCreateGroup(input: { name: string; description: string; category: string }) {
    setActionErrorMessage(null);
    if (previewState.createGroupsLocally) {
      previewState.createPreviewGroup(input);
      setIsCreateGroupOpen(false);
      return;
    }
    await createGroupMutation.mutateAsync(input);
    setIsCreateGroupOpen(false);
  }
  async function handleCreateEvent(input: CreateEventInput) {
    setActionErrorMessage(null);
    if (previewState.createEventsLocally) {
      previewState.createPreviewEvent(input);
      setIsCreateEventOpen(false);
      return;
    }
    await createEventMutation.mutateAsync(input);
    setIsCreateEventOpen(false);
  }

  async function handleToggleMembership(group: AppGroup) {
    if (previewState.isPreviewGroupId(group.id)) {
      setActionErrorMessage(null);
      previewState.togglePreviewMembership(group.id);
      return;
    }
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
    if (previewState.isPreviewEventId(event.id)) {
      setActionErrorMessage(null);
      previewState.togglePreviewRegistration(event.id);
      return;
    }
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
      setIsCreateEventOpen(true);
    }
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
            Keşfet
          </Typography.Title>
          <Typography.Text type="secondary" style={{ marginTop: 4, display: "block" }}>
            Grupları, etkinlikleri ve kampüsteki yeni fırsatları bu ekrandan takip et.
          </Typography.Text>
        </div>

        <ExploreTabs
          activeTab={activeTab}
          counts={{ groups: groups.length, events: events.length, discounts: previewState.discounts.length }}
          extraContent={screens.md ? actionBar : undefined}
          onChange={handleTabChange}
        />
        {!screens.md && actionBar}
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
          discounts={discounts}
          errorMessage={errorMessage}
          events={filteredEvents}
          groups={filteredGroups}
          isEventsLoading={eventsQuery.isLoading && !previewState.eventsUsePreview}
          isGroupsLoading={groupsQuery.isLoading && !previewState.groupsUsePreview}
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
        isCreateEventOpen={isCreateEventOpen}
        isCreateEventSubmitting={!previewState.createEventsLocally && createEventMutation.isPending}
        isCreateGroupOpen={isCreateGroupOpen}
        isCreateGroupSubmitting={!previewState.createGroupsLocally && createGroupMutation.isPending}
        selectedEvent={selectedPreviewEvent}
        selectedEventId={selectedEventId}
        selectedGroup={selectedPreviewGroup}
        selectedGroupId={selectedGroupId}
        onCloseCreateEvent={() => setIsCreateEventOpen(false)}
        onCloseCreateGroup={() => setIsCreateGroupOpen(false)}
        onCloseEventDetail={() => setSelectedEventId(null)}
        onCloseGroupDetail={() => setSelectedGroupId(null)}
        onCreateEvent={handleCreateEvent}
        onCreateGroup={handleCreateGroup}
        onToggleMembership={handleToggleMembership}
        onToggleRegistration={handleToggleRegistration}
      />
    </div>
  );
}
