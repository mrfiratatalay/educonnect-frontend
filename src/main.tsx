import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootApp from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
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
    const backgroundColor = isDark ? "#0F172A" : "#F1F5F9";
    const textColor = isDark ? "#F1F5F9" : "#0F172A";
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
    <ErrorBoundary>
      <ThemedApp />
    </ErrorBoundary>
  </React.StrictMode>,
);
