import type { ElementType } from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatCardProps {
  icon: ElementType;
  label: string;
  value: string;
  trend?: string;
  color?: string;
}

export default function DashboardStatCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: DashboardStatCardProps) {
  return (
    <Card className="hover:shadow-none">
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs lg:text-sm text-muted-foreground font-medium">
              {label}
            </p>
            <p className="text-xl lg:text-2xl font-bold tracking-tight">
              {value}
            </p>
            {trend && (
              <p className="text-[11px] text-success flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div
            className={`flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${color || "bg-primary/10 text-primary"}`}
          >
            <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
