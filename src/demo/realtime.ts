/**
 * Stand-in for the SignalR hubs. The demo backend emits events here and the
 * same hooks that listen to /hubs/direct-messages and /hubs/notifications
 * receive them, with the same event names and payloads.
 */

// Matches the SignalR handler type used by lib/realtime.
type HubHandler = (...args: any[]) => void;

const subscriptions = new Map<string, Set<[string, HubHandler]>>();

export function subscribeToDemoHub(hubPath: string, handlers: Array<[string, HubHandler]>) {
  const set = subscriptions.get(hubPath) ?? new Set();
  subscriptions.set(hubPath, set);
  handlers.forEach((entry) => set.add(entry));
  return () => {
    handlers.forEach((entry) => set.delete(entry));
  };
}

export function emitDemoHubEvent(hubPath: string, event: string, payload: unknown) {
  subscriptions.get(hubPath)?.forEach(([name, handler]) => {
    if (name === event) {
      handler(payload);
    }
  });
}
