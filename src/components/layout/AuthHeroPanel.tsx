import { Avatar, Card, Flex, Grid, Typography, theme } from "antd";
import { BadgePercent, BrainCircuit, GraduationCap, Users } from "lucide-react";

const heroCopy = {
  "/login": {
    eyebrow: "Akademik ve sosyal aginiz tek yerde",
    title: "Universite topluluguna hizli bir geri donus yapin.",
    subtitle:
      "Ders paylasimlari, sosyal baglantilar ve kampus odakli firsatlar tek bir akis icinde sizi bekliyor.",
  },
  "/register": {
    eyebrow: "Yeni uye kaydi",
    title: "Birkac bilgiyle EduConnect topluluguna katilin.",
    subtitle:
      "Universitenizi secin, profilinizi olusturun ve hem akademik hem sosyal akisa dogrudan baglanin.",
  },
  "/forgot-password": {
    eyebrow: "Hesap erisimi",
    title: "Hesabiniza guvenli sekilde yeniden ulasmanizi saglayin.",
    subtitle:
      "Sifre sifirlama akisi e-posta uzerinden ilerler; hesap varsa yonlendirmeler size aninda gonderilir.",
  },
} as const;

const highlights = [
  {
    icon: BrainCircuit,
    title: "AI destekli calisma akisi",
    description: "Ders, odev ve kampus sureclerini tek ekrandan daha hizli yonetin.",
  },
  {
    icon: Users,
    title: "Universite odakli topluluk",
    description: "Benzer bolumlerden ogrencilerle kolayca baglanti kurun.",
  },
  {
    icon: BadgePercent,
    title: "Ogrenci avantajlari",
    description: "Platform icindeki indirimleri ve firsatlari tek yerde takip edin.",
  },
] as const;

const stats = [
  { value: "7/24", label: "AI Asistan" },
  { value: "500+", label: "Ogrenci" },
  { value: "20+", label: "Kampus avantaji" },
] as const;

interface AuthHeroPanelProps {
  pathname: string;
}

export default function AuthHeroPanel({ pathname }: AuthHeroPanelProps) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const copy = heroCopy[pathname as keyof typeof heroCopy] ?? heroCopy["/login"];

  return (
    <Card
      variant="borderless"
      style={{
        height: "100%",
        overflow: "hidden",
        borderRadius: token.borderRadiusLG * 2,
        background: `linear-gradient(158deg, #14B8A6 0%, #0F766E 45%, #134E4A 100%)`,
        boxShadow: token.boxShadow,
        position: "relative",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 32,
          minHeight: screens.lg ? 720 : undefined,
          padding: screens.xs ? 24 : 40,
        },
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -48,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.16)",
            filter: "blur(24px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -72,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.12)",
            filter: "blur(32px)",
          }}
        />
      </div>

      <Flex vertical gap={28} style={{ position: "relative", zIndex: 1 }}>
        <Flex align="center" gap={16}>
          <Avatar
            shape="square"
            size={56}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              color: token.colorTextLightSolid,
              borderRadius: token.borderRadiusLG,
              backdropFilter: "blur(16px)",
            }}
          >
            <GraduationCap size={28} />
          </Avatar>

          <div>
            <Typography.Title
              level={3}
              style={{
                color: token.colorTextLightSolid,
                margin: 0,
              }}
            >
              EduConnect
            </Typography.Title>
            <Typography.Text
              style={{
                color: "rgba(255, 255, 255, 0.72)",
                fontSize: 14,
              }}
            >
              Universite ekosistemi icin tek platform
            </Typography.Text>
          </div>
        </Flex>

        <div>
          <Typography.Text
            strong
            style={{
              color: "rgba(255, 255, 255, 0.72)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {copy.eyebrow}
          </Typography.Text>
          <Typography.Title
            level={1}
            style={{
              color: token.colorTextLightSolid,
              fontSize: screens.xs ? 34 : 48,
              lineHeight: 1.08,
              marginBlock: "16px 18px",
            }}
          >
            {copy.title}
          </Typography.Title>
          <Typography.Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 0,
              maxWidth: 520,
            }}
          >
            {copy.subtitle}
          </Typography.Paragraph>
        </div>

        <Flex vertical gap={12}>
          {highlights.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              variant="borderless"
              style={{
                background: "rgba(255, 255, 255, 0.14)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                boxShadow: "none",
              }}
              styles={{
                body: {
                  padding: 18,
                },
              }}
            >
              <Flex align="flex-start" gap={14}>
                <Avatar
                  size={40}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    color: token.colorTextLightSolid,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} />
                </Avatar>

                <div>
                  <Typography.Text
                    strong
                    style={{
                      color: token.colorTextLightSolid,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {title}
                  </Typography.Text>
                  <Typography.Text
                    style={{
                      color: "rgba(255, 255, 255, 0.74)",
                      lineHeight: 1.6,
                    }}
                  >
                    {description}
                  </Typography.Text>
                </div>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Flex>

      <Flex wrap="wrap" gap={12} style={{ position: "relative", zIndex: 1 }}>
        {stats.map((stat) => (
          <Card
            key={stat.label}
            variant="borderless"
            style={{
              background: "rgba(255, 255, 255, 0.14)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "none",
              flex: "1 1 150px",
            }}
            styles={{
              body: {
                padding: 18,
              },
            }}
          >
            <Typography.Title
              level={3}
              style={{
                color: token.colorTextLightSolid,
                margin: 0,
              }}
            >
              {stat.value}
            </Typography.Title>
            <Typography.Text
              style={{
                color: "rgba(255, 255, 255, 0.72)",
                display: "block",
                marginTop: 4,
              }}
            >
              {stat.label}
            </Typography.Text>
          </Card>
        ))}
      </Flex>
    </Card>
  );
}
