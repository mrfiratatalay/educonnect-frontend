import type { Dayjs } from "dayjs";
import type {
  EventRegistrationFilter,
  ExploreEventSort,
  ExploreGroupSort,
  GroupMembershipFilter,
} from "@/pages/Explore/exploreFilters";
import type { ExploreTab } from "@/pages/Explore/components/ExploreTabs";

interface GetActiveFilterCountInput {
  activeTab: ExploreTab;
  eventCategory: string | null;
  eventRegistrationFilter: EventRegistrationFilter;
  eventSort: ExploreEventSort;
  groupCategory: string | null;
  groupMembershipFilter: GroupMembershipFilter;
  groupSort: ExploreGroupSort;
  selectedEventDate: Dayjs | null;
}

export function getExploreTab(value: string | null): ExploreTab {
  return value === "events" || value === "discounts" ? value : "groups";
}

export function getExploreActionConfig(activeTab: ExploreTab) {
  return {
    createButtonLabel:
      activeTab === "groups"
        ? "Grup Olustur"
        : activeTab === "events"
          ? "Etkinlik Olustur"
          : null,
    searchPlaceholder:
      activeTab === "groups"
        ? "Grup ara"
        : activeTab === "events"
          ? "Etkinlik ara"
          : "Indirim ara",
  };
}

export function getExplorePreviewMessage({
  activeTab,
  eventsUsePreview,
  groupsUsePreview,
}: {
  activeTab: ExploreTab;
  eventsUsePreview: boolean;
  groupsUsePreview: boolean;
}) {
  if (activeTab === "groups" && groupsUsePreview) {
    return "Ornek grup icerikleri gosteriliyor.";
  }

  if (activeTab === "events" && eventsUsePreview) {
    return "Ornek etkinlik icerikleri gosteriliyor.";
  }

  return null;
}

export function getActiveFilterCount({
  activeTab,
  eventCategory,
  eventRegistrationFilter,
  eventSort,
  groupCategory,
  groupMembershipFilter,
  groupSort,
  selectedEventDate,
}: GetActiveFilterCountInput) {
  if (activeTab === "groups") {
    return (
      Number(Boolean(groupCategory)) +
      Number(groupMembershipFilter !== "all") +
      Number(groupSort !== "members_desc")
    );
  }

  if (activeTab === "events") {
    return (
      Number(Boolean(eventCategory)) +
      Number(Boolean(selectedEventDate)) +
      Number(eventRegistrationFilter !== "all") +
      Number(eventSort !== "soonest")
    );
  }

  return 0;
}
