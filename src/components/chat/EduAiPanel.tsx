import { forwardRef } from "react";
import { Button, Card, Flex, Grid, Input, Typography, theme } from "antd";
import type { InputRef } from "antd";
import {
  AudioLines,
  ChevronDown,
  Ghost,
  History,
  ImagePlus,
  Maximize2,
  Newspaper,
  Paintbrush,
  Paperclip,
  Sparkles,
} from "lucide-react";

const quickActions = [
  {
    key: "image-create",
    label: "Resim Olustur",
    prompt: "Benim icin yeni bir gorsel olustur.",
    icon: ImagePlus,
  },
  {
    key: "image-edit",
    label: "Resmi Duzenle",
    prompt: "Bir gorseli duzenlememe yardim et.",
    icon: Paintbrush,
  },
  {
    key: "latest-news",
    label: "En Son Haberler",
    prompt: "Bugunun en onemli haberlerini ozetle.",
    icon: Newspaper,
  },
] as const;

interface EduAiPanelProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onSubmit: () => void;
  onQuickAction: (value: string) => void;
  onClose?: () => void;
  onExpand?: () => void;
  showClose?: boolean;
  showExpand?: boolean;
}

const panelShadow = "0 24px 80px rgba(15, 23, 42, 0.18), 0 10px 32px rgba(15, 23, 42, 0.08)";

const triggerlessIconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 999,
  padding: 0,
} as const;

const composerBorderColor = "#C7D2E0";

const EduAiPanel = forwardRef<InputRef, EduAiPanelProps>(function EduAiPanel(
  {
    prompt,
    onPromptChange,
    onSubmit,
    onQuickAction,
    onClose,
    onExpand,
    showClose = true,
    showExpand = true,
  },
  ref,
) {
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const iconSize = screens.xs ? 16 : 17;

  return (
    <Card
      variant="outlined"
      style={{
        borderRadius: 32,
        borderColor: "#E5EAF1",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FBFCFE 100%)",
        boxShadow: panelShadow,
      }}
      styles={{
        body: {
          padding: screens.xs ? 18 : 24,
        },
      }}
    >
      <Flex align="center" justify="flex-end" gap={screens.xs ? 2 : 4}>
        <Button
          type="text"
          shape="circle"
          aria-label="Asistan modu"
          icon={<Ghost size={iconSize} />}
          style={{
            ...triggerlessIconButtonStyle,
            color: token.colorTextSecondary,
          }}
        />
        <Button
          type="text"
          shape="circle"
          aria-label="Gecmis"
          icon={<History size={iconSize} />}
          style={{
            ...triggerlessIconButtonStyle,
            color: token.colorTextSecondary,
          }}
        />
        {showExpand ? (
          <Button
            type="text"
            shape="circle"
            aria-label="Tam ekran"
            icon={<Maximize2 size={iconSize} />}
            onClick={onExpand}
            style={{
              ...triggerlessIconButtonStyle,
              color: token.colorTextSecondary,
            }}
          />
        ) : null}
        {showClose ? (
          <Button
            type="text"
            shape="circle"
            aria-label="Kapat"
            icon={<ChevronDown size={iconSize + 1} />}
            onClick={onClose}
            style={{
              ...triggerlessIconButtonStyle,
              color: token.colorText,
            }}
          />
        ) : null}
      </Flex>

      <div style={{ padding: screens.xs ? "12px 4px 8px" : "18px 12px 10px" }}>
        <Typography.Title
          level={1}
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: screens.xs ? 22 : 28,
            lineHeight: 1.12,
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: "#0F172A",
          }}
        >
          Bugun size nasil yardimci olabilirim?
        </Typography.Title>
      </div>

      <div style={{ paddingInline: screens.xs ? 0 : 6 }}>
        <div
          style={{
            minHeight: screens.xs ? 118 : 126,
            padding: screens.xs ? "14px 14px 12px" : "16px 18px 14px",
            borderRadius: 28,
            border: `1.5px solid ${composerBorderColor}`,
            background: "#FFFFFF",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Input
            ref={ref}
            value={prompt}
            onChange={(event) => onPromptChange(event.target.value)}
            onPressEnter={onSubmit}
            placeholder="Istedigini sor"
            variant="borderless"
            style={{
              padding: 0,
              fontSize: screens.xs ? 16 : 17,
              fontWeight: 500,
              color: "#475569",
            }}
          />

          <Flex align="center" justify="space-between" gap={12}>
            <Button
              type="text"
              shape="circle"
              aria-label="Dosya ekle"
              icon={<Paperclip size={18} />}
              style={{
                width: 34,
                height: 34,
                padding: 0,
                color: token.colorTextSecondary,
                flexShrink: 0,
              }}
            />

            <Flex align="center" gap={8} style={{ minWidth: 0 }}>
              <Button
                type="text"
                style={{
                  height: 36,
                  paddingInline: 10,
                  borderRadius: 999,
                  fontWeight: 700,
                  color: "#1E293B",
                  flexShrink: 0,
                }}
              >
                <Flex align="center" gap={8}>
                  <Sparkles size={15} />
                  <span>Uzman</span>
                  <ChevronDown size={15} />
                </Flex>
              </Button>

              <Button
                color="default"
                variant="solid"
                shape="circle"
                aria-label="Sesli giris"
                onClick={onSubmit}
                style={{
                  width: 42,
                  height: 42,
                  border: "none",
                  background: "#111827",
                  color: "#FFFFFF",
                  flexShrink: 0,
                }}
                icon={<AudioLines size={17} />}
              />
            </Flex>
          </Flex>
        </div>
      </div>

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
            onClick={() => onQuickAction(action.prompt)}
            style={{
              height: 40,
              paddingInline: 16,
              borderColor: "#DFE7F1",
              fontWeight: 700,
              color: "#243041",
              boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
            }}
          >
            <Flex align="center" gap={8}>
              <action.icon size={16} />
              <span>{action.label}</span>
            </Flex>
          </Button>
        ))}
      </Flex>
    </Card>
  );
});

export default EduAiPanel;
