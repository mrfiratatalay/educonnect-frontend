import { Avatar, Button, Card, Flex, Skeleton, Typography, theme } from "antd";
import { useNavigate } from "react-router-dom";
import FollowToggleButton from "@/components/shared/FollowToggleButton";
import {
  useFollowSuggestionsQuery,
  useToggleFollowUserMutation,
} from "@/features/users/hooks";

interface FollowSuggestionsCardProps {
  title?: string;
  limit?: number;
  background?: string;
  bordered?: boolean;
}

export default function FollowSuggestionsCard({
  title = "Kimi takip etmeli",
  limit = 3,
  background,
  bordered = true,
}: FollowSuggestionsCardProps) {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const suggestionsQuery = useFollowSuggestionsQuery(limit);
  const toggleFollowMutation = useToggleFollowUserMutation();

  const cardStyle: React.CSSProperties = {
    overflow: "hidden",
    borderRadius: 24,
    ...(background ? { background } : {}),
    ...(bordered ? { border: `1px solid ${token.colorBorderSecondary}` } : {}),
  };

  return (
    <Card
      variant={bordered ? "outlined" : "borderless"}
      style={cardStyle}
      styles={{ body: { padding: 0 } }}
    >
      <Flex vertical gap={2}>
        <Typography.Title
          level={4}
          style={{
            margin: 0,
            padding: "14px 16px 8px",
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </Typography.Title>

        {suggestionsQuery.isLoading ? (
          <div style={{ padding: "8px 16px 16px" }}>
            <Skeleton active title={false} paragraph={{ rows: 3 }} />
          </div>
        ) : suggestionsQuery.isError ? (
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, padding: "0 16px 16px" }}
          >
            Kullanıcı onerileri şimdilik yüklenemedi.
          </Typography.Text>
        ) : suggestionsQuery.data && suggestionsQuery.data.length > 0 ? (
          <>
            {suggestionsQuery.data.map((suggestion) => (
              <div key={suggestion.id} style={{ padding: "10px 16px" }}>
                <Flex gap={12} align="center">
                  <Avatar
                    src={suggestion.avatarUrl}
                    size={40}
                    style={{ cursor: "pointer", flexShrink: 0 }}
                    onClick={() => navigate(`/profile/${suggestion.id}`)}
                  >
                    {suggestion.fullName.charAt(0)}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text
                      strong
                      ellipsis
                      style={{
                        fontSize: 15,
                        lineHeight: 1.2,
                        cursor: "pointer",
                        display: "block",
                      }}
                      onClick={() => navigate(`/profile/${suggestion.id}`)}
                    >
                      {suggestion.fullName}
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      ellipsis
                      style={{ fontSize: 15, display: "block" }}
                    >
                      {suggestion.reasonLabel}
                    </Typography.Text>
                  </div>
                  <FollowToggleButton
                    isFollowing={suggestion.isFollowedByCurrentUser}
                    isLoading={
                      toggleFollowMutation.isPending &&
                      toggleFollowMutation.variables?.userId === suggestion.id
                    }
                    onClick={() =>
                      void toggleFollowMutation.mutateAsync({
                        userId: suggestion.id,
                        isFollowing: suggestion.isFollowedByCurrentUser,
                      })
                    }
                    compact
                  />
                </Flex>
              </div>
            ))}
          </>
        ) : (
          <Typography.Text
            type="secondary"
            style={{ fontSize: 13, padding: "0 16px 16px" }}
          >
            Şu an yeni bir takip onerisi yok.
          </Typography.Text>
        )}
      </Flex>
    </Card>
  );
}
