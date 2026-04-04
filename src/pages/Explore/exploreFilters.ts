import dayjs, { type Dayjs } from "dayjs";
import type { AppEvent } from "@/features/events/types";
import type { AppGroup } from "@/features/groups/types";

export type ExploreGroupSort = "members_desc" | "name_asc" | "newest";
export type ExploreEventSort = "soonest" | "popular" | "latest";
export type GroupMembershipFilter = "all" | "member" | "discover";
export type EventRegistrationFilter = "all" | "registered" | "available";

export const groupSortOptions = [
  { label: "En çok üyeli", value: "members_desc" },
  { label: "Ada göre", value: "name_asc" },
  { label: "En yeni", value: "newest" },
] as const satisfies Array<{ label: string; value: ExploreGroupSort }>;

export const eventSortOptions = [
  { label: "En yakın tarih", value: "soonest" },
  { label: "En popüler", value: "popular" },
  { label: "En yeni eklenen", value: "latest" },
] as const satisfies Array<{ label: string; value: ExploreEventSort }>;

interface ApplyGroupFiltersInput {
  groups: AppGroup[];
  searchQuery: string;
  selectedCategory: string | null;
  membershipFilter: GroupMembershipFilter;
  sort: ExploreGroupSort;
}

interface ApplyEventFiltersInput {
  events: AppEvent[];
  searchQuery: string;
  selectedCategory: string | null;
  registrationFilter: EventRegistrationFilter;
  selectedDate: Dayjs | null;
  sort: ExploreEventSort;
}

export function getGroupCategories(groups: AppGroup[]) {
  return [...new Set(groups.map((group) => group.category))].sort((left, right) =>
    left.localeCompare(right, "tr"),
  );
}

export function getEventCategories(events: AppEvent[]) {
  return [...new Set(events.map((event) => event.category))].sort((left, right) =>
    left.localeCompare(right, "tr"),
  );
}

export function applyGroupFilters({
  groups,
  searchQuery,
  selectedCategory,
  membershipFilter,
  sort,
}: ApplyGroupFiltersInput) {
  const query = searchQuery.trim().toLocaleLowerCase("tr");

  const filtered = groups.filter((group) => {
    if (selectedCategory && group.category !== selectedCategory) {
      return false;
    }

    if (membershipFilter === "member" && !group.isMember) {
      return false;
    }

    if (membershipFilter === "discover" && group.isMember) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      group.name.toLocaleLowerCase("tr").includes(query) ||
      group.description.toLocaleLowerCase("tr").includes(query) ||
      group.category.toLocaleLowerCase("tr").includes(query) ||
      group.creatorName.toLocaleLowerCase("tr").includes(query)
    );
  });

  return filtered.sort((left, right) => {
    if (sort === "members_desc") {
      return right.memberCount - left.memberCount;
    }

    if (sort === "newest") {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    return left.name.localeCompare(right.name, "tr");
  });
}

export function applyEventFilters({
  events,
  searchQuery,
  selectedCategory,
  registrationFilter,
  selectedDate,
  sort,
}: ApplyEventFiltersInput) {
  const query = searchQuery.trim().toLocaleLowerCase("tr");

  const filtered = events.filter((event) => {
    if (selectedCategory && event.category !== selectedCategory) {
      return false;
    }

    if (registrationFilter === "registered" && !event.isRegistered) {
      return false;
    }

    if (registrationFilter === "available" && event.isRegistered) {
      return false;
    }

    if (selectedDate && !isSameCalendarDay(event.startDate, selectedDate)) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      event.title.toLocaleLowerCase("tr").includes(query) ||
      event.description.toLocaleLowerCase("tr").includes(query) ||
      event.location.toLocaleLowerCase("tr").includes(query) ||
      event.category.toLocaleLowerCase("tr").includes(query) ||
      event.creatorName.toLocaleLowerCase("tr").includes(query) ||
      (event.groupName?.toLocaleLowerCase("tr").includes(query) ?? false)
    );
  });

  return filtered.sort((left, right) => {
    if (sort === "popular") {
      return right.participantCount - left.participantCount;
    }

    if (sort === "latest") {
      return new Date(right.startDate).getTime() - new Date(left.startDate).getTime();
    }

    return new Date(left.startDate).getTime() - new Date(right.startDate).getTime();
  });
}

export function getUpcomingTimelineEvents(events: AppEvent[], limit = 5) {
  return [...events]
    .filter((event) => new Date(event.endDate).getTime() >= Date.now())
    .sort((left, right) => new Date(left.startDate).getTime() - new Date(right.startDate).getTime())
    .slice(0, limit);
}

function isSameCalendarDay(value: string, selectedDate: Dayjs) {
  return dayjs(value).isSame(selectedDate, "day");
}
