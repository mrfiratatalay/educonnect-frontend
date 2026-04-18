import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { executeAuthorizedRequest } from "@/features/auth/authenticatedRequest";
import type {
  CreatePostInput,
  CreatePostCommentInput,
  FeedPost,
  GetTagPostsInput,
  GetPostsInput,
  PostComment,
  PostDetail,
  PostsPage,
  TrendingHashtag,
  UpdatePostInput,
} from "@/features/posts/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

const postsApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

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
  recommendationReason?: string | null;
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

interface ApiPostCommentResponse {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string | null;
  content: string;
  createdAtUtc: string;
}

interface ApiPostDetailResponse {
  post: ApiPostResponse;
  comments: ApiPostCommentResponse[];
}

interface ApiPostBookmarkStateResponse {
  isBookmarked: boolean;
}

interface ApiPostViewTrackingResponse {
  viewsCount: number;
}

interface ApiPostTrendingHashtagResponse {
  contextLabel: string;
  hashtag: string;
  postCount: number;
  uniqueAuthorCount: number;
}

export async function getPosts(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>(
        "/api/posts",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return {
      items: response.data.items.map(normalizePost),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getForYouPosts(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>(
        "/api/posts/for-you",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return {
      items: response.data.items.map(normalizePost),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getFollowingPosts(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>(
        "/api/posts/following",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return {
      items: response.data.items.map(normalizePost),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getPostsByTag(input: GetTagPostsInput): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  const tag = input.tag.trim();

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>(
        `/api/posts/tags/${encodeURIComponent(tag)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return {
      items: response.data.items.map(normalizePost),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getTrendingHashtags(limit = 4): Promise<TrendingHashtag[]> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPostTrendingHashtagResponse[]>(
        "/api/posts/trending",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { limit },
        },
      ),
    );

    return response.data.map((trend) => ({
      contextLabel: trend.contextLabel,
      hashtag: trend.hashtag,
      postCount: trend.postCount,
      uniqueAuthorCount: trend.uniqueAuthorCount,
    }));
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getBookmarkedPosts(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>(
        "/api/posts/bookmarks",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: { page, pageSize },
        },
      ),
    );

    return {
      items: response.data.items.map(normalizePost),
      page: response.data.page,
      pageSize: response.data.pageSize,
      totalCount: response.data.totalCount,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getPostDetail(postId: string): Promise<PostDetail> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPostDetailResponse>(
        `/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return {
      post: normalizePost(response.data.post),
      comments: response.data.comments.map(normalizeComment),
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function createPost(input: CreatePostInput): Promise<FeedPost> {
  try {
    const formData = new FormData();
    formData.append("content", input.content);

    if (input.groupId) {
      formData.append("groupId", input.groupId);
    }

    if (input.imageFile) {
      formData.append("image", input.imageFile);
    }

    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.post<ApiPostResponse>(
        "/api/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizePost(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updatePost(input: UpdatePostInput): Promise<FeedPost> {
  try {
    const formData = new FormData();
    formData.append("content", input.content);

    if (input.removeImage) {
      formData.append("removeImage", "true");
    } else if (input.imageFile) {
      formData.append("image", input.imageFile);
    }

    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.put<ApiPostResponse>(
        `/api/posts/${input.postId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizePost(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function togglePostLike(postId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      postsApi.post(
        `/api/posts/${postId}/like`,
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

export async function togglePostBookmark(postId: string): Promise<boolean> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.post<ApiPostBookmarkStateResponse>(
        `/api/posts/${postId}/bookmark`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data.isBookmarked;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function trackPostView(postId: string): Promise<number> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.post<ApiPostViewTrackingResponse>(
        `/api/posts/${postId}/view`,
        undefined,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return response.data.viewsCount;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function addPostComment(input: CreatePostCommentInput): Promise<PostComment> {
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.post<ApiPostCommentResponse>(
        `/api/posts/${input.postId}/comments`,
        { content: input.content },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return normalizeComment(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function getUserPosts(userId: string, input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>("/api/posts", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, page, pageSize },
      }),
    );
    return { items: response.data.items.map(normalizePost), page: response.data.page, pageSize: response.data.pageSize, totalCount: response.data.totalCount };
  } catch (error) { throw new Error(getApiErrorMessage(error)); }
}

export async function getUserMediaPosts(userId: string, input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>("/api/posts", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, mediaOnly: true, page, pageSize },
      }),
    );
    return { items: response.data.items.map(normalizePost), page: response.data.page, pageSize: response.data.pageSize, totalCount: response.data.totalCount };
  } catch (error) { throw new Error(getApiErrorMessage(error)); }
}

export async function getLikedPosts(userId: string, input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;
  try {
    const response = await executeAuthorizedRequest((accessToken) =>
      postsApi.get<ApiPagedResponse<ApiPostResponse>>("/api/posts/liked", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { userId, page, pageSize },
      }),
    );
    return { items: response.data.items.map(normalizePost), page: response.data.page, pageSize: response.data.pageSize, totalCount: response.data.totalCount };
  } catch (error) { throw new Error(getApiErrorMessage(error)); }
}

export async function deletePost(postId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      postsApi.delete(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deletePostComment(postId: string, commentId: string) {
  try {
    await executeAuthorizedRequest((accessToken) =>
      postsApi.delete(`/api/posts/${postId}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
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
    recommendationReason: post.recommendationReason || undefined,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    viewsCount: post.viewsCount,
    isLiked: post.likedByCurrentUser,
    isBookmarked: post.bookmarkedByCurrentUser,
    createdAt: post.createdAtUtc,
  };
}

function normalizeComment(comment: ApiPostCommentResponse): PostComment {
  return {
    id: comment.id,
    userId: comment.userId,
    userName: comment.userName,
    avatarUrl: comment.avatarUrl || undefined,
    content: comment.content,
    createdAt: comment.createdAtUtc,
  };
}
