import { theme, type ThemeConfig } from "antd";

const sharedToken: ThemeConfig["token"] = {
  colorPrimary: "#6366F1",
  colorInfo: "#6366F1",
  colorLink: "#818CF8",
  colorSuccess: "#22C55E",
  colorWarning: "#F59E0B",
  colorError: "#EF4444",
  fontFamily: "Manrope, Inter, system-ui, -apple-system, sans-serif",
  fontFamilyCode: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
  borderRadius: 12,
  lineWidth: 1,
  fontSize: 14,
  wireframe: false,
};

const lightToken: ThemeConfig["token"] = {
  colorBgBase: "#FFFFFF",
  colorBgLayout: "#F7F8FA", // Çok hafif kırık beyaz (tam X gibi zifiri beyaz olmaması için)
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBorder: "#E5E7EB",
  colorBorderSecondary: "#F0F0F2",
  colorSplit: "rgba(0, 0, 0, 0.06)",
  colorTextBase: "#111827",
  colorText: "#111827",
  colorTextSecondary: "#6B7280",
  colorTextTertiary: "#9CA3AF",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  boxShadowSecondary:
    "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  controlOutline: "rgba(99, 102, 241, 0.15)",
};

const darkToken: ThemeConfig["token"] = {
  colorBgBase: "#0F1117",
  colorBgLayout: "#080A10", // Derin siyah/lacivert karışımı, salt siyah değil
  colorBgContainer: "#131620",
  colorBgElevated: "#1C1F2E",
  colorBorder: "#2A2D3E",
  colorBorderSecondary: "#21243A",
  colorSplit: "rgba(255, 255, 255, 0.08)",
  colorTextBase: "#F3F4F6",
  colorText: "#F3F4F6",
  colorTextSecondary: "#A1A7BE",
  colorTextTertiary: "#737A92",
  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.25)",
  boxShadowSecondary:
    "0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)",
  controlOutline: "rgba(129, 140, 248, 0.2)",
};

export function getAntdTheme(isDarkMode: boolean): ThemeConfig {
  return {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: {
      prefix: "edu",
    },
    hashed: false,
    token: {
      ...sharedToken,
      ...(isDarkMode ? darkToken : lightToken),
    },
    components: {
      Layout: {
        siderBg: isDarkMode ? "#161822" : "#FFFFFF",
        headerBg: isDarkMode ? "#161822" : "#FFFFFF",
        bodyBg: isDarkMode ? "#0B0D14" : "#F5F5F7",
      },
      Menu: {
        itemBorderRadius: 9999, // Pill-shape Twitter(X) stili
        itemMarginInline: 8,
        itemHeight: 52,
        activeBarBorderWidth: 0,
      },
      Card: {
        borderRadiusLG: 16,
        paddingLG: 24,
      },
      Button: {
        borderRadius: 10,
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        fontWeight: 600,
      },
      Input: {
        borderRadius: 10,
        controlHeight: 44,
      },
      Select: {
        borderRadius: 10,
        controlHeight: 44,
      },
      Modal: {
        borderRadiusLG: 20,
      },
      Drawer: {
        borderRadiusLG: 20,
      },
      Tabs: {
        itemActiveColor: isDarkMode ? "#818CF8" : "#6366F1",
        inkBarColor: isDarkMode ? "#818CF8" : "#6366F1",
      },
    },
  };
}
