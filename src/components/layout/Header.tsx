import { Bell, GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();
  const navigate = useNavigate();

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b bg-background/95 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Edu<span className="text-primary">Connect</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
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

        <Avatar
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
          <AvatarFallback className="text-xs">{user?.fullName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
