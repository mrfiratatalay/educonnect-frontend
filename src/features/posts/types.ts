export interface FeedPost {
  id: string;
  userId: string;
  groupId?: string;
  groupName?: string;
  groupSlug?: string;
  groupAvatarUrl?: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface PostDetail {
  post: FeedPost;
  comments: PostComment[];
}

export interface PostsPage {
  items: FeedPost[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface GetPostsInput {
  page?: number;
  pageSize?: number;
}

export interface CreatePostInput {
  content: string;
  groupId?: string;
  imageFile?: File | null;
  imagePreviewUrl?: string;
}

export interface UpdatePostInput {
  postId: string;
  content: string;
  imageUrl?: string;
}

export interface CreatePostCommentInput {
  postId: string;
  content: string;
}
