import { useMemo, useState } from "react";
import type { AppEvent, CreateEventInput } from "@/features/events/types";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";
import {
  isPreviewEventId,
  isPreviewGroupId,
  mergePreviewEvents,
  mergePreviewGroups,
  previewDiscountsSeed,
  previewEventsSeed,
  previewGroupsSeed,
} from "@/pages/Explore/exploreMockData";

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
  const [previewGroups, setPreviewGroups] = useState(() => cloneGroups(previewGroupsSeed));
  const [previewEvents, setPreviewEvents] = useState(() => cloneEvents(previewEventsSeed));
  const [discounts] = useState(() => [...previewDiscountsSeed]);

  const groups = useMemo(
    () => mergePreviewGroups(liveGroups, previewGroups),
    [liveGroups, previewGroups],
  );
  const events = useMemo(
    () => mergePreviewEvents(liveEvents, previewEvents),
    [liveEvents, previewEvents],
  );
  const groupsUsePreview = Boolean(groupsError) || groups.some((group) => isPreviewGroupId(group.id));
  const eventsUsePreview = Boolean(eventsError) || events.some((event) => isPreviewEventId(event.id));
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

    setPreviewGroups((currentGroups) => [nextGroup, ...currentGroups]);
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

    setPreviewEvents((currentEvents) =>
      [...currentEvents, nextEvent].sort(
        (left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime(),
      ),
    );
  }

  function togglePreviewMembership(groupId: string) {
    setPreviewGroups((currentGroups) =>
      currentGroups.map((group) =>
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
    setPreviewEvents((currentEvents) =>
      currentEvents.map((event) => {
        if (event.id !== eventId) {
          return event;
        }

        if (event.isRegistered) {
          return {
            ...event,
            isRegistered: false,
            participantCount: Math.max(0, event.participantCount - 1),
          };
        }

        return {
          ...event,
          isRegistered: true,
          participantCount: Math.min(event.maxParticipants, event.participantCount + 1),
        };
      }),
    );
  }

  function getPreviewGroup(groupId: string | null) {
    if (!isPreviewGroupId(groupId)) {
      return null;
    }

    return groups.find((group) => group.id === groupId) ?? null;
  }

  function getPreviewEvent(eventId: string | null) {
    if (!isPreviewEventId(eventId)) {
      return null;
    }

    return events.find((event) => event.id === eventId) ?? null;
  }

  return {
    createEventsLocally,
    createGroupsLocally,
    createPreviewEvent,
    createPreviewGroup,
    discounts,
    events,
    eventsUsePreview,
    getPreviewEvent,
    getPreviewGroup,
    groups,
    groupsUsePreview,
    isPreviewEventId,
    isPreviewGroupId,
    togglePreviewMembership,
    togglePreviewRegistration,
  };
}

function cloneGroups(groups: AppGroup[]) {
  return groups.map((group) => ({ ...group }));
}

function cloneEvents(events: AppEvent[]) {
  return events.map((event) => ({ ...event }));
}
