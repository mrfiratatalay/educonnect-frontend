/// <reference types="vite/client" />

/** True only in the browser-only demo build (`npm run build:demo`). */
declare const __DEMO_MODE__: boolean;

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_DEMO_MODE?: string;
}
