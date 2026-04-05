import { create } from "zustand";
import {
  logout as requestLogout,
  refreshSession,
  type AuthSession,
} from "@/features/auth/api";
import {
  clearAccessToken,
  setAccessToken,
} from "@/features/auth/token";
import type { User } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  status: AuthStatus;
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  hasHydratedSession: boolean;
  isHydratingSession: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  hydrateSession: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "loading",
  user: null,
  accessToken: null,
  isAuthenticated: false,
  hasHydratedSession: false,
  isHydratingSession: false,
  setSession: (session) => {
    setAccessToken(session.accessToken);
    set({
      status: "authenticated",
      user: session.user,
      accessToken: session.accessToken,
      isAuthenticated: true,
      hasHydratedSession: true,
      isHydratingSession: false,
    });
  },
  clearSession: () => {
    clearAccessToken();
    set({
      status: "unauthenticated",
      user: null,
      accessToken: null,
      isAuthenticated: false,
      hasHydratedSession: true,
      isHydratingSession: false,
    });
  },
  hydrateSession: async () => {
    if (get().hasHydratedSession || get().isHydratingSession) {
      return;
    }

    set((state) => ({
      ...state,
      status: "loading",
      isHydratingSession: true,
    }));

    try {
      const session = await refreshSession();
      get().setSession(session);
    } catch {
      get().clearSession();
    }
  },
  logout: async () => {
    const { accessToken } = get();

    try {
      await requestLogout(accessToken);
    } catch {
      // Logout should still clear the local session even if the request fails.
    } finally {
      get().clearSession();
    }
  },
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
}));
