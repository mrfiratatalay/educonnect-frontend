import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "@/features/auth/token";
import { API_BASE_URL } from "@/lib/apiClient";

// Same shape as SignalR's own handler type, so typed payload handlers fit.
type HubHandler = (...args: any[]) => void;

/** The part of a SignalR HubConnection the app uses. */
export interface RealtimeConnection {
  on(event: string, handler: HubHandler): void;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function createRealtimeConnection(hubPath: string): RealtimeConnection {
  if (__DEMO_MODE__) {
    // The demo has no server, so hub events come from an in-browser event bus.
    const handlers: Array<[string, HubHandler]> = [];
    let unsubscribe: (() => void) | null = null;

    return {
      on: (event, handler) => {
        handlers.push([event, handler]);
      },
      start: async () => {
        const { subscribeToDemoHub } = await import("@/demo/realtime");
        unsubscribe = subscribeToDemoHub(hubPath, handlers);
      },
      stop: async () => {
        unsubscribe?.();
        unsubscribe = null;
      },
    };
  }

  const base = API_BASE_URL.replace(/\/$/, "");
  return new signalR.HubConnectionBuilder()
    .withUrl(`${base}${hubPath}`, {
      accessTokenFactory: () => getAccessToken() ?? "",
      transport: signalR.HttpTransportType.WebSockets,
      skipNegotiation: true,
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .build();
}
