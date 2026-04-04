import "antd/dist/antd.css";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootApp from "./App";
import { getAntdTheme } from "./theme/antdTheme";
import { mantineTheme } from "./theme/mantineTheme";
import "./index.css";

const darkModeEnabled = localStorage.getItem("educonnect-dark-mode") === "true";

if (darkModeEnabled) {
  document.documentElement.classList.add("dark");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={getAntdTheme(darkModeEnabled)}>
      <AntdApp>
        <MantineProvider
          theme={mantineTheme}
          defaultColorScheme={darkModeEnabled ? "dark" : "light"}
        >
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <RootApp />
            </BrowserRouter>
          </QueryClientProvider>
        </MantineProvider>
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>,
);
