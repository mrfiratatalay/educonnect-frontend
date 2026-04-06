import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  AppGroup,
  AppGroupDetail,
  AppGroupMemberPreview,
  CreateGroupInput,
  DiscoverGroupsInput,
  UpdateGroupInput,
} from "@/features/groups/types";
import type { FeedPost, GetPostsInput, PostsPage } from "@/features/posts/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const groupsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

interface ApiGroupResponse {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  avatarUrl?: string | null;
  bannerUrl?: string | null;
  category: string;
  creatorUserId: string;
  creatorName: string;
  memberCount: number;
  previewMembers: ApiGroupMemberPreviewResponse[];
  joinedByCurrentUser: boolean;
  createdAtUtc: string;
}

interface ApiGroupMemberPreviewResponse {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  department?: string | null;
  role: "member" | "moderator" | "owner";
}

interface ApiGroupDetailResponse extends ApiGroupResponse {
  postCount: number;
  eventCount: number;
  canCurrentUserPost: boolean;
  moderatorPreviewMembers: ApiGroupMemberPreviewResponse[];
}

interface ApiPostResponse {
  id: string;
  userId: string;
  groupId?: string | null;
  groupName?: string | null;
  groupSlug?: string | null;
  groupAvatarUrl?: string | null;
  userName: string;
  avatarUrl?: string | null;
  content: string;
  imageUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  likedByCurrentUser: boolean;
  bookmarkedByCurrentUser: boolean;
  createdAtUtc: string;
}

interface ApiPagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export async function getGroups(): Promise<AppGroup[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiGroupResponse[]>(
        "/api/groups",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data.map(normalizeGroup);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getGroup(groupId: string): Promise<AppGroup> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiGroupDetailResponse>(
        `/api/groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeGroup(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getGroupBySlug(slug: string): Promise<AppGroupDetail> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiGroupDetailResponse>(
        `/api/groups/slug/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeGroupDetail(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createGroup(input: CreateGroupInput): Promise<AppGroup> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.post<ApiGroupResponse>(
        "/api/groups",
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeGroup(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updateGroup(groupId: string, input: UpdateGroupInput): Promise<AppGroupDetail> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.put<ApiGroupDetailResponse>(
        `/api/groups/${groupId}`,
        input,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeGroupDetail(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getJoinedGroups(limit = 12): Promise<AppGroup[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiGroupResponse[]>(
        "/api/groups/joined",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { limit },
        },
      ),
    );

    return response.data.map(normalizeGroup);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getDiscoverGroups(input: DiscoverGroupsInput = {}): Promise<AppGroup[]> {
  const limit = input.limit ?? 12;
  const query = input.query?.trim();

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiGroupResponse[]>(
        "/api/groups/discover",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            limit,
            query: query || undefined,
          },
        },
      ),
    );

    return response.data.map(normalizeGroup);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function joinGroup(groupId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      groupsApi.post(
        `/api/groups/${groupId}/join`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function leaveGroup(groupId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      groupsApi.delete(`/api/groups/${groupId}/leave`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getGroupPosts(
  groupId: string,
  input: GetPostsInput = {},
): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiPagedResponse<ApiPostResponse>>(
        `/api/groups/${groupId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return normalizePostsPage(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getJoinedGroupsFeed(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      groupsApi.get<ApiPagedResponse<ApiPostResponse>>(
        "/api/groups/feed",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return normalizePostsPage(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function normalizeGroup(group: ApiGroupResponse): AppGroup {
  return {
    id: group.id,
    name: group.name,
    slug: group.slug,
    shortDescription: group.shortDescription,
    description: group.description,
    avatarUrl: group.avatarUrl || undefined,
    bannerUrl: group.bannerUrl || undefined,
    category: group.category,
    creatorUserId: group.creatorUserId,
    creatorName: group.creatorName,
    memberCount: group.memberCount,
    previewMembers: group.previewMembers.map(normalizePreviewMember),
    isMember: group.joinedByCurrentUser,
    createdAt: group.createdAtUtc,
  };
}

function normalizeGroupDetail(group: ApiGroupDetailResponse): AppGroupDetail {
  return {
    ...normalizeGroup(group),
    postCount: group.postCount,
    eventCount: group.eventCount,
    canCurrentUserPost: group.canCurrentUserPost,
    moderatorPreviewMembers: group.moderatorPreviewMembers.map(normalizePreviewMember),
  };
}

function normalizePreviewMember(member: ApiGroupMemberPreviewResponse): AppGroupMemberPreview {
  return {
    userId: member.userId,
    fullName: member.fullName,
    avatarUrl: member.avatarUrl || undefined,
    department: member.department || undefined,
    role: member.role,
  };
}

function normalizePostsPage(page: ApiPagedResponse<ApiPostResponse>): PostsPage {
  return {
    items: page.items.map(normalizePost),
    page: page.page,
    pageSize: page.pageSize,
    totalCount: page.totalCount,
  };
}

function normalizePost(post: ApiPostResponse): FeedPost {
  return {
    id: post.id,
    userId: post.userId,
    groupId: post.groupId || undefined,
    groupName: post.groupName || undefined,
    groupSlug: post.groupSlug || undefined,
    groupAvatarUrl: post.groupAvatarUrl || undefined,
    userName: post.userName,
    avatarUrl: post.avatarUrl || undefined,
    content: post.content,
    imageUrl: post.imageUrl || undefined,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    viewsCount: post.viewsCount,
    isLiked: post.likedByCurrentUser,
    isBookmarked: post.bookmarkedByCurrentUser,
    createdAt: post.createdAtUtc,
  };
}
