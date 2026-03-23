import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImagePlus,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { mockPosts } from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

function PostCard({ post }: { post: Post }) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}dk`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}sa`;
    const days = Math.floor(hours / 24);
    return `${days}g`;
  };

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>{post.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-sm">{post.userName}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  {timeAgo(post.createdAt)}
                </span>
              </div>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm mt-2 leading-relaxed">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt=""
                className="w-full rounded-xl mt-3 object-cover max-h-80"
              />
            )}
            <div className="flex items-center gap-1 mt-3 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={cn(
                  "gap-1.5 text-xs",
                  liked && "text-red-500 hover:text-red-600",
                )}
              >
                <Heart
                  className={cn("w-4 h-4", liked && "fill-current")}
                />
                {likesCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <MessageCircle className="w-4 h-4" />
                {post.commentsCount}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Share2 className="w-4 h-4" />
                Paylaş
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function FeedPage() {
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState("");

  const handlePost = () => {
    if (!newPost.trim()) return;
    setNewPost("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8 space-y-4">
      <h1 className="text-2xl font-bold mb-2">Feed</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-10 h-10 shrink-0">
              <AvatarImage src={user?.avatarUrl} />
              <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="Ne düşünüyorsun?"
                rows={3}
                className="w-full resize-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
              />
              <Separator className="my-2" />
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
                  <ImagePlus className="w-4 h-4" />
                  Fotoğraf
                </Button>
                <Button size="sm" onClick={handlePost} disabled={!newPost.trim()} className="gap-1.5">
                  <Send className="w-3 h-3" />
                  Paylaş
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
