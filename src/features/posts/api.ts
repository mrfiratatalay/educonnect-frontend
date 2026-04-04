import axios from "axios";
import { getApiErrorMessage } from "@/features/auth/api";
import { getAccessToken } from "@/features/auth/token";
import type {
  CreatePostInput,
  CreatePostCommentInput,
  FeedPost,
  GetPostsInput,
  PostComment,
  PostDetail,
  PostsPage,
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
  userName: string;
  avatarUrl?: string | null;
  content: string;
  imageUrl?: string | null;
  likesCount: number;
  commentsCount: number;
  likedByCurrentUser: boolean;
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

export async function getPosts(input: GetPostsInput = {}): Promise<PostsPage> {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  try {
    const response = await postsApi.get<ApiPagedResponse<ApiPostResponse>>(
      "/api/posts",
      {
        ...getAuthorizedConfig(),
        params: { page, pageSize },
      },
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
    const response = await postsApi.get<ApiPostDetailResponse>(
      `/api/posts/${postId}`,
      getAuthorizedConfig(),
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
    const response = await postsApi.post<ApiPostResponse>(
      "/api/posts",
      input,
      getAuthorizedConfig(),
    );

    return normalizePost(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function updatePost(input: UpdatePostInput): Promise<FeedPost> {
  try {
    const response = await postsApi.put<ApiPostResponse>(
      `/api/posts/${input.postId}`,
      {
        content: input.content,
        imageUrl: input.imageUrl,
      },
      getAuthorizedConfig(),
    );

    return normalizePost(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function togglePostLike(postId: string) {
  try {
    await postsApi.post(
      `/api/posts/${postId}/like`,
      undefined,
      getAuthorizedConfig(),
    );
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function addPostComment(input: CreatePostCommentInput): Promise<PostComment> {
  try {
    const response = await postsApi.post<ApiPostCommentResponse>(
      `/api/posts/${input.postId}/comments`,
      { content: input.content },
      getAuthorizedConfig(),
    );

    return normalizeComment(response.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

export async function deletePost(postId: string) {
  try {
    await postsApi.delete(`/api/posts/${postId}`, getAuthorizedConfig());
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
}

function getAuthorizedConfig() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    throw new Error("Oturum bulunamadi. Lutfen yeniden giris yapin.");
  }

  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

function normalizePost(post: ApiPostResponse): FeedPost {
  return {
    id: post.id,
    userId: post.userId,
    userName: post.userName,
    avatarUrl: post.avatarUrl || undefined,
    content: post.content,
    imageUrl: post.imageUrl || undefined,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    isLiked: post.likedByCurrentUser,
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
