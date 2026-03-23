import { NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Search,
  ShoppingBag,
  Calendar,
  Users,
  Tag,
  User,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";

const mainNav = [
  { to: "/", icon: Home, label: "Anasayfa" },
  { to: "/feed", icon: MessageSquare, label: "Feed" },
  { to: "/visual-search", icon: Search, label: "Görsel Arama" },
  { to: "/marketplace", icon: ShoppingBag, label: "Pazar" },
  { to: "/events", icon: Calendar, label: "Etkinlikler" },
  { to: "/groups", icon: Users, label: "Gruplar" },
  { to: "/discounts", icon: Tag, label: "İndirimler" },
];

const bottomNav = [
  { to: "/profile", icon: User, label: "Profil" },
  { to: "/settings", icon: Settings, label: "Ayarlar" },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r bg-sidebar-background sticky top-0">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-foreground">
          Edu<span className="text-primary">Connect</span>
        </span>
      </div>

      <Separator />

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-secondary",
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      <div className="px-3 py-3 space-y-1">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-secondary",
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Çıkış Yap
        </button>
      </div>

      <Separator />

      <div className="flex items-center gap-3 px-4 py-4">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
          <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.department}</p>
        </div>
      </div>
    </aside>
  );
}
