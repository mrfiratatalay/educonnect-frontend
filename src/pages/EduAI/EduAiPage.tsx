import { useState } from "react";
import {
  Button,
  Card,
  Flex,
  Grid,
  Input,
  Typography,
  theme,
} from "antd";
import {
  AudioLines,
  ChevronDown,
  History,
  ImagePlus,
  Maximize2,
  Newspaper,
  Paintbrush,
  Paperclip,
  Shield,
  Sparkles,
} from "lucide-react";

const quickActions = [
  {
    key: "image-create",
    label: "Resim Olustur",
    icon: ImagePlus,
  },
  {
    key: "image-edit",
    label: "Resmi Duzenle",
    icon: Paintbrush,
  },
  {
    key: "latest-news",
    label: "En Son Haberler",
    icon: Newspaper,
  },
];

export default function EduAiPage() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const [prompt, setPrompt] = useState("");

  const isDesktop = !!screens.lg;
  const isWide = !!screens.xl;
  const pagePadding = screens.xs ? 16 : screens.lg ? 28 : 20;
  const promptWidth = isWide ? 800 : isDesktop ? 760 : "100%";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: `${pagePadding}px ${pagePadding}px ${isDesktop ? 120 : 96}px`,
        position: "relative",
      }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <Button
          type="text"
          shape="circle"
          aria-label="Tam ekran"
          style={{
            width: 36,
            height: 36,
            color: token.colorText,
          }}
          icon={<Maximize2 size={18} />}
        />

        <Flex align="center" gap={screens.xs ? 8 : 20} wrap justify="flex-end">
          <Button
            type="text"
            icon={<History size={16} />}
            style={{
              paddingInline: 0,
              fontWeight: 700,
              color: token.colorText,
            }}
          >
            Gecmis
          </Button>
          <Button
            type="text"
            icon={<Shield size={16} />}
            style={{
              paddingInline: 0,
              fontWeight: 700,
              color: token.colorText,
            }}
          >
            Ozel
          </Button>
        </Flex>
      </Flex>

      <Flex
        vertical
        align="center"
        justify="center"
        style={{
          minHeight: isDesktop ? "calc(100vh - 160px)" : "calc(100vh - 220px)",
          padding: isDesktop ? "32px 0 0" : "20px 0 0",
        }}
      >
        <EduAiWordmark />

        <Card
          variant="outlined"
          style={{
            width: promptWidth,
            maxWidth: "100%",
            marginTop: 26,
            borderRadius: 999,
            borderColor: token.colorBorderSecondary,
            boxShadow: "none",
          }}
          styles={{
            body: {
              padding: isDesktop ? "10px 12px 10px 16px" : "8px 10px 8px 12px",
            },
          }}
        >
          <Flex
            align="center"
            gap={screens.xs ? 8 : 10}
            wrap={screens.xs ? true : false}
          >
            <Button
              type="text"
              shape="circle"
              aria-label="Dosya ekle"
              icon={<Paperclip size={18} />}
              style={{
                width: 40,
                height: 40,
                color: token.colorTextSecondary,
                flexShrink: 0,
              }}
            />

            <Input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Istedigini sor"
              variant="borderless"
              style={{
                flex: 1,
                minWidth: screens.xs ? "100%" : 240,
                fontSize: screens.xs ? 18 : 19,
                fontWeight: 500,
                paddingInline: 0,
              }}
            />

            <Button
              type="text"
              style={{
                height: 40,
                paddingInline: 10,
                borderRadius: 999,
                fontWeight: 700,
                color: token.colorText,
                flexShrink: 0,
              }}
            >
              <Flex align="center" gap={8}>
                <Sparkles size={16} />
                <span>Uzman</span>
                <ChevronDown size={16} />
              </Flex>
            </Button>

            <Button
              color="default"
              variant="solid"
              shape="circle"
              aria-label="Sesli giris"
              style={{
                width: 44,
                height: 44,
                border: "none",
                background: "#111827",
                color: "#FFFFFF",
                flexShrink: 0,
              }}
              icon={<AudioLines size={18} />}
            />
          </Flex>
        </Card>

        <Flex
          align="center"
          justify="center"
          gap={12}
          wrap
          style={{ marginTop: 16 }}
        >
          {quickActions.map((action) => (
            <Button
              key={action.key}
              color="default"
              variant="outlined"
              shape="round"
              style={{
                height: 40,
                paddingInline: 16,
                fontWeight: 700,
              }}
            >
              <Flex align="center" gap={8}>
                <action.icon size={16} />
                <span>{action.label}</span>
              </Flex>
            </Button>
          ))}
        </Flex>

        {!isDesktop && (
          <div style={{ width: "100%", maxWidth: 420, marginTop: 48 }}>
            <PromoCard />
          </div>
        )}
      </Flex>

      {isDesktop && (
        <div
          style={{
            position: "fixed",
            right: 28,
            bottom: 28,
            width: 410,
            maxWidth: "calc(100vw - 340px)",
            zIndex: 12,
          }}
        >
          <PromoCard />
        </div>
      )}
    </div>
  );
}

function EduAiWordmark() {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const size = screens.xs ? 38 : 46;
  const stroke = screens.xs ? 3 : 4;

  return (
    <Flex align="center" gap={14}>
      <div
        aria-hidden
        style={{
          width: size,
          height: size,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: size * 0.16,
            borderRadius: 999,
            border: `${stroke}px solid ${token.colorText}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: size * 0.04,
            top: size * 0.45,
            width: size * 0.92,
            height: stroke,
            borderRadius: 999,
            background: token.colorText,
            transform: "rotate(-48deg)",
            transformOrigin: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: size * 0.08,
            top: size * 0.22,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: "999px 0 999px 0",
            borderTop: `${stroke}px solid ${token.colorText}`,
            borderLeft: `${stroke}px solid ${token.colorText}`,
            transform: "rotate(-18deg)",
          }}
        />
      </div>

      <Typography.Title
        level={1}
        style={{
          margin: 0,
          fontSize: screens.xs ? 32 : 44,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        EduAI
      </Typography.Title>
    </Flex>
  );
}

function PromoCard() {
  const { token } = theme.useToken();

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 24,
        borderColor: token.colorBorderSecondary,
        boxShadow: token.boxShadowSecondary,
      }}
      styles={{
        body: {
          padding: 20,
        },
      }}
    >
      <Flex align="center" justify="space-between" gap={16}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <Flex align="center" gap={10}>
            <AudioLines size={18} />
            <Typography.Title
              level={4}
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              EduAI ile konus
            </Typography.Title>
          </Flex>

          <Typography.Paragraph
            type="secondary"
            style={{
              margin: "6px 0 0",
              fontSize: 15,
              lineHeight: 1.45,
            }}
          >
            EduAI odainda daha fazla ozellige eris.
          </Typography.Paragraph>
        </div>

        <Button
          color="default"
          variant="solid"
          shape="round"
          style={{
            height: 40,
            paddingInline: 18,
            background: "#111827",
            color: "#FFFFFF",
            border: "none",
            fontWeight: 800,
          }}
        >
          Kesfet
        </Button>
      </Flex>
    </Card>
  );
}
