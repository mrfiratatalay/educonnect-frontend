import { Calendar, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGroupDetailQuery } from "@/features/groups/hooks";
import type { AppGroup } from "@/features/groups/types";

interface GroupDetailDialogProps {
  actingGroupId?: string;
  errorMessage?: string | null;
  groupId: string | null;
  onClose: () => void;
  onToggleMembership: (group: AppGroup) => void;
}

export default function GroupDetailDialog({
  actingGroupId,
  errorMessage,
  groupId,
  onClose,
  onToggleMembership,
}: GroupDetailDialogProps) {
  const groupQuery = useGroupDetailQuery(groupId ?? undefined, Boolean(groupId));
  const group = groupQuery.data;

  return (
    <Dialog open={Boolean(groupId)} onOpenChange={onClose}>
      <DialogContent>
        {groupQuery.isLoading && <p className="text-sm text-muted-foreground">Grup detayi yukleniyor...</p>}
        {groupQuery.error instanceof Error && <p className="text-sm text-destructive">{groupQuery.error.message}</p>}

        {group && (
          <>
            <DialogHeader>
              <DialogTitle>{group.name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{group.category}</Badge>
                {group.isMember && <Badge variant="success">Uye</Badge>}
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                {group.description}
              </p>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  {group.memberCount} uye
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Kurucu: {group.creatorName}
                </p>
              </div>

              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

              <Button
                variant={group.isMember ? "outline" : "default"}
                className="w-full"
                disabled={actingGroupId === group.id}
                onClick={() => onToggleMembership(group)}
              >
                {actingGroupId === group.id ? "Isleniyor" : group.isMember ? "Ayril" : "Katil"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
