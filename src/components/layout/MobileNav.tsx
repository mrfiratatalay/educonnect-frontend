import { NavLink } from "react-router-dom";
import { Home, MessageSquare, Search, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", icon: Home, label: "Ana Sayfa" },
  { to: "/feed", icon: MessageSquare, label: "Feed" },
  { to: "/visual-search", icon: Search, label: "Arama" },
  { to: "/marketplace", icon: ShoppingBag, label: "Pazar" },
  { to: "/profile", icon: User, label: "Profil" },
];

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
