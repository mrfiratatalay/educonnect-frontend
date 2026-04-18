export interface ConversationSummary {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatarUrl?: string | null;
  lastMessagePreview?: string | null;
  lastMessageAtUtc: string;
}

export interface DirectMessageItem {
  id: string;
  senderUserId: string;
  content: string;
  sentAtUtc: string;
}

export interface PagedMessages {
  items: DirectMessageItem[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface StartConversationResult {
  conversationId: string;
  created: boolean;
}

export interface ReceiveMessagePayload {
  conversationId: string;
  message: DirectMessageItem;
}

export interface UserSearchResult {
  id: string;
  fullName: string;
  avatarUrl?: string | null;
  department?: string | null;
  universityName?: string | null;
}
