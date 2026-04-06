import type { ReactNode } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Typography, theme } from "antd";
import type { AppGroup, AppGroupMemberPreview } from "@/features/groups/types";
import { getCommunityInitials } from "@/pages/Communities/communitySurface";

const trendItems = [
  { label: "Gundemdekiler", title: "Hayfa" },
  { label: "Haberler", title: "SON DAKIKA" },
  { label: "Turkiye tarihinde gundemde", title: "Narin Guran" },
  { label: "Gundemdekiler", title: "Sokakta" },
];

interface CommunitiesRailProps {
  suggestedGroups: AppGroup[];
}

export default function CommunitiesRail({ suggestedGroups }: CommunitiesRailProps) {
  const followSuggestions = getFollowSuggestions(suggestedGroups);

  return (
    <Flex vertical gap={16} style={{ padding: "8px 16px 24px" }}>
      <RailCard
        title="Neler oluyor?"
        footer={
          <Button type="link" style={{ padding: 0 }}>
            Daha fazla goster
          </Button>
        }
      >
        <Flex vertical gap={16}>
          {trendItems.map((item) => (
            <TrendRow key={item.title} label={item.label} title={item.title} />
          ))}
        </Flex>
      </RailCard>

      <RailCard
        title="Kimi takip etmeli"
        footer={
          <Button type="link" style={{ padding: 0 }}>
            Daha fazla goster
          </Button>
        }
      >
        <Flex vertical gap={18}>
          {followSuggestions.map((person) => (
            <FollowRow key={person.key} name={person.name} handle={person.handle} avatarUrl={person.avatarUrl} />
          ))}
        </Flex>
      </RailCard>

      <div className="communities-meta-links">
        Hizmet Sartlari | Gizlilik Politikasi | Cerez Politikasi | Reklam bilgisi | Daha fazla
      </div>
    </Flex>
  );
}

function RailCard({
  title,
  footer,
  children,
}: {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const { token } = theme.useToken();

  return (
    <Card
      className="communities-side-card"
      variant="outlined"
      style={{
        borderColor: token.colorBorderSecondary,
        overflow: "hidden",
      }}
    >
      <Flex vertical gap={16}>
        <Typography.Title level={4} style={{ margin: 0, fontSize: 26, lineHeight: 1.15 }}>
          {title}
        </Typography.Title>
        {children}
        {footer ? <div>{footer}</div> : null}
      </Flex>
    </Card>
  );
}

function TrendRow({ label, title }: { label: string; title: string }) {
  const { token } = theme.useToken();

  return (
    <Flex align="flex-start" justify="space-between" gap={12}>
      <div style={{ minWidth: 0 }}>
        <Typography.Text type="secondary" style={{ display: "block", fontSize: 13 }}>
          {label}
        </Typography.Text>
        <Typography.Text strong style={{ display: "block", fontSize: 17, lineHeight: 1.25 }}>
          {title}
        </Typography.Text>
      </div>
      <EllipsisOutlined style={{ color: token.colorTextTertiary, marginTop: 4 }} />
    </Flex>
  );
}

function FollowRow({
  name,
  handle,
  avatarUrl,
}: {
  name: string;
  handle: string;
  avatarUrl?: string;
}) {
  const { token } = theme.useToken();

  return (
    <Flex align="center" gap={12}>
      <Avatar
        size={40}
        src={avatarUrl}
        style={{
          background: token.colorFillSecondary,
          color: token.colorText,
          flexShrink: 0,
        }}
      >
        {!avatarUrl ? getCommunityInitials(name) : null}
      </Avatar>

      <div style={{ minWidth: 0, flex: 1 }}>
        <Typography.Text strong ellipsis style={{ display: "block", fontSize: 16 }}>
          {name}
        </Typography.Text>
        <Typography.Text type="secondary" ellipsis style={{ display: "block", fontSize: 14 }}>
          @{handle}
        </Typography.Text>
      </div>

      <Button type="primary" shape="round" style={{ paddingInline: 16 }}>
        Takip et
      </Button>
    </Flex>
  );
}

function getFollowSuggestions(groups: AppGroup[]) {
  const map = new Map<
    string,
    { key: string; name: string; handle: string; avatarUrl?: string }
  >();

  groups.forEach((group) => {
    const baseMembers: AppGroupMemberPreview[] =
      group.previewMembers?.length
        ? group.previewMembers
        : [
            {
              userId: group.creatorUserId,
              fullName: group.creatorName,
              avatarUrl: undefined,
              role: "owner",
            },
          ];

    baseMembers.forEach((member) => {
      if (map.size >= 3 || map.has(member.userId)) {
        return;
      }

      map.set(member.userId, {
        key: member.userId,
        name: member.fullName,
        handle: member.fullName.replace(/\s+/g, "").toLowerCase(),
        avatarUrl: member.avatarUrl,
      });
    });
  });

  if (map.size === 0) {
    return [
      { key: "1", name: "Astro", handle: "astrodotbuild" },
      { key: "2", name: "Yusuf Demirci", handle: "meyusufdemirci" },
      { key: "3", name: "Deniz Oktar", handle: "denizoktar" },
    ];
  }

  return Array.from(map.values()).slice(0, 3);
}
