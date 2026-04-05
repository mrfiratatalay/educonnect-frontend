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
  };
}
