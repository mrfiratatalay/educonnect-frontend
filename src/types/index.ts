export type UserRole = "student" | "admin" | "moderator";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  universityId?: string;
  universityName?: string;
  createdAt?: string;
  isActive?: boolean;
  avatarUrl?: string;
  department?: string;
  year?: number;
  bio?: string;
  interests?: string[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  postType: "general" | "material" | "question" | "announcement";
  universityId?: string;
  universityName?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  creatorName: string;
  imageUrl?: string;
  isMember: boolean;
  privacy?: "open" | "closed";
  universityId?: string;
  universityName?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  creatorName: string;
  groupName?: string;
  maxParticipants: number;
  currentParticipants: number;
  isRegistered: boolean;
  imageUrl?: string;
  universityId?: string;
  universityName?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  sellerName: string;
  sellerAvatar?: string;
  condition: "new" | "like-new" | "good" | "fair";
  isActive: boolean;
  createdAt: string;
}

export interface Discount {
  id: string;
  businessName: string;
  title: string;
  description: string;
  discountRate: number;
  validUntil: string;
  isActive: boolean;
  logoUrl?: string;
  code?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderType: "user" | "bot";
  content: string;
  timestamp: string;
  intentDetected?: string;
  confidence?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: "info" | "event" | "social" | "discount" | "system";
  createdAt: string;
  link?: string;
}

export interface VisualSearchResult {
  productId: string;
  product: Product;
  similarityScore: number;
  rank: number;
}

export interface Feedback {
  featureArea: string;
  rating: number;
  comment: string;
}
