import {
  Compass,
  Home,
  MessageSquare,
  Search,
  Settings,
  User,
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
  { key: "/feed", to: "/feed", icon: MessageSquare, label: "Feed" },
  { key: "/explore", to: "/explore", icon: Compass, label: "Kesfet" },
  { key: "/visual-search", to: "/visual-search", icon: Search, label: "Gorsel Arama" },
];

export const shellSecondaryNavItems: ShellNavItem[] = [
  { key: "/profile", to: "/profile", icon: User, label: "Profil" },
  { key: "/settings", to: "/settings", icon: Settings, label: "Ayarlar" },
];

const allShellNavItems = [...shellMainNavItems, ...shellSecondaryNavItems];

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
