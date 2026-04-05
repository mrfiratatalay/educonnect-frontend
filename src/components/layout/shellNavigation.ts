import {
  Home,
  Search,
  Bell,
  MessageSquare,
  Sparkles,
  Bookmark,
  User,
  MoreHorizontal,
  type LucideIcon,
} from "lucide-react";

export interface ShellNavItem {
  key: string;
  to: string;
  label: string;
  icon: LucideIcon;
}

export const shellMainNavItems: ShellNavItem[] = [
  { key: "/", to: "/", icon: Home, label: "Anasayfa" },
  { key: "/explore", to: "/explore", icon: Search, label: "Keşfet" },
  { key: "/notifications", to: "/notifications", icon: Bell, label: "Bildirimler" },
  { key: "/messages", to: "/messages", icon: MessageSquare, label: "Sohbet" },
  { key: "/edu-ai", to: "/edu-ai", icon: Sparkles, label: "EduAI" },
  { key: "/bookmarks", to: "/bookmarks", icon: Bookmark, label: "Yer İşaretleri" },
  { key: "/profile", to: "/profile", icon: User, label: "Profil" },
  { key: "/more", to: "/more", icon: MoreHorizontal, label: "Daha fazla" },
];

export const shellSecondaryNavItems: ShellNavItem[] = [];

const allShellNavItems = [...shellMainNavItems];

export function getSelectedShellKey(pathname: string) {
  const matchedItem = allShellNavItems.find(
    (item) =>
      pathname === item.to ||
      (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
  );

  return matchedItem?.key ?? "/";
}

export function getUserInitials(fullName?: string) {
  if (!fullName?.trim()) {
    return "?";
  }

  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
