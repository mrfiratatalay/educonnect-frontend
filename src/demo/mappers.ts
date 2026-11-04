/** Mirrors EduConnect.Api/Mappings/MappingExtensions.cs: entity in, API response out. */
import type {
  DemoComment, DemoDb, DemoEvent, DemoGroup, DemoGroupMember, DemoGroupRole, DemoNotification,
  DemoPost, DemoProduct, DemoUser,
} from "@/demo/types";

const GROUP_PREVIEW_MEMBER_LIMIT = 4;
const GROUP_MODERATOR_PREVIEW_LIMIT = 3;
const ROLE_RANK: Record<DemoGroupRole, number> = { member: 1, moderator: 2, owner: 3 };

export function findUser(db: DemoDb, userId: string) {
  return db.users.find((user) => user.id === userId);
}

export function isPrivileged(user: DemoUser) {
  return user.role === "admin" || user.role === "moderator";
}

export function toUserProfile(db: DemoDb, user: DemoUser) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    department: user.department,
    year: user.year,
    bio: user.bio ?? null,
    avatarUrl: user.avatarUrl ?? null,
    coverImageUrl: user.coverImageUrl ?? null,
    universityId: user.universityId,
    universityName: db.universities.find((u) => u.id === user.universityId)?.name ?? null,
    followersCount: db.follows.filter((f) => f.followedId === user.id).length,
    followingCount: db.follows.filter((f) => f.followerId === user.id).length,
  };
}

export function isFollowing(db: DemoDb, followerId: string, followedId: string) {
  return db.follows.some((f) => f.followerId === followerId && f.followedId === followedId);
}

export function toPublicProfile(db: DemoDb, user: DemoUser, me: DemoUser) {
  const { email: _email, ...profile } = toUserProfile(db, user);
  return { ...profile, isFollowedByCurrentUser: isFollowing(db, me.id, user.id) };
}

export function toConnection(db: DemoDb, user: DemoUser, me: DemoUser) {
  return {
    id: user.id,
    fullName: user.fullName,
    avatarUrl: user.avatarUrl ?? null,
    department: user.department,
    universityName: db.universities.find((u) => u.id === user.universityId)?.name ?? null,
    isFollowedByCurrentUser: isFollowing(db, me.id, user.id),
  };
}

export function toPost(db: DemoDb, post: DemoPost, me: DemoUser, recommendationReason?: string) {
  const author = findUser(db, post.userId);
  const group = post.groupId ? db.groups.find((g) => g.id === post.groupId) : undefined;
  return {
    id: post.id,
    userId: post.userId,
    groupId: group?.id ?? null,
    groupName: group?.name ?? null,
    groupSlug: group?.slug ?? null,
    groupAvatarUrl: group?.avatarUrl ?? null,
    userName: author?.fullName ?? "Bilinmeyen kullanıcı",
    avatarUrl: author?.avatarUrl ?? null,
    content: post.content,
    imageUrl: post.imageUrl ?? null,
    recommendationReason: recommendationReason ?? null,
    likesCount: post.likes.length,
    commentsCount: post.comments.length,
    viewsCount: post.viewerIds.length,
    likedByCurrentUser: post.likes.some((like) => like.userId === me.id),
    bookmarkedByCurrentUser: post.bookmarks.some((save) => save.userId === me.id),
    createdAtUtc: post.createdAtUtc,
  };
}

export function toComment(db: DemoDb, comment: DemoComment) {
  const author = findUser(db, comment.userId);
  return {
    id: comment.id,
    userId: comment.userId,
    userName: author?.fullName ?? "Bilinmeyen kullanıcı",
    avatarUrl: author?.avatarUrl ?? null,
    content: comment.content,
    createdAtUtc: comment.createdAtUtc,
  };
}

function toMemberPreview(db: DemoDb, member: DemoGroupMember) {
  const user = findUser(db, member.userId);
  return {
    userId: member.userId,
    fullName: user?.fullName ?? "",
    avatarUrl: user?.avatarUrl ?? null,
    department: user?.department ?? null,
    role: member.role,
  };
}

export function roleIn(group: DemoGroup, userId: string) {
  return group.members.find((member) => member.userId === userId)?.role;
}

export function toGroup(db: DemoDb, group: DemoGroup, me: DemoUser) {
  return {
    id: group.id,
    name: group.name,
    slug: group.slug,
    shortDescription: group.shortDescription,
    description: group.description,
    rules: group.rules,
    avatarUrl: group.avatarUrl ?? null,
    bannerUrl: group.bannerUrl ?? null,
    category: group.category,
    creatorUserId: group.creatorUserId,
    creatorName: findUser(db, group.creatorUserId)?.fullName ?? "",
    memberCount: group.members.length,
    previewMembers: [...group.members]
      .sort((a, b) => Date.parse(b.joinedAtUtc) - Date.parse(a.joinedAtUtc))
      .slice(0, GROUP_PREVIEW_MEMBER_LIMIT)
      .map((member) => toMemberPreview(db, member)),
    joinedByCurrentUser: group.members.some((member) => member.userId === me.id),
    createdAtUtc: group.createdAtUtc,
  };
}

export function toGroupDetail(db: DemoDb, group: DemoGroup, me: DemoUser) {
  const role = roleIn(group, me.id);
  const summary = toGroup(db, group, me);
  return {
    ...summary,
    postCount: db.posts.filter((p) => p.groupId === group.id && !p.isDeleted).length,
    eventCount: db.events.filter((e) => e.groupId === group.id).length,
    canCurrentUserPost: summary.joinedByCurrentUser,
    currentUserRole: role ?? null,
    canManageMembers: role === "owner" || role === "moderator",
    canManageSettings: role === "owner",
    canCreateEvents: role === "owner" || role === "moderator",
    moderatorPreviewMembers: group.members
      .filter((member) => member.role !== "member")
      .sort((a, b) => ROLE_RANK[b.role] - ROLE_RANK[a.role])
      .slice(0, GROUP_MODERATOR_PREVIEW_LIMIT)
      .map((member) => toMemberPreview(db, member)),
  };
}

export function toGroupMember(db: DemoDb, member: DemoGroupMember, actorRole: DemoGroupRole | undefined, me: DemoUser) {
  const isCurrentUser = member.userId === me.id;
  const canManageMembers = actorRole === "owner" || actorRole === "moderator";
  return {
    ...toMemberPreview(db, member),
    joinedAtUtc: member.joinedAtUtc,
    isCurrentUser,
    canBePromoted: actorRole === "owner" && member.role === "member" && !isCurrentUser,
    canBeDemoted: actorRole === "owner" && member.role === "moderator" && !isCurrentUser,
    canBeRemoved: canManageMembers && !isCurrentUser && member.role !== "owner"
      && (actorRole === "owner" || member.role === "member"),
  };
}

export function toEvent(db: DemoDb, event: DemoEvent, me: DemoUser) {
  const registered = event.participants.filter((p) => p.status === "registered");
  const group = event.groupId ? db.groups.find((g) => g.id === event.groupId) : undefined;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    startDateUtc: event.startDateUtc,
    endDateUtc: event.endDateUtc,
    creatorUserId: event.creatorUserId,
    creatorName: findUser(db, event.creatorUserId)?.fullName ?? "",
    groupId: group?.id,
    groupName: group?.name,
    maxParticipants: event.maxParticipants,
    participantCount: registered.length,
    registeredByCurrentUser: registered.some((p) => p.userId === me.id),
    category: event.category,
  };
}

export function toProduct(db: DemoDb, product: DemoProduct) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    categoryId: product.categoryId ?? null,
    categoryName: db.categories.find((c) => c.id === product.categoryId)?.name ?? null,
    sellerId: product.sellerId,
    sellerName: findUser(db, product.sellerId)?.fullName ?? "",
    condition: product.condition,
    isActive: product.isActive,
    city: product.city,
    isNegotiable: product.isNegotiable,
    imageUrls: product.imageUrls,
    createdAtUtc: product.createdAtUtc,
  };
}

export function toNotification(notification: DemoNotification) {
  return {
    id: notification.id,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    type: notification.type,
    createdAtUtc: notification.createdAtUtc,
    targetPath: notification.targetPath ?? null,
  };
}
