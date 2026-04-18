import axios, { type AxiosResponse } from "axios";
import { refreshSession, type AuthSession } from "@/features/auth/api";
import { getAccessToken } from "@/features/auth/token";
import { useAuthStore } from "@/store/authStore";

let refreshPromise: Promise<AuthSession> | null = null;

export async function executeAuthorizedRequest<T>(
  request: (accessToken: string) => Promise<AxiosResponse<T>>,
): Promise<AxiosResponse<T>> {
  const accessToken = await getValidAccessToken();

  try {
    return await request(accessToken);
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      throw error;
    }

    const refreshedSession = await refreshAccessToken();
    return await request(refreshedSession.accessToken);
  }
}

async function getValidAccessToken() {
  const accessToken = getAccessToken();

  if (accessToken) {
    return accessToken;
  }

  try {
    const session = await refreshAccessToken();
    return session.accessToken;
  } catch {
    throw new Error("Oturum bulunamadi. Lütfen yeniden giriş yapin.");
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const session = await refreshSession();
        useAuthStore.getState().setSession(session);
        return session;
      } catch (error) {
        useAuthStore.getState().clearSession();
        throw error;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return await refreshPromise;
}

function isUnauthorizedError(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 401;
}
