import { ArrowRightOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex, Typography, theme } from "antd";
import type { AppGroup } from "@/features/groups/types";
import {
  getCommunityAccent,
  getCommunityInitials,
  getCommunitySummary,
} from "@/pages/Communities/communitySurface";

interface CommunitySpotlightProps {
  group?: AppGroup;
  onCreateGroup: () => void;
  onOpen: (group: AppGroup) => void;
  onToggleMembership: (group: AppGroup) => void;
  isActing: boolean;
}

export default function CommunitySpotlight({
  group,
  onCreateGroup,
  onOpen,
  onToggleMembership,
  isActing,
}: CommunitySpotlightProps) {
  const { token } = theme.useToken();

  if (!group) {
    return (
      <div
        style={{
          padding: 24,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
        }}
      >
        <Flex vertical gap={14}>
          <Typography.Text type="secondary" style={{ fontWeight: 700 }}>
            Topluluklar için bos bir alan degil
          </Typography.Text>
          <Typography.Title level={3} style={{ margin: 0 }}>
            Ilk topluluğu oluştur ve bu alani canlandir.
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
            Bu sayfa akis degil, topluluk vitrini olacak. Guzel gorunmesi için once içerik
            lazim. Ilk adimi buradan atabilirsin.
          </Typography.Paragraph>
          <Flex>
            <Button
              icon={<PlusOutlined />}
              onClick={onCreateGroup}
              shape="round"
              size="large"
              type="primary"
            >
              Topluluk oluştur
            </Button>
          </Flex>
        </Flex>
      </div>
    );
  }

  const accent = getCommunityAccent(group.category);
  const summary = getCommunitySummary(group);

  return (
    <div
      style={{
        position: "relative",
        minHeight: 278,
        padding: 24,
        overflow: "hidden",
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        background: group.bannerUrl
          ? `url(${group.bannerUrl}) center / cover`
          : token.colorFillQuaternary,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: group.bannerUrl ? "rgba(255,255,255,0.72)" : "transparent",
        }}
      />

      <Flex vertical justify="space-between" style={{ position: "relative", minHeight: 230 }}>
        <Flex align="center" justify="space-between" gap={12} wrap="wrap">
          <Typography.Text type="secondary" style={{ fontWeight: 700 }}>
            Topluluk spotlight
          </Typography.Text>
          <Button
            shape="round"
            onClick={onCreateGroup}
            icon={<PlusOutlined />}
          >
            Yeni topluluk
          </Button>
        </Flex>

        <Flex vertical gap={14}>
          <Flex align="center" gap={14} wrap="wrap">
            <Avatar
              shape="square"
              size={84}
              src={group.avatarUrl}
              style={{
                background: accent.accentSoft,
                color: accent.accent,
                fontSize: 28,
                fontWeight: 800,
                border: `1px solid ${token.colorBorderSecondary}`,
              }}
            >
              {!group.avatarUrl ? getCommunityInitials(group.name) : null}
            </Avatar>
            <div>
              <Typography.Title level={2} style={{ margin: 0 }}>
                {group.name}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ fontSize: 15 }}>
                {group.category} · {group.memberCount} üye
              </Typography.Text>
            </div>
          </Flex>

          <Typography.Paragraph
            style={{
              margin: 0,
              maxWidth: 560,
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            {summary}
          </Typography.Paragraph>

          <Flex align="center" gap={10} wrap="wrap">
            <Button
              type="primary"
              shape="round"
              size="large"
              onClick={() => onOpen(group)}
              icon={<ArrowRightOutlined />}
            >
              Detaya git
            </Button>
            <Button
              shape="round"
              size="large"
              loading={isActing}
              onClick={() => onToggleMembership(group)}
              icon={<TeamOutlined />}
            >
              {isActing ? "Isleniyor" : group.isMember ? "Ayril" : "Katıl"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
