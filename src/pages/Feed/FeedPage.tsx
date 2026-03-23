import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Users,
  Tag,
  ArrowRight,
  Paperclip,
  FileText,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
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
  mockDiscounts,
  mockEvents,
  mockComments,
} from "@/data/mock";
import { cn } from "@/lib/utils";
import type { Post, Comment } from "@/types";

const postTypeLabels = {
  general: { label: "Genel", icon: MessageCircle, color: "text-muted-foreground" },
  material: { label: "Ders Materyali", icon: FileText, color: "text-blue-600" },
  question: { label: "Soru", icon: HelpCircle, color: "text-amber-600" },
} as const;

function PostCard({
  post,
  onDelete,
  comments,
  onAddComment,
}: {
  post: Post;
  onDelete?: (id: string) => void;
  comments: Comment[];
  onAddComment: (postId: string, content: string) => void;
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

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    if (diff < 0) return "az önce";
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "az önce";
    if (mins < 60) return `${mins}dk`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}sa`;
    const days = Math.floor(hours / 24);
    return `${days}g`;
  };

  const isOwn = post.userId === user?.id;
  const typeInfo = postTypeLabels[post.postType];

  const handleSubmitComment = () => {
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput("");
  };

  return (
    <Card className="border-0 shadow-none lg:border lg:shadow-sm hover:shadow-none">
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
                    className={cn("text-[10px] gap-1", typeInfo.color)}
                  >
                    <typeInfo.icon className="w-3 h-3" />
                    {typeInfo.label}
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
                  <DropdownMenuItem
                    onClick={() => setSaved(!saved)}
                    className="gap-2"
                  >
                    <Bookmark
                      className={cn("w-4 h-4", saved && "fill-current")}
                    />
                    {saved ? "Kaydı Kaldır" : "Kaydet"}
                  </DropdownMenuItem>
                  {isOwn && onDelete && (
                    <DropdownMenuItem
                      onClick={() => onDelete(post.id)}
                      className="gap-2 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </DropdownMenuItem>
                  )}
                  {!isOwn && (
                    <DropdownMenuItem className="gap-2 text-destructive">
                      <Flag className="w-4 h-4" />
                      Bildir
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
                {showComments ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-muted-foreground hover:text-primary"
              >
                <Share2 className="w-4 h-4" />
                Paylaş
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-3 space-y-3">
                <Separator />
                {comments.length > 0 && (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto scrollbar-hide">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2.5">
                        <Avatar
                          className="w-7 h-7 shrink-0 cursor-pointer"
                          onClick={() =>
                            navigate(`/profile/${comment.userId}`)
                          }
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
                              onClick={() =>
                                navigate(`/profile/${comment.userId}`)
                              }
                            >
                              {comment.userName}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {timeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs mt-0.5 text-foreground/80 leading-relaxed">
                            {comment.content}
                          </p>
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSubmitComment()
                      }
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

function FeedSidebar() {
  const { user } = useAuthStore();
  const suggestedGroups = mockGroups.filter((g) => !g.isMember).slice(0, 3);
  const activeDiscounts = mockDiscounts.filter((d) => d.isActive).slice(0, 3);
  const upcomingEvent = mockEvents[0];

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-16 bg-gradient-to-r from-primary/80 to-primary" />
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

      {upcomingEvent && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Yaklaşan Etkinlik
              </h3>
            </div>
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="font-medium text-sm">{upcomingEvent.title}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(upcomingEvent.startDate).toLocaleDateString("tr-TR", {
                  day: "numeric",
                  month: "long",
                })}
                {" · "}
                {upcomingEvent.location}
              </p>
            </div>
            <Link to="/explore">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 gap-1 text-xs"
              >
                Tüm Etkinlikler <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {suggestedGroups.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                Önerilen Gruplar
              </h3>
            </div>
            <div className="space-y-3">
              {suggestedGroups.map((group) => (
                <div key={group.id} className="flex items-center gap-3">
                  {group.imageUrl ? (
                    <img
                      src={group.imageUrl}
                      alt={group.name}
                      className="w-9 h-9 rounded-lg object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{group.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {group.memberCount} üye
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/explore">
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 gap-1 text-xs"
              >
                Tüm Gruplar <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-accent" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
              Aktif İndirimler
            </h3>
          </div>
          <div className="space-y-2">
            {activeDiscounts.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between py-1.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {d.businessName}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {d.title}
                  </p>
                </div>
                <Badge variant="accent" className="shrink-0 ml-2">
                  %{d.discountRate}
                </Badge>
              </div>
            ))}
          </div>
          <Link to="/explore">
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 gap-1 text-xs"
            >
              Tüm İndirimler <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
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
  const [postType, setPostType] = useState<Post["postType"]>("general");
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const myGroups = mockGroups.filter((g) => g.isMember);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

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
      postType,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      commentsCount: 0,
      isLiked: false,
    };
    setPosts([post, ...posts]);
    setNewPost("");
    setPostType("general");
    setSelectedGroupId("");
    setAttachmentName(null);
    setPreviewImage(null);
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
            <h1 className="text-2xl font-bold lg:text-xl lg:font-semibold lg:text-muted-foreground lg:uppercase lg:tracking-wider lg:mb-1">
              Feed
            </h1>

            {/* Post Composer */}
            <Card className="border-0 shadow-none lg:border lg:shadow-sm hover:shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 shrink-0">
                    <AvatarImage src={user?.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user?.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    {/* Post Type Selector */}
                    <div className="flex items-center gap-1.5 mb-2">
                      {(
                        Object.entries(postTypeLabels) as [
                          Post["postType"],
                          (typeof postTypeLabels)[Post["postType"]],
                        ][]
                      ).map(([key, val]) => (
                        <button
                          key={key}
                          onClick={() => setPostType(key)}
                          className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer",
                            postType === key
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:bg-secondary",
                          )}
                        >
                          <val.icon className="w-3 h-3" />
                          {val.label}
                        </button>
                      ))}
                    </div>

                    {/* Group Selector */}
                    {myGroups.length > 0 && (
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <select
                          value={selectedGroupId}
                          onChange={(e) => setSelectedGroupId(e.target.value)}
                          className="h-7 rounded-md border border-input bg-secondary/50 px-2 text-[11px] text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          <option value="">Herkese Açık</option>
                          {myGroups.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                          ))}
                        </select>
                        {selectedGroupId && (
                          <Badge variant="secondary" className="text-[10px] gap-1">
                            <Users className="w-3 h-3" />
                            {myGroups.find((g) => g.id === selectedGroupId)?.name}
                          </Badge>
                        )}
                      </div>
                    )}

                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder={
                        postType === "question"
                          ? "Sorunuzu yazın..."
                          : postType === "material"
                            ? "Materyal hakkında açıklama yazın..."
                            : selectedGroupId
                              ? `${myGroups.find((g) => g.id === selectedGroupId)?.name} grubuna paylaş...`
                              : "Ne düşünüyorsun?"
                      }
                      rows={2}
                      className="w-full resize-none bg-secondary/50 rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-secondary/80 transition-all"
                    />

                    {/* Preview Attachment */}
                    {attachmentName && (
                      <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-secondary/60 border w-fit">
                        <FileText className="w-4 h-4 text-primary" />
                        <span className="text-xs truncate max-w-[180px]">
                          {attachmentName}
                        </span>
                        <button
                          onClick={() => setAttachmentName(null)}
                          className="text-muted-foreground hover:text-foreground cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Preview Image */}
                    {previewImage && (
                      <div className="relative mt-2 w-fit">
                        <img
                          src={previewImage}
                          alt="Önizleme"
                          className="max-h-40 rounded-lg border object-cover"
                        />
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
                        <input
                          ref={imageInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageSelect}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs text-muted-foreground h-8"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <ImagePlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Fotoğraf</span>
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5 text-xs text-muted-foreground h-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Paperclip className="w-4 h-4" />
                          <span className="hidden sm:inline">Dosya</span>
                        </Button>
                      </div>
                      <Button
                        size="sm"
                        onClick={handlePost}
                        disabled={!newPost.trim()}
                        className="gap-1.5 px-5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Paylaş
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Divider on mobile */}
            <div className="lg:hidden">
              <Separator />
            </div>

            {/* Posts */}
            <div className="space-y-3 lg:space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={deletePost}
                  comments={getPostComments(post.id)}
                  onAddComment={addComment}
                />
              ))}
            </div>

            {posts.length > 0 && (
              <p className="text-center text-sm text-muted-foreground py-6">
                Tüm gönderileri gördünüz
              </p>
            )}
          </div>

          {/* Desktop Right Sidebar */}
          <aside className="hidden xl:block w-72 2xl:w-80 shrink-0">
            <div className="sticky top-6">
              <FeedSidebar />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
