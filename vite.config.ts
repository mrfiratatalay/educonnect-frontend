import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    plugins: [react()],
    define: {
      // Fixed at build time: when false, every demo branch and its dynamic
      // imports are removed, so the real build ships no demo code.
      __DEMO_MODE__: JSON.stringify(env.VITE_DEMO_MODE === "true"),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
