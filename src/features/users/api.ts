import axios from "axios";
import type { User, UserRole } from "@/types";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const usersApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export interface PublicUserProfile {
  id: string;
  fullName: string;
  role: UserRole;
  department?: string;
  year?: number;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  universityId?: string;
  universityName?: string;
  followersCount: number;
  followingCount: number;
  isFollowedByCurrentUser: boolean;
}

export interface FollowSuggestion {
  id: string;
  fullName: string;
  avatarUrl?: string;
  department?: string;
  universityName?: string;
  mutualGroupCount: number;
  reasonLabel: string;
}

export interface UserConnection {
  id: string;
  fullName: string;
  avatarUrl?: string;
  department?: string;
  universityName?: string;
  isFollowedByCurrentUser: boolean;
}

export interface UpdateMyProfileInput {
  fullName: string;
  department: string;
  year: number;
  bio?: string;
  universityId?: string;
}

export async function getMyProfile() {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.get<User>("/api/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
  return normalizeUser(response.data);
}

export async function getUserProfile(userId: string) {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.get<PublicUserProfile>(
      `/api/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  );

  return normalizePublicProfile(response.data);
}

export async function updateMyProfile(input: UpdateMyProfileInput) {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.put<User>(
      "/api/users/me",
      input,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  );

  return normalizeUser(response.data);
}

export async function getFollowSuggestions(limit = 3) {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.get<FollowSuggestion[]>("/api/users/follow-suggestions", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { limit },
    }),
  );

  return response.data.map(normalizeFollowSuggestion);
}

export async function getFollowers(userId: string) {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.get<UserConnection[]>(`/api/users/${userId}/followers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );

  return response.data.map(normalizeUserConnection);
}

export async function getFollowing(userId: string) {
  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.get<UserConnection[]>(`/api/users/${userId}/following`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );

  return response.data.map(normalizeUserConnection);
}

export async function followUser(userId: string) {
  await executeAuthorizedRequest((accessToken) =>
    usersApi.post(
      `/api/users/${userId}/follow`,
      undefined,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  );
}

export async function unfollowUser(userId: string) {
  await executeAuthorizedRequest((accessToken) =>
    usersApi.delete(`/api/users/${userId}/follow`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  );
}

export async function uploadMyAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.post<User>(
      "/api/users/me/avatar/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  );

  return normalizeUser(response.data);
}

export async function uploadMyCover(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await executeAuthorizedRequest((accessToken) =>
    usersApi.post<User>(
      "/api/users/me/cover/upload",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    ),
  );

  return normalizeUser(response.data);
}

function normalizeUser(user: User): User {
  return {
    ...user,
    department: user.department || undefined,
    year: user.year || undefined,
    bio: user.bio || undefined,
    avatarUrl: user.avatarUrl || undefined,
    coverImageUrl: user.coverImageUrl || undefined,
    universityId: user.universityId || undefined,
    universityName: user.universityName || undefined,
    followersCount: user.followersCount ?? 0,
    followingCount: user.followingCount ?? 0,
  };
}

function normalizePublicProfile(profile: PublicUserProfile): PublicUserProfile {
  return {
    ...profile,
    department: profile.department || undefined,
    year: profile.year || undefined,
    bio: profile.bio || undefined,
    avatarUrl: profile.avatarUrl || undefined,
    coverImageUrl: profile.coverImageUrl || undefined,
    universityId: profile.universityId || undefined,
    universityName: profile.universityName || undefined,
    followersCount: profile.followersCount ?? 0,
    followingCount: profile.followingCount ?? 0,
    isFollowedByCurrentUser: Boolean(profile.isFollowedByCurrentUser),
  };
}

function normalizeFollowSuggestion(suggestion: FollowSuggestion): FollowSuggestion {
  return {
    ...suggestion,
    avatarUrl: suggestion.avatarUrl || undefined,
    department: suggestion.department || undefined,
    universityName: suggestion.universityName || undefined,
  };
}

function normalizeUserConnection(connection: UserConnection): UserConnection {
  return {
    ...connection,
    avatarUrl: connection.avatarUrl || undefined,
    department: connection.department || undefined,
    universityName: connection.universityName || undefined,
    isFollowedByCurrentUser: Boolean(connection.isFollowedByCurrentUser),
  };
}
