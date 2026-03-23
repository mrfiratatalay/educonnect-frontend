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
  Shield,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";

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
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r bg-sidebar-background sticky top-0">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Edu<span className="text-primary">Connect</span>
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative w-9 h-9" aria-label="Bildirimler">
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-destructive text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 5).map((n) => (
              <DropdownMenuItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="flex flex-col items-start gap-1 py-2"
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="font-medium text-sm">{n.title}</span>
                  {!n.isRead && (
                    <Badge variant="default" className="ml-auto text-[10px] px-1.5 py-0">
                      Yeni
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{n.message}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-secondary",
              )
            }
          >
            <Shield className="w-5 h-5 shrink-0" />
            Admin Paneli
          </NavLink>
        )}
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
