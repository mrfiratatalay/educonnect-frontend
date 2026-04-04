import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationsMenu from "@/components/layout/NotificationsMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="w-4 h-4" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Edu<span className="text-primary">Connect</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <NotificationsMenu
          buttonClassName="relative"
          iconClassName="w-5 h-5"
        />

        <Avatar className="w-8 h-8 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
          <AvatarFallback className="text-xs">
            {user?.fullName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
