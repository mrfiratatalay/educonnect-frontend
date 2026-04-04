import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppGroup } from "@/features/groups/types";

interface GroupCardProps {
  group: AppGroup;
  isActing: boolean;
  onOpen: (groupId: string) => void;
  onToggleMembership: (group: AppGroup) => void;
}

export default function GroupCard({
  group,
  isActing,
  onOpen,
  onToggleMembership,
}: GroupCardProps) {
  return (
    <Card
      className="cursor-pointer overflow-hidden border border-border/60 transition-shadow hover:shadow-md"
      onClick={() => onOpen(group.id)}
    >
      <CardContent className="space-y-3 p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-semibold">{group.name}</h3>
            {group.isMember && <Badge variant="success">Uye</Badge>}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {group.category}
            </Badge>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {group.description}
        </p>

        <div className="space-y-1 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {group.memberCount} uye
          </p>
          <p className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Kurucu: {group.creatorName}
          </p>
        </div>

        <Button
          variant={group.isMember ? "outline" : "default"}
          size="sm"
          className="w-full"
          disabled={isActing}
          onClick={(event) => {
            event.stopPropagation();
            onToggleMembership(group);
          }}
        >
          {isActing ? "Isleniyor" : group.isMember ? "Ayril" : "Katil"}
        </Button>
      </CardContent>
    </Card>
  );
}
