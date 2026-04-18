import {
  Bell,
  Bookmark,
  Calendar,
  Home,
  MessageSquare,
  Search,
  Settings,
  Sparkles,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface ShellNavItem {
  key: string;
  to: string;
  label: string;
  icon: LucideIcon;
}

export const shellMainNavItems: ShellNavItem[] = [
  { key: "/", to: "/", icon: Home, label: "Ana Sayfa" },
  { key: "/explore", to: "/explore", icon: Search, label: "Keşfet" },
  { key: "/communities", to: "/communities", icon: Users, label: "Topluluklar" },
  { key: "/events", to: "/events", icon: Calendar, label: "Etkinlikler" },
  { key: "/market", to: "/market", icon: Store, label: "Pazar" },
  { key: "/notifications", to: "/notifications", icon: Bell, label: "Bildirimler" },
  { key: "/messages", to: "/messages", icon: MessageSquare, label: "Sohbet" },
  { key: "/edu-ai", to: "/edu-ai", icon: Sparkles, label: "EduAI" },
  { key: "/profile", to: "/profile", icon: User, label: "Profil" },
];

export const shellMoreNavItems: ShellNavItem[] = [
  { key: "/bookmarks", to: "/bookmarks", icon: Bookmark, label: "Yer İşaretleri" },
  { key: "/settings", to: "/settings", icon: Settings, label: "Ayarlar ve gizlilik" },
];

export const shellMobileBottomNavItems: ShellNavItem[] = [
  shellMainNavItems[0],
  shellMainNavItems[1],
  shellMainNavItems[7],
  shellMainNavItems[5],
  shellMainNavItems[6],
];

export const shellMobileDrawerNavItems: ShellNavItem[] = [
  shellMainNavItems[8],
  shellMainNavItems[2],
  shellMainNavItems[3],
  shellMainNavItems[4],
  ...shellMoreNavItems,
];

export const shellSecondaryNavItems: ShellNavItem[] = shellMoreNavItems;

const allShellNavItems = [...shellMainNavItems, ...shellMoreNavItems];

export function getSelectedShellKey(pathname: string) {
  const matchedItem = allShellNavItems.find(
    (item) =>
      pathname === item.to ||
      (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
  );

  return matchedItem?.key ?? "/";
}

export function isMoreNavPath(pathname: string) {
  return shellMoreNavItems.some(
    (item) =>
      pathname === item.to ||
      (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
  );
}

export function getShellLabel(pathname: string) {
  const matchedItem = allShellNavItems.find(
    (item) =>
      pathname === item.to ||
      (item.to !== "/" && pathname.startsWith(`${item.to}/`)),
  );

  return matchedItem?.label ?? "";
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
