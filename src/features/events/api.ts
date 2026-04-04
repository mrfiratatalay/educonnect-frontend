import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { getAccessToken } from "@/features/auth/token";
import type { AppEvent, CreateEventInput } from "@/features/events/types";

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

export async function getEvents(): Promise<AppEvent[]> {
  try {
    const response = await eventsApi.get<ApiEventResponse[]>(
      "/api/events",
      getAuthorizedConfig(),
    );

    return response.data.map(normalizeEvent);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getEvent(eventId: string): Promise<AppEvent> {
  try {
    const response = await eventsApi.get<ApiEventResponse>(
      `/api/events/${eventId}`,
      getAuthorizedConfig(),
    );

    return normalizeEvent(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createEvent(input: CreateEventInput): Promise<AppEvent> {
  try {
    const response = await eventsApi.post<ApiEventResponse>(
      "/api/events",
      input,
      getAuthorizedConfig(),
    );

    return normalizeEvent(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function registerEvent(eventId: string) {
  try {
    await eventsApi.post(
      `/api/events/${eventId}/register`,
      undefined,
      getAuthorizedConfig(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function cancelEvent(eventId: string) {
  try {
    await eventsApi.delete(`/api/events/${eventId}/cancel`, getAuthorizedConfig());
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function getAuthorizedConfig() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Oturum bulunamadi. Lutfen yeniden giris yapin.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
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
