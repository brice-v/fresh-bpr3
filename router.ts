import { router } from "@trpc/server";
import { z } from "zod";
import { TRPCMutation, TRPCQuery } from "./utils/constants.ts";
import { createNewUser, isValidUser, login } from "./utils/db.ts";

export const appRouter = router().query(TRPCQuery.Login, {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  async resolve({ input }) {
    return await login(input.username, input.password);
  },
}).query(TRPCQuery.IsValidUser, {
  input: z.object({
    username: z.string(),
    auth: z.string(),
  }),
  async resolve({ input }) {
    return await isValidUser(input.username, input.auth);
  },
}).mutation(TRPCMutation.CreateUser, {
  input: z.object({
    username: z.string(),
    password: z.string(),
  }),
  async resolve({ input }) {
    await createNewUser(input.username, input.password);
  },
});

export type AppRouter = typeof appRouter;
