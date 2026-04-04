import { Card, CardContent } from "@/components/ui/card";
import type { AppGroup } from "@/features/groups/types";
import GroupCard from "@/pages/Explore/components/GroupCard";

interface GroupGridProps {
  groups: AppGroup[];
  actingGroupId?: string;
  errorMessage?: string;
  isLoading: boolean;
  onOpen: (groupId: string) => void;
  onToggleMembership: (group: AppGroup) => void;
}

export default function GroupGrid({
  groups,
  actingGroupId,
  errorMessage,
  isLoading,
  onOpen,
  onToggleMembership,
}: GroupGridProps) {
  if (isLoading) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Gruplar yukleniyor...</CardContent></Card>;
  }

  if (errorMessage) {
    return <Card><CardContent className="p-6 text-sm text-destructive">{errorMessage}</CardContent></Card>;
  }

  if (groups.length === 0) {
    return <Card><CardContent className="p-6 text-sm text-muted-foreground">Aramana uygun grup bulunamadi.</CardContent></Card>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          isActing={actingGroupId === group.id}
          onOpen={onOpen}
          onToggleMembership={onToggleMembership}
        />
      ))}
    </div>
  );
}
