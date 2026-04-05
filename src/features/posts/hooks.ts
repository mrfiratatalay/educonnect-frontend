import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addPostComment,
  createPost,
  deletePost,
  getBookmarkedPosts,
  getPostDetail,
  getPosts,
  togglePostBookmark,
  togglePostLike,
  trackPostView,
  updatePost,
} from "@/features/posts/api";
import type {
  CreatePostCommentInput,
  CreatePostInput,
  FeedPost,
  GetPostsInput,
  PostDetail,
  PostsPage,
  UpdatePostInput,
} from "@/features/posts/types";
import { useAuthStore } from "@/store/authStore";

export const postKeys = {
  all: ["posts"] as const,
  bookmarksRoot: ["posts", "bookmarks"] as const,
  feed: (pageSize: number) => [...postKeys.all, "feed", pageSize] as const,
  bookmarks: (pageSize: number) => [...postKeys.bookmarksRoot, pageSize] as const,
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

export function useInfiniteBookmarkedPostsQuery(pageSize = 10, enabled = true) {
  return useInfiniteQuery({
    queryKey: postKeys.bookmarks(pageSize),
    queryFn: ({ pageParam }): Promise<PostsPage> =>
      getBookmarkedPosts({ page: Number(pageParam ?? 1), pageSize }),
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
    onMutate: async (input) => {
      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === "posts" &&
          (query.queryKey[1] === "feed" ||
            (query.queryKey[1] === "list" && query.queryKey[2] === 1)),
      });

      const currentUser = useAuthStore.getState().user;
      const optimisticPost: FeedPost = {
        id: `optimistic-${Date.now()}`,
        userId: currentUser?.id ?? "me",
        userName: currentUser?.fullName ?? "Sen",
        avatarUrl: currentUser?.avatarUrl,
        content: input.content,
        imageUrl: input.imagePreviewUrl,
        likesCount: 0,
        commentsCount: 0,
        viewsCount: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date().toISOString(),
      };

      const previousQueries = queryClient.getQueriesData<PostsPage | InfiniteData<PostsPage>>({
        predicate: (query) =>
          query.queryKey[0] === "posts" &&
          (query.queryKey[1] === "feed" ||
            (query.queryKey[1] === "list" && query.queryKey[2] === 1)),
      });

      queryClient.setQueriesData<PostsPage | InfiniteData<PostsPage>>(
        {
          predicate: (query) =>
            query.queryKey[0] === "posts" &&
            (query.queryKey[1] === "feed" ||
              (query.queryKey[1] === "list" && query.queryKey[2] === 1)),
        },
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          if (isInfinitePostsData(oldData)) {
            const [firstPage, ...restPages] = oldData.pages;
            if (!firstPage) {
              return oldData;
            }

            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  items: [optimisticPost, ...firstPage.items],
                  totalCount: firstPage.totalCount + 1,
                },
                ...restPages.map((page) => ({
                  ...page,
                  totalCount: page.totalCount + 1,
                })),
              ],
            };
          }

          return {
            ...oldData,
            items: [optimisticPost, ...oldData.items],
            totalCount: oldData.totalCount + 1,
          };
        },
      );

      return { previousQueries };
    },
    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postKeys.all });
    },
  });
}

function isInfinitePostsData(
  data: PostsPage | InfiniteData<PostsPage> | PostDetail,
): data is InfiniteData<PostsPage> {
  return Boolean(data && typeof data === "object" && "pages" in data);
}

function isPostDetailData(data: unknown): data is PostDetail {
  return Boolean(
    data &&
      typeof data === "object" &&
      "post" in data &&
      "comments" in data,
  );
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

export function useTogglePostBookmarkMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => ({
      postId,
      isBookmarked: await togglePostBookmark(postId),
    }),
    onSuccess: async ({ postId, isBookmarked }) => {
      updatePostAcrossCaches(queryClient, postId, (post) => ({
        ...post,
        isBookmarked,
      }));

      await queryClient.invalidateQueries({
        queryKey: postKeys.bookmarksRoot,
      });
    },
  });
}

export function useTrackPostViewMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => ({
      postId,
      viewsCount: await trackPostView(postId),
    }),
    onSuccess: ({ postId, viewsCount }) => {
      updatePostAcrossCaches(queryClient, postId, (post) => ({
        ...post,
        viewsCount,
      }));
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

function updatePostAcrossCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  postId: string,
  updater: (post: FeedPost) => FeedPost,
) {
  queryClient.setQueriesData<PostsPage | InfiniteData<PostsPage> | PostDetail>(
    {
      predicate: (query) => query.queryKey[0] === "posts",
    },
    (oldData) => {
      if (!oldData) {
        return oldData;
      }

      if (isInfinitePostsData(oldData)) {
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: updatePostList(page.items, postId, updater),
          })),
        };
      }

      if (isPostDetailData(oldData)) {
        if (oldData.post.id !== postId) {
          return oldData;
        }

        return {
          ...oldData,
          post: updater(oldData.post),
        };
      }

      return {
        ...oldData,
        items: updatePostList(oldData.items, postId, updater),
      };
    },
  );
}

function updatePostList(
  posts: FeedPost[],
  postId: string,
  updater: (post: FeedPost) => FeedPost,
) {
  return posts.map((post) => (post.id === postId ? updater(post) : post));
}
