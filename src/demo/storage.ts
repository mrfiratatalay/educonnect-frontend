/** Kept tiny on purpose: the demo badge imports it without pulling in the seed data. */

export const DEMO_STORAGE_KEY = "educonnect-demo-db";

export function resetDemo() {
  try {
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // Storage may be blocked (private mode); a reload still starts from the seed.
  }
  window.location.assign("/");
}
