import { theme, type ThemeConfig } from "antd";

const sharedToken: ThemeConfig["token"] = {
  colorPrimary: "#1D9BF0",
  colorInfo: "#1D9BF0",
  colorLink: "#1D9BF0",
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
  colorBgLayout: "#FFFFFF",
  colorBgContainer: "#FFFFFF",
  colorBgElevated: "#FFFFFF",
  colorBorder: "#EFF3F4",
  colorBorderSecondary: "#EFF3F4",
  colorSplit: "rgba(0, 0, 0, 0.04)",
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
  colorBgBase: "#000000",
  colorBgLayout: "#000000",
  colorBgContainer: "#000000",
  colorBgElevated: "#000000",
  colorBorder: "#2F3336",
  colorBorderSecondary: "#2F3336",
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
        siderBg: "transparent",
        headerBg: isDarkMode ? "#000000" : "#FFFFFF",
        bodyBg: isDarkMode ? "#000000" : "#FFFFFF",
      },
      Menu: {
        itemBorderRadius: 9999,
        itemMarginInline: 0,
        itemMarginBlock: 2,
        itemPaddingInline: 12,
        itemHeight: 50,
        iconSize: 26,
        fontSize: 20,
        activeBarBorderWidth: 0,
        itemSelectedBg: "transparent",
        itemSelectedColor: isDarkMode ? "#FFFFFF" : "#0F1419",
        itemColor: isDarkMode ? "#E7E9EA" : "#0F1419",
        itemHoverBg: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(15, 20, 25, 0.1)",
        itemHoverColor: isDarkMode ? "#FFFFFF" : "#0F1419",
        subMenuItemBg: "transparent",
        iconMarginInlineEnd: 20,
      },
      Card: {
        borderRadiusLG: 16,
        paddingLG: 24,
      },
      Button: {
        borderRadius: 9999,
        controlHeight: 40,
        controlHeightLG: 48,
        controlHeightSM: 32,
        fontWeight: 700,
        colorPrimary: isDarkMode ? "#FFFFFF" : "#0F1419",
        colorPrimaryHover: isDarkMode ? "#E7E9EA" : "#272C30",
        colorPrimaryActive: isDarkMode ? "#D6D9DB" : "#0F1419",
        colorTextLightSolid: isDarkMode ? "#0F1419" : "#FFFFFF",
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
        contentBg: isDarkMode ? "#000000" : "#FFFFFF",
        headerBg: isDarkMode ? "#000000" : "#FFFFFF",
      },
      Drawer: {
        borderRadiusLG: 20,
      },
      Tabs: {
        itemActiveColor: isDarkMode ? "#FFFFFF" : "#0F1419",
        itemHoverColor: isDarkMode ? "#FFFFFF" : "#0F1419",
        itemSelectedColor: isDarkMode ? "#FFFFFF" : "#0F1419",
        inkBarColor: "#1D9BF0",
      },
    },
  };
}
