import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { getAccessToken } from "@/features/auth/token";
import type { AppGroup, CreateGroupInput } from "@/features/groups/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const groupsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiGroupResponse {
  id: string;
  name: string;
  description: string;
  category: string;
  creatorUserId: string;
  creatorName: string;
  memberCount: number;
  joinedByCurrentUser: boolean;
  createdAtUtc: string;
}

export async function getGroups(): Promise<AppGroup[]> {
  try {
    const response = await groupsApi.get<ApiGroupResponse[]>(
      "/api/groups",
      getAuthorizedConfig(),
    );

    return response.data.map(normalizeGroup);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getGroup(groupId: string): Promise<AppGroup> {
  try {
    const response = await groupsApi.get<ApiGroupResponse>(
      `/api/groups/${groupId}`,
      getAuthorizedConfig(),
    );

    return normalizeGroup(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createGroup(input: CreateGroupInput): Promise<AppGroup> {
  try {
    const response = await groupsApi.post<ApiGroupResponse>(
      "/api/groups",
      input,
      getAuthorizedConfig(),
    );

    return normalizeGroup(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function joinGroup(groupId: string) {
  try {
    await groupsApi.post(
      `/api/groups/${groupId}/join`,
      undefined,
      getAuthorizedConfig(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function leaveGroup(groupId: string) {
  try {
    await groupsApi.delete(`/api/groups/${groupId}/leave`, getAuthorizedConfig());
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

function normalizeGroup(group: ApiGroupResponse): AppGroup {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    category: group.category,
    creatorUserId: group.creatorUserId,
    creatorName: group.creatorName,
    memberCount: group.memberCount,
    isMember: group.joinedByCurrentUser,
    createdAt: group.createdAtUtc,
  };
}
