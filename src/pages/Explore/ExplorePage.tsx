import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import CreateEventDialog from "@/pages/Explore/components/CreateEventDialog";
import EventDetailDialog from "@/pages/Explore/components/EventDetailDialog";
import EventGrid from "@/pages/Explore/components/EventGrid";
import CreateGroupDialog from "@/pages/Explore/components/CreateGroupDialog";
import GroupDetailDialog from "@/pages/Explore/components/GroupDetailDialog";
import GroupGrid from "@/pages/Explore/components/GroupGrid";
import ExplorePlaceholderPanel from "@/pages/Explore/components/ExplorePlaceholderPanel";
import ExploreTabs, { type ExploreTab } from "@/pages/Explore/components/ExploreTabs";

export default function ExplorePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getExploreTab(searchParams.get("tab"));
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [actionErrorMessage, setActionErrorMessage] = useState<string | null>(null);
  const groupsQuery = useGroupsQuery(activeTab === "groups");
  const eventsQuery = useEventsQuery(activeTab === "events");
  const createGroupMutation = useCreateGroupMutation();
  const createEventMutation = useCreateEventMutation();
  const joinGroupMutation = useJoinGroupMutation();
  const leaveGroupMutation = useLeaveGroupMutation();
  const registerEventMutation = useRegisterEventMutation();
  const cancelEventMutation = useCancelEventMutation();

  const groups = groupsQuery.data ?? [];
  const events = eventsQuery.data ?? [];
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return groups;
    }

    return groups.filter(
      (group) =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.category.toLowerCase().includes(query),
    );
  }, [groups, searchQuery]);
  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return events;
    }

    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query) ||
        event.creatorName.toLowerCase().includes(query) ||
        (event.groupName?.toLowerCase().includes(query) ?? false),
    );
  }, [events, searchQuery]);

  const actingGroupId = joinGroupMutation.isPending
    ? joinGroupMutation.variables
    : leaveGroupMutation.isPending
      ? leaveGroupMutation.variables
      : undefined;
  const actingEventId = registerEventMutation.isPending
    ? registerEventMutation.variables
    : cancelEventMutation.isPending
      ? cancelEventMutation.variables
      : undefined;
  const errorMessage =
    activeTab === "groups"
      ? groupsQuery.error instanceof Error
        ? groupsQuery.error.message
        : undefined
      : eventsQuery.error instanceof Error
        ? eventsQuery.error.message
        : undefined;

  useEffect(() => {
    setActionErrorMessage(null);
    setSelectedGroupId(null);
    setSelectedEventId(null);
  }, [activeTab]);

  async function handleCreateGroup(input: {
    name: string;
    description: string;
    category: string;
  }) {
    await createGroupMutation.mutateAsync(input);
    setIsCreateGroupOpen(false);
  }

  async function handleCreateEvent(input: CreateEventInput) {
    await createEventMutation.mutateAsync(input);
    setIsCreateEventOpen(false);
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
        error instanceof Error ? error.message : "Grup islemi tamamlanamadi.",
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
        error instanceof Error ? error.message : "Etkinlik islemi tamamlanamadi.",
      );
    }
  }

  function handleTabChange(tab: ExploreTab) {
    setSearchQuery("");
    setActionErrorMessage(null);
    setSelectedGroupId(null);
    setSelectedEventId(null);
    setSearchParams(tab === "groups" ? {} : { tab }, { replace: true });
  }

  const searchPlaceholder =
    activeTab === "groups"
      ? "Grup ara..."
      : activeTab === "events"
        ? "Etkinlik ara..."
        : "Indirim ara...";
  const createButtonLabel =
    activeTab === "groups"
      ? "Grup Olustur"
      : activeTab === "events"
        ? "Etkinlik Olustur"
        : null;

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 lg:p-6 xl:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Kesfet</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gruplar ve etkinlikler bu ekranda gercek backend verisiyle calisiyor.
          </p>
        </div>

        {createButtonLabel && (
          <Button
            className="gap-2 self-start"
            onClick={() => {
              if (activeTab === "groups") {
                setIsCreateGroupOpen(true);
              } else if (activeTab === "events") {
                setIsCreateEventOpen(true);
              }
            }}
          >
            <Plus className="w-4 h-4" />
            {createButtonLabel}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>

        <ExploreTabs activeTab={activeTab} onChange={handleTabChange} />
      </div>

      {activeTab === "groups" ? (
        <>
          {actionErrorMessage && (
            <p className="text-sm text-destructive">{actionErrorMessage}</p>
          )}

          <GroupGrid
            groups={filteredGroups}
            actingGroupId={actingGroupId}
            errorMessage={errorMessage}
            isLoading={groupsQuery.isLoading}
            onOpen={setSelectedGroupId}
            onToggleMembership={handleToggleMembership}
          />
        </>
      ) : activeTab === "events" ? (
        <>
          {actionErrorMessage && (
            <p className="text-sm text-destructive">{actionErrorMessage}</p>
          )}

          <EventGrid
            events={filteredEvents}
            actingEventId={actingEventId}
            errorMessage={errorMessage}
            isLoading={eventsQuery.isLoading}
            onOpen={setSelectedEventId}
            onToggleRegistration={handleToggleRegistration}
          />
        </>
      ) : (
        <ExplorePlaceholderPanel
          title="Indirimler sonraki task"
          description="Bu sekme bilerek sade tutuldu. Once gruplar ve etkinlikler dilimini gercek backend ile kapatiyoruz."
        />
      )}

      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        isSubmitting={createGroupMutation.isPending}
        onClose={() => setIsCreateGroupOpen(false)}
        onSubmit={handleCreateGroup}
      />

      <CreateEventDialog
        isOpen={isCreateEventOpen}
        isSubmitting={createEventMutation.isPending}
        onClose={() => setIsCreateEventOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <GroupDetailDialog
        actingGroupId={actingGroupId}
        errorMessage={actionErrorMessage}
        groupId={selectedGroupId}
        onClose={() => setSelectedGroupId(null)}
        onToggleMembership={handleToggleMembership}
      />

      <EventDetailDialog
        actingEventId={actingEventId}
        errorMessage={actionErrorMessage}
        eventId={selectedEventId}
        onClose={() => setSelectedEventId(null)}
        onToggleRegistration={handleToggleRegistration}
      />
    </div>
  );
}

function getExploreTab(value: string | null): ExploreTab {
  return value === "events" || value === "discounts" ? value : "groups";
}
