export interface AppEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  creatorUserId: string;
  creatorName: string;
  groupId?: string;
  groupName?: string;
  maxParticipants: number;
  participantCount: number;
  isRegistered: boolean;
  category: string;
}

export interface CreateEventInput {
  title: string;
  description: string;
  location: string;
  startDateUtc: string;
  endDateUtc: string;
  maxParticipants: number;
  category: string;
  groupId?: string;
}

export interface UpdateEventInput extends CreateEventInput {
  eventId: string;
}

export interface EventFilters {
  groupId?: string;
}
