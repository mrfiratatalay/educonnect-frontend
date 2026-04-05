import { Building2, CalendarDays, FileText } from "lucide-react";
import { Card, Timeline, Typography, theme } from "antd";

interface ProfileTimelineProps {
  profile: {
    createdAt?: string;
    universityName?: string;
    bio?: string;
  };
}

export default function ProfileTimeline({ profile }: ProfileTimelineProps) {
  const { token } = theme.useToken();

  const items = [
    ...(profile.createdAt
      ? [
          {
            color: token.colorPrimary,
            dot: <CalendarDays size={16} color={token.colorPrimary} />,
            children: (
              <>
                <Typography.Text strong>Platforma katildi</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {formatLongDate(profile.createdAt)}
                </Typography.Text>
              </>
            ),
          },
        ]
      : []),
    ...(profile.universityName
      ? [
          {
            color: token.colorSuccess,
            dot: <Building2 size={16} color={token.colorSuccess} />,
            children: (
              <>
                <Typography.Text strong>Universite bilgisi eklendi</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  {profile.universityName}
                </Typography.Text>
              </>
            ),
          },
        ]
      : []),
    ...(profile.bio
      ? [
          {
            color: token.colorTextTertiary,
            dot: <FileText size={16} color={token.colorTextTertiary} />,
            children: (
              <>
                <Typography.Text strong>Biyografi hazir</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Profil aciklamasi eklenmis.
                </Typography.Text>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card
      bordered={false}
      style={{
        borderRadius: 20,
        border: `1px solid ${token.colorBorderSecondary}`,
        boxShadow: "none",
      }}
      styles={{ body: { padding: "18px 20px 12px" } }}
    >
      <Typography.Title level={5} style={{ margin: 0, fontWeight: 800 }}>
        Hesap ozeti
      </Typography.Title>

      {items.length ? (
        <Timeline style={{ marginTop: 20 }} items={items} />
      ) : (
        <Typography.Text type="secondary" style={{ display: "block", marginTop: 14 }}>
          Ek profil bilgisi bulunmuyor.
        </Typography.Text>
      )}
    </Card>
  );
}

function formatLongDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Tarih bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
