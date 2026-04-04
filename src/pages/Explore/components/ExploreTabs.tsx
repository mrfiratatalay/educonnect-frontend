import type { ElementType } from "react";
import { Calendar, Tag, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type ExploreTab = "groups" | "events" | "discounts";

const tabs: Array<{ key: ExploreTab; label: string; icon: ElementType }> = [
  { key: "groups", label: "Gruplar", icon: Users },
  { key: "events", label: "Etkinlikler", icon: Calendar },
  { key: "discounts", label: "Indirimler", icon: Tag },
];

interface ExploreTabsProps {
  activeTab: ExploreTab;
  onChange: (tab: ExploreTab) => void;
}

export default function ExploreTabs({
  activeTab,
  onChange,
}: ExploreTabsProps) {
  return (
    <div className="flex w-fit gap-1 rounded-lg bg-secondary/50 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium transition-all",
            activeTab === tab.key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  );
}
