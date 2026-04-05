import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootApp from "./App";
import { getAntdTheme } from "./theme/antdTheme";
import { useThemeStore } from "./store/themeStore";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ThemedApp() {
  const isDark = useThemeStore((state) => state.isDark);

  useLayoutEffect(() => {
    const themeName = isDark ? "dark" : "light";
    const backgroundColor = isDark ? "#000000" : "#FFFFFF";
    const textColor = isDark ? "#F3F4F6" : "#111827";
    const root = document.getElementById("root");

    document.documentElement.dataset.theme = themeName;
    document.documentElement.style.backgroundColor = backgroundColor;
    document.documentElement.style.colorScheme = themeName;
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
    document.body.style.colorScheme = themeName;

    if (root) {
      root.style.backgroundColor = backgroundColor;
    }
  }, [isDark]);

  return (
    <ConfigProvider theme={getAntdTheme(isDark)}>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RootApp />
          </BrowserRouter>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemedApp />
  </React.StrictMode>,
);
