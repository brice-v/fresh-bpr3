import type { AppRouter } from "../router.ts";
import { createTRPCClient } from "@trpc/client";

export const getBaseUrl = (req: Request): string => {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

export const trpc = createTRPCClient<AppRouter>({
  url: "/api/trpc",
});
