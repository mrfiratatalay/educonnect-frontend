import type { AppEvent, CreateEventInput } from "@/features/events/types";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";
import CreateEventDialog from "@/pages/Explore/components/CreateEventDialog";
import CreateGroupDialog from "@/pages/Explore/components/CreateGroupDialog";
import EventDetailDialog from "@/pages/Explore/components/EventDetailDialog";
import GroupDetailDialog from "@/pages/Explore/components/GroupDetailDialog";

interface ExploreDialogsProps {
  actingEventId?: string;
  actingGroupId?: string;
  actionErrorMessage: string | null;
  eventToEdit?: AppEvent | null;
  isCreateEventOpen: boolean;
  isCreateEventSubmitting: boolean;
  isCreateGroupOpen: boolean;
  isCreateGroupSubmitting: boolean;
  isDeletingEvent?: boolean;
  selectedEvent: AppEvent | null;
  selectedEventId: string | null;
  selectedGroup: AppGroup | null;
  selectedGroupId: string | null;
  onCloseCreateEvent: () => void;
  onCloseCreateGroup: () => void;
  onCloseEventDetail: () => void;
  onCloseGroupDetail: () => void;
  onDeleteEvent?: (event: AppEvent) => void;
  onEditEvent?: (event: AppEvent) => void;
  onCreateEvent: (input: CreateEventInput) => Promise<void>;
  onCreateGroup: (input: CreateGroupInput) => Promise<void>;
  onToggleMembership: (group: AppGroup) => void;
  onToggleRegistration: (event: AppEvent) => void;
}

export default function ExploreDialogs({
  actingEventId,
  actingGroupId,
  actionErrorMessage,
  eventToEdit,
  isCreateEventOpen,
  isCreateEventSubmitting,
  isCreateGroupOpen,
  isCreateGroupSubmitting,
  isDeletingEvent = false,
  selectedEvent,
  selectedEventId,
  selectedGroup,
  selectedGroupId,
  onCloseCreateEvent,
  onCloseCreateGroup,
  onCloseEventDetail,
  onCloseGroupDetail,
  onDeleteEvent,
  onEditEvent,
  onCreateEvent,
  onCreateGroup,
  onToggleMembership,
  onToggleRegistration,
}: ExploreDialogsProps) {
  return (
    <>
      <CreateGroupDialog
        isOpen={isCreateGroupOpen}
        isSubmitting={isCreateGroupSubmitting}
        onClose={onCloseCreateGroup}
        onSubmit={onCreateGroup}
      />
      <CreateEventDialog
        event={eventToEdit}
        isOpen={isCreateEventOpen}
        isSubmitting={isCreateEventSubmitting}
        onClose={onCloseCreateEvent}
        onSubmit={onCreateEvent}
      />
      <GroupDetailDialog
        actingGroupId={actingGroupId}
        errorMessage={actionErrorMessage}
        group={selectedGroup}
        groupId={selectedGroupId}
        onClose={onCloseGroupDetail}
        onToggleMembership={onToggleMembership}
      />
      <EventDetailDialog
        actingEventId={actingEventId}
        errorMessage={actionErrorMessage}
        event={selectedEvent}
        eventId={selectedEventId}
        isDeleting={isDeletingEvent}
        onClose={onCloseEventDetail}
        onDelete={onDeleteEvent}
        onEdit={onEditEvent}
        onToggleRegistration={onToggleRegistration}
      />
    </>
  );
}
