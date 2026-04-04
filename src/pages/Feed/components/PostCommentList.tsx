import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostComment } from "@/features/posts/types";
import { formatPostTime } from "@/features/posts/utils";

interface PostCommentListProps {
  comments: PostComment[];
}

export default function PostCommentList({
  comments,
}: PostCommentListProps) {
  const navigate = useNavigate();

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Henuz yorum yok. Ilk yorumu sen yaz.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <Avatar
            className="w-8 h-8 shrink-0 cursor-pointer"
            onClick={() => navigate(`/profile/${comment.userId}`)}
          >
            <AvatarImage src={comment.avatarUrl} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {comment.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 rounded-xl bg-secondary/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs font-semibold hover:underline"
                onClick={() => navigate(`/profile/${comment.userId}`)}
              >
                {comment.userName}
              </button>
              <span className="text-[11px] text-muted-foreground">
                {formatPostTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-foreground/85">
              {comment.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
