import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  ImagePlus,
  Send,
  Bookmark,
  Flag,
  Trash2,
  TrendingUp,
  Paperclip,
  FileText,
  HelpCircle,
  Megaphone,
  X,
  ChevronDown,
  ChevronUp,
  Building2,
  GraduationCap,
  Flame,
  Sparkles,
  Tag,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import {
  mockPosts,
  mockGroups,
  mockComments,
  otherUniversityPosts,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Post, Comment } from "@/types";

type ScopeFilter = "campus" | "national";

const postTypeConfig = {
  question: { label: "Soru", icon: HelpCircle, color: "text-amber-600", border: "border-amber-500/30" },
  material: { label: "Materyal", icon: FileText, color: "text-blue-600", border: "border-blue-500/30" },
  announcement: { label: "Duyuru", icon: Megaphone, color: "text-emerald-600", border: "border-emerald-500/30" },
  general: { label: "Genel", icon: MessageCircle, color: "text-muted-foreground", border: "border-border" },
} as const;

function detectPostType(content: string, hasAttachment: boolean): Post["postType"] {
  const lower = content.toLowerCase();
  const questionKeywords = ["bilen var mı", "nasıl", "nedir", "ne zaman", "nerede", "hangi", "yardım", "öneri"];
  if (lower.includes("?") && questionKeywords.some((k) => lower.includes(k))) return "question";
  if (lower.includes("?") && lower.length < 200) return "question";
  if (hasAttachment) return "material";
  const announcementKeywords = ["duyuru", "kapalı", "iptal", "son tarih", "dikkat", "açıklama", "bilgilendirme", "uyarı", "değişiklik"];
  if (announcementKeywords.some((k) => lower.includes(k))) return "announcement";
  return "general";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return "az önce";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins}dk`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}sa`;
  const days = Math.floor(hours / 24);
  return `${days}g`;
}

function PostCard({
  post,
  onDelete,
  comments,
  onAddComment,
  showUniBadge,
}: {
  post: Post;
  onDelete?: (id: string) => void;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
  showUniBadge?: boolean;
}) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [saved, setSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((c) => (liked ? c - 1 : c + 1));
  };

  const isOwn = post.userId === user?.id;
  const typeConfig = postTypeConfig[post.postType];

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput("");
  };

  return (
    <Card className="border border-border/60 rounded-xl hover:shadow-md transition-shadow">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar
            className="w-10 h-10 shrink-0 ring-2 ring-background cursor-pointer"
            onClick={() => navigate(`/profile/${post.userId}`)}
          >
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {post.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="font-semibold text-sm hover:underline cursor-pointer"
                  onClick={() => navigate(`/profile/${post.userId}`)}
                >
                  {post.userName}
                </span>
                {post.postType !== "general" && (
                  <Badge
                    variant="outline"
                    className={cn("text-[10px] gap-1", typeConfig.color, typeConfig.border)}
                  >
                    <typeConfig.icon className="w-3 h-3" />
                    {typeConfig.label}
                  </Badge>
                )}
                {showUniBadge && post.universityName && (
                  <Badge variant="outline" className="text-[10px] gap-1 border-blue-500/30 text-blue-600">
                    <GraduationCap className="w-3 h-3" />
                    {post.universityName}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  · {timeAgo(post.createdAt)}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-muted-foreground hover:text-foreground"
                    aria-label="Gönderi seçenekleri"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSaved(!saved)} className="gap-2">
                    <Bookmark className={cn("w-4 h-4", saved && "fill-current")} />
                    {saved ? "Kaydı Kaldır" : "Kaydet"}
                  </DropdownMenuItem>
                  {isOwn && onDelete && (
                    <DropdownMenuItem onClick={() => onDelete(post.id)} className="gap-2 text-destructive">
                      <Trash2 className="w-4 h-4" />Sil
                    </DropdownMenuItem>
                  )}
                  {!isOwn && (
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Flag className="w-4 h-4" />Bildir
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-sm mt-2 leading-relaxed text-foreground/90">
              {post.content}
            </p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Gönderi görseli"
                className="w-full rounded-xl mt-3 object-cover max-h-96 border border-border/50"
              />
            )}
            {post.attachmentName && (
              <div className="flex items-center gap-2 mt-3 px-3 py-2 rounded-lg bg-secondary/60 border border-border/50 w-fit">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground/80 truncate max-w-[200px]">
                  {post.attachmentName}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 mt-3 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLike}
                className={cn(
                  "gap-1.5 text-xs text-muted-foreground hover:text-red-500",
                  liked && "text-red-500 hover:text-red-600",
                )}
              >
                <Heart className={cn("w-4 h-4", liked && "fill-current")} />
                {likesCount}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-1.5 text-xs text-muted-foreground hover:text-primary",
                  showComments && "text-primary",
                )}
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4" />
                {comments.length}
                {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground hover:text-primary">
                <Share2 className="w-4 h-4" />Paylaş
              </Button>
            </div>

            {showComments && (
              <div className="mt-3 space-y-3">
                <Separator />
                {comments.length > 0 && (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto scrollbar-hide">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5">
                        <Avatar
                          className="w-7 h-7 shrink-0 cursor-pointer"
                          onClick={() => navigate(`/profile/${comment.userId}`)}
                        >
                          <AvatarImage src={comment.userAvatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {comment.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-secondary/50 rounded-xl px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs font-semibold hover:underline cursor-pointer"
                              onClick={() => navigate(`/profile/${comment.userId}`)}
                            >
                              {comment.userName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{timeAgo(comment.createdAt)}</span>
                          </div>
                          <p className="text-xs mt-0.5 text-foreground/80 leading-relaxed">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Avatar className="w-7 h-7 shrink-0">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex items-center gap-1.5">
                    <Input
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                      placeholder="Yorum yaz..."
                      className="h-8 text-xs bg-secondary/50 border-0 focus-visible:ring-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 shrink-0"
                      onClick={handleSubmitComment}
                      disabled={!commentInput.trim()}
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeedSidebar({ posts }: { posts: Post[] }) {
  const { user } = useAuthStore();

  const trending = useMemo(
    () =>
      [...posts]
        .sort((a, b) => (b.likesCount + b.commentsCount) - (a.likesCount + a.commentsCount))
        .slice(0, 4),
    [posts],
  );

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-14 bg-gradient-to-r from-primary/80 to-primary" />
        <CardContent className="px-4 pb-4 -mt-6">
          <Avatar className="w-12 h-12 ring-4 ring-card">
            <AvatarImage src={user?.avatarUrl} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user?.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="mt-2">
            <p className="font-semibold text-sm">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.department}</p>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-3 text-center gap-2">
            <div>
              <p className="text-sm font-bold">
                {mockPosts.filter((p) => p.userId === user?.id).length}
              </p>
              <p className="text-[10px] text-muted-foreground">Gönderi</p>
            </div>
            <div>
              <p className="text-sm font-bold">
                {mockGroups.filter((g) => g.isMember).length}
              </p>
              <p className="text-[10px] text-muted-foreground">Grup</p>
            </div>
            <div>
              <p className="text-sm font-bold">24</p>
              <p className="text-[10px] text-muted-foreground">Bağlantı</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Kampüste Gündem
            </h3>
          </div>
          <div className="space-y-2.5">
            {trending.map((post, i) => (
              <div key={post.id} className="flex items-start gap-2.5">
                <span className="text-xs font-bold text-muted-foreground/60 mt-0.5 w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 leading-snug">{post.content}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" />{post.likesCount}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" />{post.commentsCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-[11px] text-muted-foreground/50 text-center px-4">
        EduConnect © 2026 · Tüm hakları saklıdır.
      </p>
    </div>
  );
}

export default function FeedPage() {
  const { user } = useAuthStore();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scope, setScope] = useState<ScopeFilter>("campus");
  const [manualPostType, setManualPostType] = useState<Post["postType"] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const detectedType = useMemo(
    () => detectPostType(newPost, !!attachmentName),
    [newPost, attachmentName],
  );
  const activePostType = manualPostType ?? detectedType;
  const activeTypeConfig = postTypeConfig[activePostType];

  const feedPosts = useMemo(
    () => scope === "campus" ? posts : [...posts, ...otherUniversityPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    [posts, scope],
  );

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post: Post = {
      id: `p-${Date.now()}`,
      userId: user?.id || "u1",
      userName: user?.fullName || "Kullanıcı",
      userAvatar: user?.avatarUrl,
      content: newPost.trim(),
      imageUrl: previewImage || undefined,
      attachmentName: attachmentName || undefined,
      postType: activePostType,
      universityId: "rteu",
      universityName: "RTEÜ",
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
    setPosts([post, ...posts]);
    setNewPost("");
    setAttachmentName(null);
    setPreviewImage(null);
    setManualPostType(null);
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addComment = (postId: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      postId,
      userId: user?.id || "u1",
      userName: user?.fullName || "Kullanıcı",
      userAvatar: user?.avatarUrl,
      content,
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p,
      ),
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAttachmentName(file.name);
    e.target.value = "";
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const getPostComments = (postId: string) =>
    comments.filter((c) => c.postId === postId);

  return (
    <div className="p-4 lg:p-6 xl:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          {/* Main Feed Column */}
          <div className="flex-1 min-w-0 max-w-2xl space-y-4">
            {/* Scope Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-lg w-fit">
              <button
                onClick={() => setScope("campus")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                  scope === "campus"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Building2 className="w-3.5 h-3.5" />
                RTEÜ
              </button>
              <button
                onClick={() => setScope("national")}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
                  scope === "national"
                    ? "bg-background shadow-sm text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Tüm Üniversiteler
              </button>
            </div>

            {/* Post Composer */}
            <Card className="border border-border/60 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => { setNewPost(e.target.value); setManualPostType(null); }}
                      placeholder="Ne düşünüyorsun?"
                      rows={2}
                      className="w-full resize-none bg-secondary/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-secondary/80 transition-all"
                    />

                    {/* Auto-detected type badge */}
                    {newPost.trim() && activePostType !== "general" && (
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className={cn("text-[11px] gap-1", activeTypeConfig.color, activeTypeConfig.border)}>
                          <Sparkles className="w-3 h-3" />
                          <activeTypeConfig.icon className="w-3 h-3" />
                          {activeTypeConfig.label} olarak algılandı
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer">
                              Değiştir
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start">
                            {(Object.entries(postTypeConfig) as [Post["postType"], typeof postTypeConfig.general][]).map(([key, cfg]) => (
                              <DropdownMenuItem
                                key={key}
                                onClick={() => setManualPostType(key)}
                                className={cn("gap-2 text-xs", activePostType === key && "font-semibold")}
                              >
                                <cfg.icon className={cn("w-3.5 h-3.5", cfg.color)} />
                                {cfg.label}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <button
                          onClick={() => setManualPostType("general")}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {attachmentName && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-secondary/60 border w-fit">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs truncate max-w-[180px]">{attachmentName}</span>
                        <button
                          onClick={() => setAttachmentName(null)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {previewImage && (
                      <div className="relative mt-2 w-fit">
                        <img src={previewImage} alt="Önizleme" className="max-h-40 rounded-lg border object-cover" />
                        <button
                          onClick={() => setPreviewImage(null)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        <Button
                          variant="ghost" size="sm"
                          className="gap-1.5 text-xs text-muted-foreground h-8"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <ImagePlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Fotoğraf</span>
                        </Button>
                        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip" className="hidden" onChange={handleFileSelect} />
                        <Button
                          variant="ghost" size="sm"
                          className="gap-1.5 text-xs text-muted-foreground h-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="hidden sm:inline">Dosya</span>
                        </Button>
                      </div>
                      <Button size="sm" onClick={handlePost} disabled={!newPost.trim()} className="gap-1.5 px-5">
                        <Send className="w-3.5 h-3.5" />Paylaş
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {feedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={post.universityId === "rteu" || !post.universityId ? deletePost : undefined}
                  comments={getPostComments(post.id)}
                  onAddComment={addComment}
                  showUniBadge={scope === "national"}
                />
              ))}
            </div>

            {feedPosts.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
                Tüm gönderileri gördünüz
              </p>
            )}
          </div>

          {/* Desktop Right Sidebar */}
          <aside className="hidden xl:block w-72 2xl:w-80 shrink-0">
            <div className="sticky top-6">
              <FeedSidebar posts={feedPosts} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
