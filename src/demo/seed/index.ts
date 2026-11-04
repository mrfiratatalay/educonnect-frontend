import { createChatSessions, createConversations, createNotifications } from "@/demo/seed/inbox";
import { createDiscounts, createEvents, createProducts } from "@/demo/seed/campus";
import { categories, createFollows, createUsers, universities } from "@/demo/seed/people";
import { createGroups, createPosts } from "@/demo/seed/social";
import { nowIso } from "@/demo/time";
import type { DemoDb } from "@/demo/types";

export const DEMO_DB_VERSION = 1;

/** Builds a fresh demo database with every date relative to now. */
export function createSeed(): DemoDb {
  return {
    version: DEMO_DB_VERSION,
    anchorAtUtc: nowIso(),
    sessionUserId: null,
    universities: universities.map((item) => ({ ...item })),
    categories: categories.map((item) => ({ ...item })),
    users: createUsers(),
    follows: createFollows(),
    groups: createGroups(),
    posts: createPosts(),
    events: createEvents(),
    products: createProducts(),
    discounts: createDiscounts(),
    notifications: createNotifications(),
    conversations: createConversations(),
    chatSessions: createChatSessions(),
  };
}
