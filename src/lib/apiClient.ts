import axios from "axios";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5160";

/**
 * Every feature module creates its HTTP client here. In the demo build the
 * client gets an in-browser adapter that answers with the same contract as the
 * ASP.NET Core API, so screens run unchanged in both modes.
 */
export function createApiClient() {
  const client = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
  });

  if (__DEMO_MODE__) {
    client.defaults.adapter = async (config) => {
      const { handleDemoRequest } = await import("@/demo/adapter");
      return handleDemoRequest(config);
    };
  }

  return client;
}
