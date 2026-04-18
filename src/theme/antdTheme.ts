import { theme, type ThemeConfig } from "antd";

const sharedToken: ThemeConfig["token"] = {
  colorPrimary: "#5B21B6",
  colorInfo: "#5B21B6",
  colorLink: "#7C3AED",
  colorSuccess: "#059669",
  colorWarning: "#D97706",
  colorError: "#DC2626",
  fontFamily: "Manrope, Inter, system-ui, -apple-system, sans-serif",
  fontFamilyCode: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
  borderRadius: 12,
  lineWidth: 1,
  fontSize: 14,
  wireframe: false,
};

const lightToken: ThemeConfig["token"] = {
  colorBgBase: "#FAFAF9",
  colorBgLayout: "#F5F4F2",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBorder: "#E5E2DD",
  colorBorderSecondary: "#EDE9E4",
  colorSplit: "rgba(91, 33, 182, 0.06)",
  colorTextBase: "#1C1917",
  colorText: "#1C1917",
  colorTextSecondary: "#57534E",
  colorTextTertiary: "#A8A29E",
  boxShadow:
    "0 4px 12px -2px rgba(91, 33, 182, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
  boxShadowSecondary:
    "0 1px 4px rgba(91, 33, 182, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
  controlOutline: "rgba(91, 33, 182, 0.15)",
};

const darkToken: ThemeConfig["token"] = {
  colorBgBase: "#0F0E17",
  colorBgLayout: "#0F0E17",
  colorBgContainer: "#17161F",
  colorBgElevated: "#1E1D29",
  colorBorder: "#2D2B3D",
  colorBorderSecondary: "#252333",
  colorSplit: "rgba(124, 58, 237, 0.1)",
  colorTextBase: "#F0EEF8",
  colorText: "#F0EEF8",
  colorTextSecondary: "#A09CB8",
  colorTextTertiary: "#6B6785",
  boxShadow:
    "0 4px 12px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
  boxShadowSecondary:
    "0 1px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
  controlOutline: "rgba(124, 58, 237, 0.2)",
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
        siderBg: "transparent",
        headerBg: isDarkMode ? "#17161F" : "#FFFFFF",
        bodyBg: isDarkMode ? "#0F0E17" : "#F5F4F2",
      },
      Menu: {
        itemBorderRadius: 10,
        itemMarginInline: 0,
        itemMarginBlock: 2,
        itemPaddingInline: 12,
        itemHeight: 50,
        iconSize: 22,
        fontSize: 18,
        activeBarBorderWidth: 0,
        itemSelectedBg: isDarkMode ? "rgba(124, 58, 237, 0.15)" : "rgba(91, 33, 182, 0.08)",
        itemSelectedColor: isDarkMode ? "#C4B5FD" : "#5B21B6",
        itemColor: isDarkMode ? "#C4B5FD" : "#44403C",
        itemHoverBg: isDarkMode ? "rgba(124, 58, 237, 0.08)" : "rgba(91, 33, 182, 0.05)",
        itemHoverColor: isDarkMode ? "#DDD6FE" : "#5B21B6",
        subMenuItemBg: "transparent",
        iconMarginInlineEnd: 16,
      },
      Card: {
        borderRadiusLG: 16,
        paddingLG: 20,
      },
      Button: {
        borderRadius: 10,
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        fontWeight: 600,
        colorPrimary: "#5B21B6",
        colorPrimaryHover: "#6D28D9",
        colorPrimaryActive: "#4C1D95",
        colorTextLightSolid: "#FFFFFF",
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
        borderRadiusLG: 16,
        contentBg: isDarkMode ? "#17161F" : "#FFFFFF",
        headerBg: isDarkMode ? "#17161F" : "#FFFFFF",
      },
      Drawer: {
        borderRadiusLG: 20,
      },
      Tabs: {
        itemActiveColor: isDarkMode ? "#C4B5FD" : "#5B21B6",
        itemHoverColor: isDarkMode ? "#C4B5FD" : "#5B21B6",
        itemSelectedColor: isDarkMode ? "#C4B5FD" : "#5B21B6",
        inkBarColor: "#7C3AED",
      },
    },
  };
}
