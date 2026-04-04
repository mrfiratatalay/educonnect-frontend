import { Card, Timeline, Typography, theme } from "antd";
import { CheckCircle2, GraduationCap, Sparkles } from "lucide-react";

export default function ProfileTimeline() {
  const { token } = theme.useToken();

  return (
    <Card 
      title="Platform Gecmisi" 
      bordered={false}
      style={{ borderRadius: 16, border: `1px solid ${token.colorBorderSecondary}` }}
    >
      <Timeline
        style={{ marginTop: 16 }}
        items={[
          {
            color: token.colorSuccess,
            dot: <CheckCircle2 size={16} color={token.colorSuccess} />,
            children: (
              <>
                <Typography.Text strong>Ilk Ilanini Yayinladi</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Kullanici guven veren saticilar arasina katildi.
                </Typography.Text>
              </>
            ),
          },
          {
            color: token.colorPrimary,
            dot: <GraduationCap size={16} color={token.colorPrimary} />,
            children: (
              <>
                <Typography.Text strong>Universite Kaydi</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Ege Universitesi olarak profilini bagladi.
                </Typography.Text>
              </>
            ),
          },
          {
            color: "gray",
            dot: <Sparkles size={16} color={token.colorTextTertiary} />,
            children: (
              <>
                <Typography.Text strong>Platforma Katildi</Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                  Aramiza hos geldin! (2024)
                </Typography.Text>
              </>
            ),
          },
        ]}
      />
    </Card>
  );
}
