import type * as signalR from "@microsoft/signalr";

/**
 * Module-level registry of active SignalR connections.
 * useEffect cleanup auth state degisikliginde tetiklenmeyebilir (ornek: AppLayout unmount sirasi yarisi varsa
 * accessTokenFactory hala eski token'i kullanir). Bu registry ile logout aninda explicit olarak stop edebiliyoruz.
 */
const activeConnections = new Set<signalR.HubConnection>();

export function registerSignalRConnection(connection: signalR.HubConnection): () => void {
  activeConnections.add(connection);
  return () => {
    activeConnections.delete(connection);
  };
}

export async function disconnectAllSignalR(): Promise<void> {
  const connections = Array.from(activeConnections);
  activeConnections.clear();
  await Promise.allSettled(connections.map((c) => c.stop()));
}
