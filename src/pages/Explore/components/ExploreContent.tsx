import { Col, Row } from "antd";
import type { AppEvent } from "@/features/events/types";
import type { AppGroup } from "@/features/groups/types";
import EventGrid from "@/pages/Explore/components/EventGrid";
import ExploreDiscountGrid from "@/pages/Explore/components/ExploreDiscountGrid";
import ExploreEventTimelineCard from "@/pages/Explore/components/ExploreEventTimelineCard";
import type { ExploreTab } from "@/pages/Explore/components/ExploreTabs";
import GroupGrid from "@/pages/Explore/components/GroupGrid";
import type { Discount } from "@/types";

interface ExploreContentProps {
  activeTab: ExploreTab;
  actingEventId?: string;
  actingGroupId?: string;
  discounts: Discount[];
  errorMessage?: string;
  events: AppEvent[];
  groups: AppGroup[];
  isEventsLoading: boolean;
  isGroupsLoading: boolean;
  timelineEvents: AppEvent[];
  onOpenEvent: (eventId: string) => void;
  onOpenGroup: (groupId: string) => void;
  onToggleMembership: (group: AppGroup) => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function ExploreContent({
  activeTab,
  actingEventId,
  actingGroupId,
  discounts,
  errorMessage,
  events,
  groups,
  isEventsLoading,
  isGroupsLoading,
  timelineEvents,
  onOpenEvent,
  onOpenGroup,
  onToggleMembership,
  onToggleRegistration,
}: ExploreContentProps) {
  if (activeTab === "groups") {
    return (
      <GroupGrid
        actingGroupId={actingGroupId}
        errorMessage={errorMessage}
        groups={groups}
        isLoading={isGroupsLoading}
        onOpen={onOpenGroup}
        onToggleMembership={onToggleMembership}
      />
    );
  }

  if (activeTab === "events") {
    return (
      <Row align="top" gutter={[20, 20]}>
        <Col xs={24} xl={16}>
          <EventGrid
            actingEventId={actingEventId}
            errorMessage={errorMessage}
            events={events}
            isLoading={isEventsLoading}
            onOpen={onOpenEvent}
            onToggleRegistration={onToggleRegistration}
          />
        </Col>
        <Col xs={24} xl={8}>
          <ExploreEventTimelineCard events={timelineEvents} onOpen={onOpenEvent} />
        </Col>
      </Row>
    );
  }

  return <ExploreDiscountGrid discounts={discounts} />;
}
