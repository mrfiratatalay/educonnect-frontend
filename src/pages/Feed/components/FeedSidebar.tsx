import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { FeedPost } from "@/features/posts/types";
import { getPostExcerpt } from "@/features/posts/utils";
import type { User } from "@/types";

interface FeedSidebarProps {
  posts: FeedPost[];
  totalCount: number;
  user: User | null;
}

export default function FeedSidebar({
  posts,
  totalCount,
  user,
}: FeedSidebarProps) {
  const trendingPosts = [...posts]
    .sort((left, right) => {
      const leftScore = left.likesCount + left.commentsCount;
      const rightScore = right.likesCount + right.commentsCount;
      return rightScore - leftScore;
    })
    .slice(0, 3);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-primary/80 to-primary" />
        <CardContent className="px-4 pb-4 -mt-6">
          <Avatar className="w-12 h-12 ring-4 ring-card">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user?.fullName?.charAt(0) ?? "K"}
            </AvatarFallback>
          </Avatar>

          <div className="mt-2">
            <p className="font-semibold text-sm">{user?.fullName ?? "Kullanici"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.department || user?.universityName || "Topluluga bagli"}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-lg bg-secondary/40 px-3 py-2">
              <p className="text-sm font-bold">{totalCount}</p>
              <p className="text-[10px] text-muted-foreground">Toplam Gonderi</p>
            </div>
            <div className="rounded-lg bg-secondary/40 px-3 py-2">
              <p className="text-sm font-bold">{posts.length}</p>
              <p className="text-[10px] text-muted-foreground">Bu Sayfa</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Gundem Olan Paylasimlar
          </h3>

          {trendingPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Feed doldukca burada en cok etkilesim alan paylasimlar gorunecek.
            </p>
          ) : (
            trendingPosts.map((post) => (
              <div key={post.id} className="space-y-1 rounded-lg bg-secondary/40 p-3">
                <p className="text-sm font-medium leading-snug">
                  {getPostExcerpt(post.content, 90)}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
