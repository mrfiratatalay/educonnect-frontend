import { theme, type ThemeConfig } from "antd";

const sharedToken: ThemeConfig["token"] = {
  colorPrimary: "#0D9488",
  colorInfo: "#0D9488",
  colorLink: "#0F766E",
  colorSuccess: "#16A34A",
  colorWarning: "#D97706",
  colorError: "#DC2626",
  fontFamily: "Manrope, Inter, system-ui, -apple-system, sans-serif",
  fontFamilyCode: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
  borderRadius: 10,
  lineWidth: 1,
  fontSize: 14,
  wireframe: false,
};

// Light: warm slate-white, cards are pure white, layout bg slightly tinted
const lightToken: ThemeConfig["token"] = {
  colorBgBase: "#F8FAFC",
  colorBgLayout: "#F1F5F9",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBorder: "#E2E8F0",
  colorBorderSecondary: "#EEF2F7",
  colorSplit: "rgba(15, 118, 110, 0.06)",
  colorTextBase: "#0F172A",
  colorText: "#0F172A",
  colorTextSecondary: "#475569",
  colorTextTertiary: "#94A3B8",
  boxShadow:
    "0 4px 16px -4px rgba(15, 118, 110, 0.10), 0 2px 8px -2px rgba(15, 23, 42, 0.06)",
  boxShadowSecondary:
    "0 1px 4px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
  controlOutline: "rgba(13, 148, 136, 0.18)",
};

// Dark: deep navy (not black), layered depth
const darkToken: ThemeConfig["token"] = {
  colorBgBase: "#0F172A",
  colorBgLayout: "#0F172A",
  colorBgContainer: "#1E293B",
  colorBgElevated: "#263144",
  colorBorder: "#2D3F55",
  colorBorderSecondary: "#253348",
  colorSplit: "rgba(13, 148, 136, 0.12)",
  colorTextBase: "#F1F5F9",
  colorText: "#F1F5F9",
  colorTextSecondary: "#94A3B8",
  colorTextTertiary: "#5E7899",
  boxShadow:
    "0 4px 16px -4px rgba(0, 0, 0, 0.5), 0 2px 8px -2px rgba(0, 0, 0, 0.35)",
  boxShadowSecondary:
    "0 1px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
  controlOutline: "rgba(13, 148, 136, 0.22)",
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
        siderBg: isDarkMode ? "#172033" : "#F1F5F9",
        headerBg: isDarkMode ? "#1E293B" : "#FFFFFF",
        bodyBg: isDarkMode ? "#0F172A" : "#F1F5F9",
      },
      Menu: {
        itemBorderRadius: 8,
        itemMarginInline: 0,
        itemMarginBlock: 2,
        itemPaddingInline: 12,
        itemHeight: 48,
        iconSize: 22,
        fontSize: 18,
        activeBarBorderWidth: 0,
        itemSelectedBg: isDarkMode ? "rgba(13, 148, 136, 0.18)" : "rgba(13, 148, 136, 0.10)",
        itemSelectedColor: isDarkMode ? "#5EEAD4" : "#0F766E",
        itemColor: isDarkMode ? "#94A3B8" : "#475569",
        itemHoverBg: isDarkMode ? "rgba(13, 148, 136, 0.10)" : "rgba(13, 148, 136, 0.06)",
        itemHoverColor: isDarkMode ? "#5EEAD4" : "#0D9488",
        subMenuItemBg: "transparent",
        iconMarginInlineEnd: 16,
      },
      Card: {
        borderRadiusLG: 14,
        paddingLG: 20,
      },
      Button: {
        borderRadius: 8,
        controlHeight: 38,
        controlHeightLG: 46,
        controlHeightSM: 30,
        fontWeight: 600,
        colorPrimary: "#0D9488",
        colorPrimaryHover: "#0F766E",
        colorPrimaryActive: "#115E59",
        colorTextLightSolid: "#FFFFFF",
      },
      Input: {
        borderRadius: 8,
        controlHeight: 42,
      },
      Select: {
        borderRadius: 8,
        controlHeight: 42,
      },
      Modal: {
        borderRadiusLG: 14,
        contentBg: isDarkMode ? "#1E293B" : "#FFFFFF",
        headerBg: isDarkMode ? "#1E293B" : "#FFFFFF",
      },
      Drawer: {
        borderRadiusLG: 16,
      },
      Tabs: {
        itemActiveColor: isDarkMode ? "#5EEAD4" : "#0F766E",
        itemHoverColor: isDarkMode ? "#5EEAD4" : "#0D9488",
        itemSelectedColor: isDarkMode ? "#5EEAD4" : "#0F766E",
        inkBarColor: "#0D9488",
      },
    },
  };
}
