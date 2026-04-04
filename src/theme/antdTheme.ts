import { theme, type ThemeConfig } from "antd";

const sharedToken: ThemeConfig["token"] = {
  colorPrimary: "#5f74f6",
  colorInfo: "#5f74f6",
  colorLink: "#4f63dd",
  colorSuccess: "#3ba879",
  colorWarning: "#d3a24a",
  colorError: "#d45f75",
  fontFamily: "Manrope, Inter, sans-serif",
  fontFamilyCode: "JetBrains Mono, SFMono-Regular, Consolas, monospace",
  borderRadius: 12,
  lineWidth: 1,
};

const lightToken: ThemeConfig["token"] = {
  colorBgBase: "#fbfaf7",
  colorBgLayout: "#f8f5ef",
  colorBgContainer: "#ffffff",
  colorBgElevated: "#ffffff",
  colorBorder: "#e8e4dc",
  colorSplit: "rgba(23, 24, 28, 0.08)",
  colorTextBase: "#17181c",
  colorText: "#17181c",
  colorTextSecondary: "#5f6677",
  colorTextTertiary: "#7f8796",
  boxShadow: "0 18px 48px rgba(20, 28, 45, 0.08)",
  boxShadowSecondary: "0 10px 28px rgba(20, 28, 45, 0.06)",
  controlOutline: "rgba(95, 116, 246, 0.18)",
};

const darkToken: ThemeConfig["token"] = {
  colorBgBase: "#12161d",
  colorBgLayout: "#0f1319",
  colorBgContainer: "#171c24",
  colorBgElevated: "#1b2230",
  colorBorder: "#2a3140",
  colorSplit: "rgba(255, 255, 255, 0.12)",
  colorTextBase: "#edf1f7",
  colorText: "#edf1f7",
  colorTextSecondary: "#b5bfd0",
  colorTextTertiary: "#919db3",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.35)",
  boxShadowSecondary: "0 12px 30px rgba(0, 0, 0, 0.28)",
  controlOutline: "rgba(127, 148, 255, 0.26)",
};

export function getAntdTheme(isDarkMode: boolean): ThemeConfig {
  return {
    algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
    cssVar: {
      prefix: "educonnect",
    },
    hashed: false,
    zeroRuntime: true,
    token: {
      ...sharedToken,
      ...(isDarkMode ? darkToken : lightToken),
    },
  };
}
