import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  ConversationSummary,
  DirectMessageItem,
  PagedMessages,
  StartConversationResult,
  UserSearchResult,
} from "@/features/messages/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const conversationsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

function mapMessage(m: {
  id: string;
  senderUserId: string;
  content: string;
  sentAtUtc: string;
}): DirectMessageItem {
  return {
    id: m.id,
    senderUserId: m.senderUserId,
    content: m.content,
    sentAtUtc: m.sentAtUtc,
  };
}

export async function getConversations(): Promise<ConversationSummary[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      conversationsApi.get<ConversationSummary[]>("/api/conversations", {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getMessages(
  conversationId: string,
  page = 1,
  pageSize = 30,
): Promise<PagedMessages> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      conversationsApi.get<PagedMessages>(
        `/api/conversations/${conversationId}/messages`,
        {
          params: { page, pageSize },
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ),
    );
    return {
      ...response.data,
      items: response.data.items.map(mapMessage),
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function startConversation(otherUserId: string): Promise<StartConversationResult> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      conversationsApi.post<StartConversationResult>(
        "/api/conversations",
        { otherUserId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function searchUsers(q: string): Promise<UserSearchResult[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      conversationsApi.get<UserSearchResult[]>("/api/users/search", {
        params: { q, limit: 10 },
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<DirectMessageItem> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      conversationsApi.post<DirectMessageItem>(
        `/api/conversations/${conversationId}/messages`,
        { content },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      ),
    );
    return mapMessage(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}
