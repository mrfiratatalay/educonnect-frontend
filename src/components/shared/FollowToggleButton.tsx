import { useState } from "react";
import { Button } from "antd";

interface FollowToggleButtonProps {
  isFollowing: boolean;
  isLoading?: boolean;
  onClick: () => void;
  minWidth?: number;
  compact?: boolean;
}

export default function FollowToggleButton({
  isFollowing,
  isLoading = false,
  onClick,
  minWidth,
  compact = false,
}: FollowToggleButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      type={isFollowing ? "default" : "primary"}
      shape="round"
      loading={isLoading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        fontWeight: 700,
        minWidth,
        padding: compact ? "0 16px" : undefined,
      }}
    >
      {isFollowing ? (isHovered ? "Takibi birak" : "Takip edildi") : "Takip et"}
    </Button>
  );
}
