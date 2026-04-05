import axios from "axios";
import type { User, UserRole } from "@/types";
import { getAccessToken } from "@/features/auth/token";

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
  const response = await usersApi.get<User>("/api/users/me", getAuthorizedConfig());
  return normalizeUser(response.data);
}

export async function getUserProfile(userId: string) {
  const response = await usersApi.get<PublicUserProfile>(
    `/api/users/${userId}`,
    getAuthorizedConfig(),
  );

  return normalizePublicProfile(response.data);
}

export async function updateMyProfile(input: UpdateMyProfileInput) {
  const response = await usersApi.put<User>(
    "/api/users/me",
    input,
    getAuthorizedConfig(),
  );

  return normalizeUser(response.data);
}

export async function uploadMyAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await usersApi.post<User>(
    "/api/users/me/avatar/upload",
    formData,
    getAuthorizedConfig(),
  );

  return normalizeUser(response.data);
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

function normalizeUser(user: User): User {
  return {
    ...user,
    department: user.department || undefined,
    year: user.year || undefined,
    bio: user.bio || undefined,
    avatarUrl: user.avatarUrl || undefined,
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
    universityId: profile.universityId || undefined,
    universityName: profile.universityName || undefined,
  };
}
