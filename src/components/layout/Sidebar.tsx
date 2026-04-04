import { NavLink } from "react-router-dom";
import {
  Compass,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  User,
} from "lucide-react";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const mainNav = [
  { to: "/", icon: Home, label: "Anasayfa" },
  { to: "/feed", icon: MessageSquare, label: "Feed" },
  { to: "/explore", icon: Compass, label: "Kesfet" },
  { to: "/visual-search", icon: Search, label: "Gorsel Arama" },
];

const bottomNav = [
  { to: "/profile", icon: User, label: "Profil" },
  { to: "/settings", icon: Settings, label: "Ayarlar" },
];

export default function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-sidebar-background lg:flex">
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Edu<span className="text-primary">Connect</span>
          </span>
        </div>

        <NotificationsMenu
          buttonClassName="relative w-9 h-9"
          iconClassName="w-4 h-4"
        />
      </div>

      <Separator />

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3 scrollbar-hide">
        {mainNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-secondary",
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Separator />

      <div className="space-y-0.5 px-3 py-2.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-secondary",
              )
            }
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {item.label}
          </NavLink>
        ))}

        <button
          onClick={() => void logout()}
          className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0" />
          Cikis Yap
        </button>
      </div>

      <Separator />

      <div className="flex items-center gap-3 px-4 py-3.5">
        <Avatar className="w-9 h-9">
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {user?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{user?.fullName}</p>
          <p className="truncate text-[11px] text-muted-foreground">
            {user?.department}
          </p>
        </div>
      </div>
    </aside>
  );
}
