import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  primaryColor: "ink",
  defaultRadius: "xl",
  fontFamily: "Manrope, Inter, sans-serif",
  headings: {
    fontFamily: "Manrope, Inter, sans-serif",
    fontWeight: "700",
  },
  colors: {
    ink: [
      "#eef2ff",
      "#dfe7ff",
      "#c7d4ff",
      "#a5b7ff",
      "#7f94ff",
      "#5f74f6",
      "#4f63dd",
      "#4152ba",
      "#38479b",
      "#303c81",
    ],
  },
  other: {
    surface: "#fbfaf7",
    line: "#e8e4dc",
  },
});
