import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  sessionId: string | null;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  setSessionId: (id: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  sessionId: null,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  setSessionId: (id) => set({ sessionId: id }),
  clearMessages: () => set({ messages: [], sessionId: null }),
}));
