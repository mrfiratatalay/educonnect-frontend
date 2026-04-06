import { Avatar, Flex, Skeleton, Typography, theme } from "antd";
import type { AppGroup } from "@/features/groups/types";
import {
  formatCommunityMemberCount,
  getCommunityInitials,
} from "@/pages/Communities/communitySurface";

interface CommunityListItemProps {
  group: AppGroup;
  onOpen: (group: AppGroup) => void;
  compact?: boolean;
}

export default function CommunityListItem({
  group,
  onOpen,
  compact = false,
}: CommunityListItemProps) {
  const { token } = theme.useToken();
  const imageSize = compact ? 84 : 96;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(group)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(group);
        }
      }}
      style={{
        padding: compact ? "12px 0" : "16px 0",
        cursor: "pointer",
        borderBottom: compact ? "none" : `1px solid ${token.colorBorderSecondary}`,
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.backgroundColor = token.colorFillQuaternary;
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Flex align="flex-start" gap={14} style={{ paddingInline: compact ? 0 : 16 }}>
        <Avatar
          shape="square"
          size={imageSize}
          src={group.avatarUrl}
          style={{
            flexShrink: 0,
            borderRadius: 16,
            background: token.colorFillSecondary,
            color: token.colorText,
            fontSize: compact ? 22 : 24,
            fontWeight: 800,
          }}
        >
          {!group.avatarUrl ? getCommunityInitials(group.name) : null}
        </Avatar>

        <Flex vertical gap={6} style={{ minWidth: 0, flex: 1 }}>
          <Flex align="center" gap={8} wrap="wrap">
            <Typography.Text strong style={{ fontSize: compact ? 17 : 18, lineHeight: 1.25 }}>
              {group.name}
            </Typography.Text>
          </Flex>

          <Typography.Text style={{ display: "block", fontSize: compact ? 14 : 15, fontWeight: 700 }}>
            {formatCommunityMemberCount(group.memberCount)}
          </Typography.Text>

          <Typography.Text type="secondary" style={{ display: "block", fontSize: 14, lineHeight: 1.25 }}>
            {group.category}
          </Typography.Text>

          {group.previewMembers?.length ? (
            <Avatar.Group size={compact ? 32 : 34} max={{ count: compact ? 4 : 5 }}>
              {group.previewMembers.map((member) => (
                <Avatar key={member.userId} src={member.avatarUrl}>
                  {!member.avatarUrl ? getCommunityInitials(member.fullName) : null}
                </Avatar>
              ))}
            </Avatar.Group>
          ) : null}
        </Flex>
      </Flex>
    </div>
  );
}

export function CommunityListSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{ padding: compact ? "12px 0" : "16px 16px" }}>
      <Flex align="flex-start" gap={14}>
        <Skeleton.Avatar active shape="square" size={compact ? 84 : 96} />
        <Skeleton
          active
          title={{ width: "48%" }}
          paragraph={{ rows: 3, width: ["36%", "24%", "44%"] }}
          style={{ flex: 1 }}
        />
      </Flex>
    </div>
  );
}
