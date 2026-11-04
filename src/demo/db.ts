import { createSeed, DEMO_DB_VERSION } from "@/demo/seed";
import { DEMO_STORAGE_KEY } from "@/demo/storage";
import { shiftDates } from "@/demo/time";
import type { DemoDb } from "@/demo/types";

const DAY_MS = 24 * 60 * 60 * 1000;

let cache: DemoDb | null = null;

function readStored(): DemoDb | null {
  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoDb) : null;
  } catch {
    return null;
  }
}

/**
 * Loads the browser copy of the demo data, or seeds it. When the visitor comes
 * back days later, every timestamp moves forward by whole days so "2 hours ago"
 * stays recent and upcoming events stay upcoming.
 */
export function getDb(): DemoDb {
  if (cache) {
    return cache;
  }
  const stored = readStored();
  if (stored && stored.version === DEMO_DB_VERSION) {
    const elapsedDays = Math.floor((Date.now() - Date.parse(stored.anchorAtUtc)) / DAY_MS);
    if (elapsedDays > 0) {
      shiftDates(stored, elapsedDays * DAY_MS);
    }
    cache = stored;
  } else {
    cache = createSeed();
  }
  saveDb();
  return cache;
}

export function saveDb() {
  if (!cache) {
    return;
  }
  try {
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Quota or private mode: the demo keeps working from memory for this tab.
  }
}

export function newId(prefix: string) {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  return `${prefix}-${random}`;
}
