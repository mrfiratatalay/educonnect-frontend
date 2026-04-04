import { Alert, Button, Card, Empty, Flex, Spin, Tag, Typography, theme } from "antd";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { AppEvent } from "@/features/events/types";
import {
  formatEventDayLabel,
  formatEventTime,
  isEventFull,
} from "@/features/events/utils";

interface DashboardUpcomingEventsCardProps {
  events: AppEvent[];
  errorMessage?: string;
  isLoading: boolean;
}

export default function DashboardUpcomingEventsCard({
  events,
  errorMessage,
  isLoading,
}: DashboardUpcomingEventsCardProps) {
  const { token } = theme.useToken();

  return (
    <Card
      title={
        <Flex align="center" gap={10}>
          <Calendar size={18} color={token.colorPrimary} />
          <Typography.Text strong>Yaklasan Etkinlikler</Typography.Text>
        </Flex>
      }
      extra={
        <Link to="/explore?tab=events" style={{ textDecoration: "none" }}>
          <Button type="text" icon={<ArrowRight size={14} />} iconPlacement="end">
            Tumunu Gor
          </Button>
        </Link>
      }
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      <Flex vertical gap={12}>
        {isLoading && (
          <Flex justify="center" style={{ paddingBlock: 32 }}>
            <Spin size="large" />
          </Flex>
        )}

        {!isLoading && errorMessage && (
          <Alert type="error" showIcon title={errorMessage} />
        )}

        {!isLoading && !errorMessage && events.length === 0 && (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Yaklasan etkinlik bulunmuyor."
          />
        )}

        {!isLoading &&
          !errorMessage &&
          events.map((event) => {
            const [day, month = ""] = formatEventDayLabel(event.startDate).split(" ");
            const tagText = event.isRegistered
              ? "Kayitli"
              : isEventFull(event)
                ? "Dolu"
                : "Acik";
            const tagColor = event.isRegistered ? "green" : isEventFull(event) ? "red" : "blue";

            return (
              <Link
                key={event.id}
                to="/explore?tab=events"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Flex
                  align="center"
                  gap={16}
                  style={{
                    padding: 16,
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    background: token.colorBgLayout,
                  }}
                >
                  <Flex
                    vertical
                    align="center"
                    justify="center"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: token.borderRadiusLG,
                      background: token.colorPrimaryBg,
                      color: token.colorPrimary,
                      flexShrink: 0,
                    }}
                  >
                    <Typography.Text
                      style={{
                        fontSize: 11,
                        lineHeight: 1,
                        textTransform: "uppercase",
                        color: "inherit",
                      }}
                    >
                      {month}
                    </Typography.Text>
                    <Typography.Text
                      strong
                      style={{
                        fontSize: 22,
                        lineHeight: 1,
                        color: "inherit",
                      }}
                    >
                      {day}
                    </Typography.Text>
                  </Flex>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Typography.Text strong ellipsis style={{ display: "block" }}>
                      {event.title}
                    </Typography.Text>

                    <Flex wrap="wrap" gap={12} style={{ marginTop: 6 }}>
                      <Flex align="center" gap={6}>
                        <Clock size={14} color={token.colorTextSecondary} />
                        <Typography.Text type="secondary">
                          {formatEventTime(event.startDate)}
                        </Typography.Text>
                      </Flex>

                      <Flex align="center" gap={6} style={{ minWidth: 0 }}>
                        <MapPin size={14} color={token.colorTextSecondary} />
                        <Typography.Text
                          type="secondary"
                          ellipsis
                          style={{ maxWidth: 280 }}
                        >
                          {event.location}
                        </Typography.Text>
                      </Flex>
                    </Flex>
                  </div>

                  <Tag color={tagColor}>{tagText}</Tag>
                </Flex>
              </Link>
            );
          })}
      </Flex>
    </Card>
  );
}
