import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useConversationsQuery } from "@/features/messages/hooks";
import type { ConversationSummary } from "@/features/messages/types";

const MESSAGE_SEEN_STORAGE_KEY = "educonnect:message-seen-map";

type SeenMap = Record<string, string>;

export function useUnreadMessages(enabled = true) {
  const location = useLocation();
  const conversationsQuery = useConversationsQuery(enabled);
  const conversations = conversationsQuery.data ?? [];
  const [version, setVersion] = useState(0);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === MESSAGE_SEEN_STORAGE_KEY) {
        setVersion((current) => current + 1);
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/messages") || conversations.length === 0) {
      return;
    }

    markConversationsSeen(conversations);
    setVersion((current) => current + 1);
  }, [conversations, location.pathname]);

  const unreadCount = useMemo(() => {
    const seenMap = readSeenMap();
    return conversations.filter((conversation) => {
      const seenAt = seenMap[conversation.id];
      if (!seenAt) {
        return true;
      }

      return new Date(conversation.lastMessageAtUtc).getTime() > new Date(seenAt).getTime();
    }).length;
  }, [conversations, version]);

  return {
    unreadCount,
    conversationsQuery,
  };
}

export function markConversationsSeen(conversations: ConversationSummary[]) {
  if (conversations.length === 0) {
    return;
  }

  const seenMap = readSeenMap();
  let hasChanged = false;

  for (const conversation of conversations) {
    if (seenMap[conversation.id] === conversation.lastMessageAtUtc) {
      continue;
    }

    seenMap[conversation.id] = conversation.lastMessageAtUtc;
    hasChanged = true;
  }

  if (hasChanged) {
    writeSeenMap(seenMap);
  }
}

function readSeenMap(): SeenMap {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(MESSAGE_SEEN_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsedValue = JSON.parse(rawValue);
    return parsedValue && typeof parsedValue === "object" ? parsedValue as SeenMap : {};
  } catch {
    return {};
  }
}

function writeSeenMap(value: SeenMap) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(MESSAGE_SEEN_STORAGE_KEY, JSON.stringify(value));
}
