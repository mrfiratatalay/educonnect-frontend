import { useMemo, useState } from "react";
import type { AppEvent, CreateEventInput } from "@/features/events/types";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";
import type { Discount } from "@/types";

interface UseExplorePreviewStateParams {
  liveEvents: AppEvent[];
  liveGroups: AppGroup[];
  eventsError: unknown;
  groupsError: unknown;
}

export function useExplorePreviewState({
  liveEvents,
  liveGroups,
  eventsError,
  groupsError,
}: UseExplorePreviewStateParams) {
  const [localGroups, setLocalGroups] = useState<AppGroup[]>([]);
  const [localEvents, setLocalEvents] = useState<AppEvent[]>([]);

  const groups = useMemo(
    () => dedupeById([...liveGroups, ...localGroups]),
    [liveGroups, localGroups],
  );
  const events = useMemo(
    () => dedupeById([...liveEvents, ...localEvents]),
    [liveEvents, localEvents],
  );
  const discounts: Discount[] = [];
  const createGroupsLocally = Boolean(groupsError) || liveGroups.length === 0;
  const createEventsLocally = Boolean(eventsError) || liveEvents.length === 0;

  function createPreviewGroup(input: CreateGroupInput) {
    const nextGroup: AppGroup = {
      id: `local-group-${Date.now()}`,
      name: input.name,
      shortDescription: input.shortDescription,
      description: input.description,
      avatarUrl: input.avatarUrl,
      bannerUrl: input.bannerUrl,
      category: input.category,
      creatorUserId: "current-user",
      creatorName: "Sen",
      memberCount: 1,
      isMember: true,
      createdAt: new Date().toISOString(),
    };

    setLocalGroups((current) => [nextGroup, ...current]);
  }

  function createPreviewEvent(input: CreateEventInput) {
    const nextEvent: AppEvent = {
      id: `local-event-${Date.now()}`,
      title: input.title,
      description: input.description,
      location: input.location,
      startDate: input.startDateUtc,
      endDate: input.endDateUtc,
      creatorUserId: "current-user",
      creatorName: "Sen",
      groupId: input.groupId,
      maxParticipants: input.maxParticipants,
      participantCount: 1,
      isRegistered: true,
      category: input.category,
    };

    setLocalEvents((current) =>
      [...current, nextEvent].sort(
        (left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime(),
      ),
    );
  }

  function togglePreviewMembership(groupId: string) {
    setLocalGroups((current) =>
      current.map((group) =>
        group.id !== groupId
          ? group
          : {
              ...group,
              isMember: !group.isMember,
              memberCount: group.isMember
                ? Math.max(0, group.memberCount - 1)
                : group.memberCount + 1,
            },
      ),
    );
  }

  function togglePreviewRegistration(eventId: string) {
    setLocalEvents((current) =>
      current.map((event) => {
        if (event.id !== eventId) return event;
        if (event.isRegistered) {
          return { ...event, isRegistered: false, participantCount: Math.max(0, event.participantCount - 1) };
        }
        return { ...event, isRegistered: true, participantCount: Math.min(event.maxParticipants, event.participantCount + 1) };
      }),
    );
  }

  function isLocalId(id: string | null) {
    return Boolean(id?.startsWith("local-group-") || id?.startsWith("local-event-"));
  }

  function getPreviewGroup(groupId: string | null) {
    if (!groupId || !isLocalId(groupId)) return null;
    return groups.find((group) => group.id === groupId) ?? null;
  }

  function getPreviewEvent(eventId: string | null) {
    if (!eventId || !isLocalId(eventId)) return null;
    return events.find((event) => event.id === eventId) ?? null;
  }

  return {
    createEventsLocally,
    createGroupsLocally,
    createPreviewEvent,
    createPreviewGroup,
    discounts,
    events,
    eventsUsePreview: false,
    getPreviewEvent,
    getPreviewGroup,
    groups,
    groupsUsePreview: false,
    isPreviewEventId: isLocalId,
    isPreviewGroupId: isLocalId,
    togglePreviewMembership,
    togglePreviewRegistration,
  };
}

function dedupeById<T extends { id: string }>(items: T[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
