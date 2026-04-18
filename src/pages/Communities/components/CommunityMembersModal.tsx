import { Avatar, Button, Empty, Flex, Modal, Skeleton, Tag, Typography, theme } from "antd";
import type { AppGroupMember } from "@/features/groups/types";
import { getCommunityInitials } from "@/pages/Communities/communitySurface";

interface CommunityMembersModalProps {
  open: boolean;
  members?: AppGroupMember[];
  loading: boolean;
  actingUserId?: string;
  canManageMembers: boolean;
  onClose: () => void;
  onPromote: (member: AppGroupMember) => void | Promise<void>;
  onDemote: (member: AppGroupMember) => void | Promise<void>;
  onRemove: (member: AppGroupMember) => void | Promise<void>;
}

const roleLabels: Record<AppGroupMember["role"], string> = {
  owner: "Kurucu",
  moderator: "Moderator",
  member: "Uye",
};

export default function CommunityMembersModal({
  open,
  members = [],
  loading,
  actingUserId,
  canManageMembers,
  onClose,
  onPromote,
  onDemote,
  onRemove,
}: CommunityMembersModalProps) {
  const { token } = theme.useToken();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Uyeler"
      footer={null}
      width={720}
      destroyOnHidden
    >
      {loading ? (
        <Flex vertical gap={12}>
          <Skeleton active avatar paragraph={{ rows: 1 }} />
          <Skeleton active avatar paragraph={{ rows: 1 }} />
          <Skeleton active avatar paragraph={{ rows: 1 }} />
        </Flex>
      ) : members.length === 0 ? (
        <Empty description="Uye bulunamadi." />
      ) : (
        <Flex vertical>
          {members.map((member, index) => {
            const isActing = actingUserId === member.userId;

            return (
              <Flex
                key={member.userId}
                align="center"
                justify="space-between"
                gap={16}
                style={{
                  padding: "12px 0",
                  borderBottom: index === members.length - 1 ? "none" : `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Flex align="center" gap={12} style={{ minWidth: 0, flex: 1 }}>
                  <Avatar src={member.avatarUrl} size={44}>
                    {!member.avatarUrl ? getCommunityInitials(member.fullName) : null}
                  </Avatar>
                  <div style={{ minWidth: 0 }}>
                    <Flex align="center" gap={8} wrap>
                      <Typography.Text strong ellipsis style={{ maxWidth: 240 }}>
                        {member.fullName}
                      </Typography.Text>
                      <Tag color={getRoleColor(member.role)} style={{ marginInlineEnd: 0 }}>
                        {roleLabels[member.role]}
                      </Tag>
                      {member.isCurrentUser ? (
                        <Tag style={{ marginInlineEnd: 0 }}>Sen</Tag>
                      ) : null}
                    </Flex>
                    <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
                      {[member.department, formatJoinDate(member.joinedAt)].filter(Boolean).join(" • ")}
                    </Typography.Text>
                  </div>
                </Flex>

                {canManageMembers ? (
                  <Flex gap={8} wrap justify="flex-end">
                    {member.canBePromoted ? (
                      <Button size="small" loading={isActing} onClick={() => void onPromote(member)}>
                        Moderator yap
                      </Button>
                    ) : null}
                    {member.canBeDemoted ? (
                      <Button size="small" loading={isActing} onClick={() => void onDemote(member)}>
                        Moderorlugu al
                      </Button>
                    ) : null}
                    {member.canBeRemoved ? (
                      <Button danger size="small" loading={isActing} onClick={() => void onRemove(member)}>
                        Cikar
                      </Button>
                    ) : null}
                  </Flex>
                ) : null}
              </Flex>
            );
          })}
        </Flex>
      )}
    </Modal>
  );
}

function getRoleColor(role: AppGroupMember["role"]) {
  switch (role) {
    case "owner":
      return "gold";
    case "moderator":
      return "blue";
    default:
      return "default";
  }
}

function formatJoinDate(value: string) {
  return `Katilim: ${new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value))}`;
}
