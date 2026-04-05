import { create } from "zustand";

interface PostComposerState {
  content: string;
  imageFile: File | null;
  setContent: (content: string) => void;
  setImageFile: (file: File | null) => void;
  clearDraft: () => void;
}

export const usePostComposerStore = create<PostComposerState>((set) => ({
  content: "",
  imageFile: null,
  setContent: (content) => set({ content }),
  setImageFile: (imageFile) => set({ imageFile }),
  clearDraft: () =>
    set({
      content: "",
      imageFile: null,
    }),
}));
