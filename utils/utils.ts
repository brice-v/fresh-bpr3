import { loadSync } from "std/dotenv/mod.ts";
import type { AppRouter } from "../router.ts";
import { createTRPCClient } from "@trpc/client";
import { EnvVars } from "./constants.ts";

export const getBaseUrl = (req: Request): string => {
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

export const trpc = createTRPCClient<AppRouter>({
  url: "/api/trpc",
});

export const ENV = loadSync();

export const isDevMode = (): boolean => {
  return !!ENV[EnvVars.BprDevMode];
};
