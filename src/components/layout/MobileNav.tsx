import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  MessageSquare,
  Search,
  ShoppingBag,
  Menu,
  Calendar,
  Users,
  Tag,
  User,
  Settings,
  Shield,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

const tabs = [
  { to: "/", icon: Home, label: "Anasayfa" },
  { to: "/feed", icon: MessageSquare, label: "Feed" },
  { to: "/visual-search", icon: Search, label: "Arama" },
  { to: "/marketplace", icon: ShoppingBag, label: "Pazar" },
];

const moreLinks = [
  { to: "/events", icon: Calendar, label: "Etkinlikler" },
  { to: "/groups", icon: Users, label: "Gruplar" },
  { to: "/discounts", icon: Tag, label: "İndirimler" },
  { to: "/profile", icon: User, label: "Profil" },
  { to: "/settings", icon: Settings, label: "Ayarlar" },
  { to: "/admin", icon: Shield, label: "Admin Paneli", adminOnly: true },
];

export default function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const visibleMore = moreLinks.filter(
    (l) => !("adminOnly" in l && l.adminOnly && user?.role !== "admin"),
  );

  return (
    <>
      {moreOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMoreOpen(false)}
        />
      )}

      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300",
          moreOpen ? "translate-y-0" : "",
        )}
      >
        {moreOpen && (
          <div className="mx-3 mb-2 rounded-2xl border bg-background shadow-2xl p-3 space-y-1 animate-in slide-in-from-bottom-4 duration-200">
            {visibleMore.map((link) => (
              <button
                key={link.to}
                onClick={() => {
                  navigate(link.to);
                  setMoreOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors cursor-pointer text-left"
              >
                <link.icon className="w-5 h-5 text-muted-foreground" />
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                logout();
                setMoreOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </div>
        )}

        <nav className="bg-background/95 backdrop-blur-md border-t pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-around h-16">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.to === "/"}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[56px]",
                    isActive ? "text-primary" : "text-muted-foreground",
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
            <button
              onClick={() => setMoreOpen(!moreOpen)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-colors min-w-[56px] cursor-pointer",
                moreOpen ? "text-primary" : "text-muted-foreground",
              )}
            >
              {moreOpen ? (
                <X className="w-5 h-5 stroke-[2.5px]" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">Daha</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
