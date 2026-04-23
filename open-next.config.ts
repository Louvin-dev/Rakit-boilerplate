import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

// Dispatch-namespace workers can't self-reference service bindings or
// Durable Object classes easily. Use "dummy" for caches/queues so the
// generated Worker doesn't export DO classes that require bindings.
export default defineCloudflareConfig({
  incrementalCache: undefined,
  tagCache: undefined,
  queue: undefined,
});
