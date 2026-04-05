import { create } from "zustand";

interface UIState {
  isComposeModalOpen: boolean;
  isMobileDrawerOpen: boolean;
  openComposeModal: () => void;
  closeComposeModal: () => void;
  openMobileDrawer: () => void;
  closeMobileDrawer: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isComposeModalOpen: false,
  isMobileDrawerOpen: false,
  openComposeModal: () => set({ isComposeModalOpen: true }),
  closeComposeModal: () => set({ isComposeModalOpen: false }),
  openMobileDrawer: () => set({ isMobileDrawerOpen: true }),
  closeMobileDrawer: () => set({ isMobileDrawerOpen: false }),
}));
