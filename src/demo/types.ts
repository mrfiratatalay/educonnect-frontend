/**
 * In-browser copy of the backend data model. Field names follow the EF Core
 * entities so the mappers can mirror the API responses one to one.
 */

export type DemoUserRole = "student" | "admin" | "moderator";
export type DemoGroupRole = "member" | "moderator" | "owner";
export type DemoProductCondition = "new" | "likeNew" | "good" | "fair";
export type DemoNotificationType = "general" | "social" | "event" | "marketplace" | "system";

export interface DemoUser {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  role: DemoUserRole;
  universityId: string;
  department: string;
  year: number;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  isActive: boolean;
  emailVerified: boolean;
  verification?: {
    code: string;
    expiresAtUtc: string;
    sentAtUtc: string;
    attempts: number;
  };
  createdAtUtc: string;
}

export interface DemoUniversity {
  id: string;
  name: string;
  city: string;
  domain: string;
}

export interface DemoCategory {
  id: string;
  name: string;
}

export interface DemoFollow {
  followerId: string;
  followedId: string;
  createdAtUtc: string;
}

export interface DemoReaction {
  userId: string;
  createdAtUtc: string;
}

export interface DemoComment {
  id: string;
  userId: string;
  content: string;
  createdAtUtc: string;
}

export interface DemoPost {
  id: string;
  userId: string;
  groupId?: string;
  content: string;
  imageUrl?: string;
  isDeleted: boolean;
  likes: DemoReaction[];
  bookmarks: DemoReaction[];
  viewerIds: string[];
  comments: DemoComment[];
  createdAtUtc: string;
}

export interface DemoGroupMember {
  userId: string;
  role: DemoGroupRole;
  joinedAtUtc: string;
}

export interface DemoGroup {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  rules: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  category: string;
  creatorUserId: string;
  isActive: boolean;
  members: DemoGroupMember[];
  createdAtUtc: string;
}

export interface DemoParticipant {
  userId: string;
  status: "registered" | "cancelled";
  registeredAtUtc: string;
}

export interface DemoEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  startDateUtc: string;
  endDateUtc: string;
  creatorUserId: string;
  groupId?: string;
  maxParticipants: number;
  category: string;
  participants: DemoParticipant[];
  createdAtUtc: string;
}

export interface DemoProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId?: string;
  sellerId: string;
  condition: DemoProductCondition;
  isActive: boolean;
  city: string;
  isNegotiable: boolean;
  imageUrls: string[];
  createdAtUtc: string;
}

export interface DemoDiscount {
  id: string;
  businessName: string;
  title: string;
  description: string;
  discountRate: number;
  discountCode: string;
  logoUrl?: string;
  validUntilUtc: string;
  isActive: boolean;
}

export interface DemoNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: DemoNotificationType;
  targetPath?: string;
  createdAtUtc: string;
}

export interface DemoDirectMessage {
  id: string;
  senderUserId: string;
  content: string;
  sentAtUtc: string;
}

export interface DemoConversation {
  id: string;
  userLowerId: string;
  userHigherId: string;
  messages: DemoDirectMessage[];
  lastMessageAtUtc: string;
}

export interface DemoChatMessage {
  id: string;
  senderType: "user" | "bot";
  content: string;
  intentDetected?: string | null;
  confidence?: number | null;
  confidenceBand?: "high" | "medium" | "low" | null;
  needsReview?: boolean;
  modelUsed?: string | null;
  kbScore?: number | null;
  kbHit?: boolean;
  isFallback?: boolean;
  latencyMs?: number | null;
  timestampUtc: string;
}

export interface DemoChatSession {
  id: string;
  userId: string;
  startedAtUtc: string;
  endedAtUtc?: string;
  messages: DemoChatMessage[];
}

export interface DemoDb {
  version: number;
  /** Reference "now" of the stored data; shifting dates moves it forward too. */
  anchorAtUtc: string;
  sessionUserId: string | null;
  universities: DemoUniversity[];
  categories: DemoCategory[];
  users: DemoUser[];
  follows: DemoFollow[];
  groups: DemoGroup[];
  posts: DemoPost[];
  events: DemoEvent[];
  products: DemoProduct[];
  discounts: DemoDiscount[];
  notifications: DemoNotification[];
  conversations: DemoConversation[];
  chatSessions: DemoChatSession[];
}
