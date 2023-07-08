import { router } from "@trpc/server";
import { z } from "zod";
import { Post, TRPCMutation } from "./utils/constants.ts";
import { createNewPost } from "./db/db.ts";

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
      const post: Post = {
        author: input.author,
        content: input.content,
        timestamp: input.timestamp,
      };
      return await createNewPost(post);
    },
  });

export type AppRouter = typeof appRouter;
