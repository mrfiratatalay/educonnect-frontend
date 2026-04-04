import { Alert, Card, Col, Empty, Row, Skeleton } from "antd";
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
    return (
      <Row gutter={[16, 16]}>
        {[0, 1, 2].map((item) => (
          <Col key={item} xs={24} sm={12} xl={8}>
            <Card>
              <Skeleton active paragraph={{ rows: 5 }} title={{ width: "48%" }} />
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (errorMessage) {
    return <Alert type="error" showIcon message={errorMessage} />;
  }

  if (groups.length === 0) {
    return <Empty description="Aramana uygun grup bulunamadı." />;
  }

  return (
    <Row gutter={[16, 16]}>
      {groups.map((group) => (
        <Col key={group.id} xs={24} sm={12} xl={8}>
          <GroupCard
            group={group}
            isActing={actingGroupId === group.id}
            onOpen={onOpen}
            onToggleMembership={onToggleMembership}
          />
        </Col>
      ))}
    </Row>
  );
}
