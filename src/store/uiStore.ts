import { create } from "zustand";

interface UIState {
  isComposeModalOpen: boolean;
  openComposeModal: () => void;
  closeComposeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isComposeModalOpen: false,
  openComposeModal: () => set({ isComposeModalOpen: true }),
  closeComposeModal: () => set({ isComposeModalOpen: false }),
}));
