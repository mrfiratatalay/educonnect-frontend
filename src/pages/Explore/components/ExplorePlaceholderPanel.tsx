import { Card, Empty, Typography } from "antd";

interface ExplorePlaceholderPanelProps {
  title: string;
  description: string;
}

export default function ExplorePlaceholderPanel({
  title,
  description,
}: ExplorePlaceholderPanelProps) {
  return (
    <Card>
      <Empty description={false}>
        <Typography.Title level={4}>{title}</Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </Empty>
    </Card>
  );
}
