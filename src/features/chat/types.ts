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

export type ConfidenceBand = "high" | "medium" | "low";

export interface ChatMessageItem {
  id: string;
  senderType: "user" | "bot";
  content: string;
  intentDetected: string | null;
  confidence: number | null;
  confidenceBand?: ConfidenceBand | null;
  needsReview?: boolean;
  modelUsed?: string | null;
  kbScore?: number | null;
  kbHit?: boolean;
  isFallback?: boolean;
  latencyMs?: number | null;
  hasFeedback?: boolean | null;
  feedbackIsHelpful?: boolean | null;
  timestampUtc: string;
}

export interface ChatbotReply {
  content: string;
  intentDetected: string | null;
  confidence: number | null;
  confidenceBand?: ConfidenceBand | null;
  needsReview?: boolean;
  modelUsed?: string | null;
  kbScore?: number | null;
  kbHit?: boolean;
  isFallback?: boolean;
  latencyMs?: number | null;
}

export interface SendMessageInput {
  sessionId: string;
  message: string;
}
