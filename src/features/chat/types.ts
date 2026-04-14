export interface ChatSession {
  sessionId: string;
  startedAtUtc: string;
  endedAtUtc: string | null;
  totalMessages: number;
  isActive: boolean;
}

export interface ChatSessionStartedResponse {
  sessionId: string;
  startedAtUtc: string;
}

export interface ChatMessageItem {
  id: string;
  senderType: "user" | "bot";
  content: string;
  intentDetected: string | null;
  confidence: number | null;
  timestampUtc: string;
}

export interface ChatbotReply {
  content: string;
  intentDetected: string | null;
  confidence: number | null;
}

export interface SendMessageInput {
  sessionId: string;
  message: string;
}
