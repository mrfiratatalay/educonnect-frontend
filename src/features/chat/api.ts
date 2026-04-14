import axios from "axios";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  ChatbotReply,
  ChatMessageItem,
  ChatSession,
  ChatSessionStartedResponse,
} from "@/features/chat/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const chatApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export async function startSession(): Promise<ChatSessionStartedResponse> {
  const response = await executeAuthorizedRequest<ChatSessionStartedResponse>((token) =>
    chatApi.post("/api/chat/sessions", null, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function sendMessage(
  sessionId: string,
  message: string,
): Promise<ChatbotReply> {
  const response = await executeAuthorizedRequest<ChatbotReply>((token) =>
    chatApi.post(
      `/api/chat/sessions/${sessionId}/messages`,
      { message },
      { headers: { Authorization: `Bearer ${token}` } },
    ),
  );
  return response.data;
}

export async function getSessions(): Promise<ChatSession[]> {
  const response = await executeAuthorizedRequest<ChatSession[]>((token) =>
    chatApi.get("/api/chat/sessions", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function getMessages(
  sessionId: string,
): Promise<ChatMessageItem[]> {
  const response = await executeAuthorizedRequest<ChatMessageItem[]>((token) =>
    chatApi.get(`/api/chat/sessions/${sessionId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
  return response.data;
}

export async function endSession(sessionId: string): Promise<void> {
  await executeAuthorizedRequest<void>((token) =>
    chatApi.delete(`/api/chat/sessions/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}

export async function deleteSessionPermanent(sessionId: string): Promise<void> {
  await executeAuthorizedRequest<void>((token) =>
    chatApi.delete(`/api/chat/sessions/${sessionId}/permanent`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  );
}
