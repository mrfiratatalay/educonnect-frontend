import { create } from "zustand";

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

function readStoredDarkMode(): boolean {
  try {
    return localStorage.getItem("educonnect-dark-mode") === "true";
  } catch {
    return false;
  }
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: readStoredDarkMode(),
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem("educonnect-dark-mode", String(next));
      return { isDark: next };
    }),
  setDark: (dark) => {
    localStorage.setItem("educonnect-dark-mode", String(dark));
    set({ isDark: dark });
  },
}));
