import { useNavigate } from "react-router-dom";
import { Avatar, Button, Empty, Flex, Modal, Skeleton, Typography, theme } from "antd";
import FollowToggleButton from "@/components/shared/FollowToggleButton";
import { getUserInitials } from "@/components/layout/shellNavigation";
import type { UserConnection } from "@/features/users/api";

interface ProfileConnectionsModalProps {
  open: boolean;
  title: string;
  loading?: boolean;
  profiles?: UserConnection[];
  currentUserId?: string;
  pendingUserId?: string | null;
  onClose: () => void;
  onToggleFollow: (profile: UserConnection) => void | Promise<void>;
}

export default function ProfileConnectionsModal({
  open,
  title,
  loading = false,
  profiles = [],
  currentUserId,
  pendingUserId,
  onClose,
  onToggleFollow,
}: ProfileConnectionsModalProps) {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={null}
      centered
      width={520}
      styles={{ body: { paddingTop: 8, paddingBottom: 8 } }}
    >
      {loading ? (
        <Flex vertical gap={16}>
          {Array.from({ length: 4 }, (_, index) => (
            <Flex key={index} align="center" gap={12}>
              <Skeleton.Avatar active size={48} shape="circle" />
              <div style={{ flex: 1 }}>
                <Skeleton active title={{ width: "50%" }} paragraph={{ rows: 1, width: ["70%"] }} />
              </div>
            </Flex>
          ))}
        </Flex>
      ) : profiles.length ? (
        <Flex vertical>
          {profiles.map((profile, index) => {
            const isCurrentUser = currentUserId === profile.id;
            return (
              <div
                key={profile.id}
                style={{
                  padding: "12px 0",
                  borderBottom:
                    index === profiles.length - 1 ? "none" : `1px solid ${token.colorBorderSecondary}`,
                }}
              >
                <Flex align="center" gap={12}>
                  <Avatar
                    size={48}
                    src={profile.avatarUrl}
                    style={{ flexShrink: 0, background: token.colorPrimaryBg, color: token.colorPrimary }}
                  >
                    {getUserInitials(profile.fullName)}
                  </Avatar>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      onClose();
                      navigate(isCurrentUser ? "/profile" : `/profile/${profile.id}`);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter" && event.key !== " ") {
                        return;
                      }

                      event.preventDefault();
                      onClose();
                      navigate(isCurrentUser ? "/profile" : `/profile/${profile.id}`);
                    }}
                    style={{ minWidth: 0, flex: 1, cursor: "pointer" }}
                  >
                    <Typography.Text strong ellipsis style={{ display: "block", fontSize: 15 }}>
                      {profile.fullName}
                    </Typography.Text>

                    <Typography.Text type="secondary" ellipsis style={{ display: "block", fontSize: 14 }}>
                      {buildConnectionSubtitle(profile)}
                    </Typography.Text>
                  </div>

                  {!isCurrentUser ? (
                    <FollowToggleButton
                      isFollowing={profile.isFollowedByCurrentUser}
                      isLoading={pendingUserId === profile.id}
                      onClick={() => void onToggleFollow(profile)}
                      minWidth={118}
                    />
                  ) : null}
                </Flex>
              </div>
            );
          })}
        </Flex>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Typography.Text type="secondary">
              Burada gosterilecek hesap bulunmuyor.
            </Typography.Text>
          }
        />
      )}
    </Modal>
  );
}

function buildConnectionSubtitle(profile: UserConnection) {
  const parts = [profile.department, profile.universityName].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Profili goruntule";
}
