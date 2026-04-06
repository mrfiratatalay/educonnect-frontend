export type AppGroupMemberRole = "member" | "moderator" | "owner";

export interface AppGroupMemberPreview {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  department?: string;
  role: AppGroupMemberRole;
}

export interface AppGroup {
  id: string;
  name: string;
  slug?: string;
  shortDescription?: string;
  description: string;
  avatarUrl?: string;
  bannerUrl?: string;
  category: string;
  creatorUserId: string;
  creatorName: string;
  memberCount: number;
  previewMembers?: AppGroupMemberPreview[];
  isMember: boolean;
  createdAt: string;
}

export interface AppGroupDetail extends AppGroup {
  postCount: number;
  eventCount: number;
  canCurrentUserPost: boolean;
  moderatorPreviewMembers: AppGroupMemberPreview[];
}

export interface CreateGroupInput {
  name: string;
  shortDescription?: string;
  description: string;
  avatarUrl?: string;
  bannerUrl?: string;
  category: string;
}

export interface UpdateGroupInput extends CreateGroupInput {}

export interface DiscoverGroupsInput {
  query?: string;
  limit?: number;
}
