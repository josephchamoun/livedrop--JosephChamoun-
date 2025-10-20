/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SSEOptions {
  onMessage?: (data: any) => void;
  onError?: (err: any) => void;
}

/**
 * Connects to an SSE (Server-Sent Events) endpoint.
 * Automatically parses JSON messages.
 * Returns a function you can call to close the connection.
 */
export function connectSSE(url: string, options: SSEOptions = {}) {
  console.log("🔗 Connecting to SSE:", url);
  const evtSource = new EventSource(url);

  evtSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("📨 SSE message:", data);
      options.onMessage?.(data);
    } catch (err) {
      console.error("❌ Failed to parse SSE data:", err);
    }
  };

  evtSource.onerror = (err) => {
    console.error("⚠️ SSE error:", err);
    options.onError?.(err);
    evtSource.close();
  };

  return () => {
    console.log("🔌 SSE connection closed");
    evtSource.close();
  };
}
