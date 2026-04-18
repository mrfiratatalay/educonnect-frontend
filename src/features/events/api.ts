import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type { AppEvent, CreateEventInput, EventFilters, UpdateEventInput } from "@/features/events/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const eventsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiEventResponse {
  id: string;
  title: string;
  description: string;
  location: string;
  startDateUtc: string;
  endDateUtc: string;
  creatorUserId: string;
  creatorName: string;
  groupId?: string;
  groupName?: string;
  maxParticipants: number;
  participantCount: number;
  registeredByCurrentUser: boolean;
  category: string;
}

export async function getEvents(filters: EventFilters = {}): Promise<AppEvent[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      eventsApi.get<ApiEventResponse[]>(
        "/api/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            groupId: filters.groupId,
          },
        },
      ),
    );

    return response.data.map(normalizeEvent);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getEvent(eventId: string): Promise<AppEvent> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      eventsApi.get<ApiEventResponse>(
        `/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeEvent(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createEvent(input: CreateEventInput): Promise<AppEvent> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      eventsApi.post<ApiEventResponse>(
        "/api/events",
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeEvent(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateEvent(input: UpdateEventInput): Promise<AppEvent> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      eventsApi.put<ApiEventResponse>(
        `/api/events/${input.eventId}`,
        {
          title: input.title,
          description: input.description,
          location: input.location,
          startDateUtc: input.startDateUtc,
          endDateUtc: input.endDateUtc,
          maxParticipants: input.maxParticipants,
          category: input.category,
          groupId: input.groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeEvent(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deleteEvent(eventId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      eventsApi.delete(`/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function registerEvent(eventId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      eventsApi.post(
        `/api/events/${eventId}/register`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function cancelEvent(eventId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      eventsApi.delete(`/api/events/${eventId}/cancel`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function normalizeEvent(event: ApiEventResponse): AppEvent {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDateUtc,
    endDate: event.endDateUtc,
    creatorUserId: event.creatorUserId,
    creatorName: event.creatorName,
    groupId: event.groupId,
    groupName: event.groupName,
    maxParticipants: event.maxParticipants,
    participantCount: event.participantCount,
    isRegistered: event.registeredByCurrentUser,
    category: event.category,
  };
}
