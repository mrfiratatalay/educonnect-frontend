import { Button, Flex, Popconfirm, Typography, theme } from "antd";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import type { ChatSession } from "@/features/chat/types";
import { useDeleteSessionMutation } from "@/features/chat/hooks";

interface SessionHistoryProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string | null) => void;
  onNewChat: () => void;
}

export default function SessionHistory({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
}: SessionHistoryProps) {
  const { token } = theme.useToken();
  const deleteSession = useDeleteSessionMutation();

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        width: 240,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        overflowY: "auto",
        padding: "12px 8px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <Typography.Text
        strong
        style={{ fontSize: 13, padding: "4px 8px", color: token.colorTextSecondary }}
      >
        Sohbet Gecmisi
      </Typography.Text>

      <Button
        type="dashed"
        icon={<Plus size={14} />}
        block
        size="small"
        style={{ marginBottom: 4 }}
        onClick={onNewChat}
      >
        Yeni Sohbet
      </Button>

      {sessions.map((session) => {
        const isSelected = session.sessionId === activeSessionId;
        return (
          <div
            key={session.sessionId}
            onClick={() => onSelectSession(session.sessionId)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
              background: isSelected ? token.colorPrimaryBg : "transparent",
              border: isSelected
                ? `1px solid ${token.colorPrimaryBorder}`
                : "1px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <Flex align="center" gap={8}>
              <MessageSquare size={14} color={isSelected ? token.colorPrimary : token.colorTextSecondary} />
              <Flex vertical style={{ flex: 1, minWidth: 0 }}>
                <Typography.Text ellipsis strong={isSelected} style={{ fontSize: 12, display: "block" }}>
                  {session.isActive ? "Aktif Sohbet" : dayjs(session.startedAtUtc).format("DD MMM HH:mm")}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 11 }}>
                  {session.totalMessages} mesaj
                </Typography.Text>
              </Flex>
              {!session.isActive && (
                <Popconfirm
                  title="Bu sohbeti silmek istediginize emin misiniz?"
                  onConfirm={() => {
                    if (session.sessionId === activeSessionId) onSelectSession(null);
                    deleteSession.mutate(session.sessionId);
                  }}
                  onCancel={(e) => e?.stopPropagation()}
                  okText="Sil"
                  cancelText="Vazgeç"
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<Trash2 size={12} />}
                    onClick={(e) => handleDelete(e, session.sessionId)}
                    style={{ minWidth: 24, height: 24, padding: 0, flexShrink: 0 }}
                  />
                </Popconfirm>
              )}
            </Flex>
          </div>
        );
      })}

      {sessions.length === 0 && (
        <Typography.Text type="secondary" style={{ fontSize: 12, padding: "12px 8px", textAlign: "center" }}>
          Henüz sohbet yok.
        </Typography.Text>
      )}
    </div>
  );
}
