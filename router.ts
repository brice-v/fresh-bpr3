import { router } from "@trpc/server";
import { z } from "zod";
import { TRPCMutation } from "./utils/constants.ts";
import { createNewPost } from "./utils/db.ts";

export const appRouter = router()
  // .query(TRPCQuery.GetPostsByUser, {
  //   input: z.object({
  //     username: z.string(),
  //   }).required(),
  //   async resolve({ input }) {
  //     const posts = await getPostsByUser(input.username);
  //   },
  // })
  .mutation(TRPCMutation.CreatePost, {
    input: z.object({
      author: z.string(),
      content: z.string().min(3).max(255),
      timestamp: z.date(),
    }).required(),
    async resolve({ input }) {
      return await createNewPost(input);
    },
  });

export type AppRouter = typeof appRouter;
