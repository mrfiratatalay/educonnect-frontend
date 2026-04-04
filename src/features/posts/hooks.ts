import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addPostComment,
  createPost,
  deletePost,
  getPostDetail,
  getPosts,
  togglePostLike,
  updatePost,
} from "@/features/posts/api";
import type {
  CreatePostCommentInput,
  CreatePostInput,
  GetPostsInput,
  PostDetail,
  PostsPage,
  UpdatePostInput,
} from "@/features/posts/types";

export const postKeys = {
  all: ["posts"] as const,
  feed: (pageSize: number) => [...postKeys.all, "feed", pageSize] as const,
  list: (page: number, pageSize: number) =>
    [...postKeys.all, "list", page, pageSize] as const,
  detail: (postId: string) => [...postKeys.all, "detail", postId] as const,
};

export function useInfinitePostsQuery(pageSize = 10, enabled = true) {
  return useInfiniteQuery({
    queryKey: postKeys.feed(pageSize),
    queryFn: ({ pageParam }): Promise<PostsPage> =>
      getPosts({ page: Number(pageParam ?? 1), pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const loadedCount = pages.reduce(
        (count, page) => count + page.items.length,
        0,
      );

      return loadedCount >= lastPage.totalCount ? undefined : pages.length + 1;
    },
    enabled,
  });
}

export function usePostsQuery(input: GetPostsInput = {}, enabled = true) {
  const page = input.page ?? 1;
  const pageSize = input.pageSize ?? 20;

  return useQuery({
    queryKey: postKeys.list(page, pageSize),
    queryFn: (): Promise<PostsPage> => getPosts({ page, pageSize }),
    enabled,
  });
}

export function usePostDetailQuery(postId?: string, enabled = true) {
  return useQuery({
    queryKey: postId ? postKeys.detail(postId) : [...postKeys.all, "detail"],
    queryFn: (): Promise<PostDetail> => getPostDetail(postId!),
    enabled: enabled && Boolean(postId),
  });
}

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostInput) => createPost(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdatePostInput) => updatePost(input),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        }),
      ]);
    },
  });
}

export function useTogglePostLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => togglePostLike(postId),
    onSuccess: async (_, postId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({ queryKey: postKeys.detail(postId) }),
      ]);
    },
  });
}

export function useAddPostCommentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePostCommentInput) => addPostComment(input),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: postKeys.all }),
        queryClient.invalidateQueries({
          queryKey: postKeys.detail(variables.postId),
        }),
      ]);
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}
