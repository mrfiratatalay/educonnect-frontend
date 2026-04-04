import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useInfinitePostsQuery,
  useUpdatePostMutation,
} from "@/features/posts/hooks";
import FeedSidebar from "@/pages/Feed/components/FeedSidebar";
import PostComposer from "@/pages/Feed/components/PostComposer";
import PostList from "@/pages/Feed/components/PostList";

export default function FeedPage() {
  const user = useAuthStore((state) => state.user);
  const postsQuery = useInfinitePostsQuery(10);
  const createPostMutation = useCreatePostMutation();
  const deletePostMutation = useDeletePostMutation();
  const updatePostMutation = useUpdatePostMutation();

  const posts = postsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = postsQuery.data?.pages[0]?.totalCount ?? 0;
  const errorMessage =
    postsQuery.error instanceof Error ? postsQuery.error.message : undefined;
  const deletingPostId =
    deletePostMutation.isPending && typeof deletePostMutation.variables === "string"
      ? deletePostMutation.variables
      : undefined;
  const updatingPostId =
    updatePostMutation.isPending ? updatePostMutation.variables?.postId : undefined;

  async function handleCreatePost(content: string) {
    await createPostMutation.mutateAsync({ content });
  }

  async function handleUpdatePost(postId: string, content: string) {
    await updatePostMutation.mutateAsync({ postId, content });
  }

  function handleDeletePost(postId: string) {
    void deletePostMutation.mutateAsync(postId);
  }

  return (
    <div className="p-4 lg:p-6 xl:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Feed</h1>
          <p className="text-sm text-muted-foreground">
            Gercek veriden akan kampus paylasimlari burada listelenir.
          </p>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 min-w-0 max-w-2xl space-y-4">
            <PostComposer
              avatarUrl={user?.avatarUrl}
              fullName={user?.fullName}
              isSubmitting={createPostMutation.isPending}
              onSubmit={handleCreatePost}
            />

            <PostList
              posts={posts}
              currentUserId={user?.id}
              currentUserRole={user?.role}
              deletingPostId={deletingPostId}
              updatingPostId={updatingPostId}
              errorMessage={errorMessage}
              isLoading={postsQuery.isLoading}
              onDelete={handleDeletePost}
              onUpdate={handleUpdatePost}
            />

            {postsQuery.hasNextPage && (
              <div className="flex justify-center py-2">
                <Button
                  variant="outline"
                  onClick={() => void postsQuery.fetchNextPage()}
                  disabled={postsQuery.isFetchingNextPage}
                >
                  {postsQuery.isFetchingNextPage ? "Yukleniyor" : "Daha Fazla Yukle"}
                </Button>
              </div>
            )}

            {posts.length > 0 && !postsQuery.hasNextPage && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Gosterilen gonderiler tamamlandi.
              </p>
            )}
          </div>

          <aside className="hidden xl:block w-72 2xl:w-80 shrink-0">
            <div className="sticky top-6">
              <FeedSidebar posts={posts} totalCount={totalCount} user={user} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
