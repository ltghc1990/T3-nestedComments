import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCClientError } from "@trpc/client";
// should be a private proceedure since we need to chck if they are a valid user

export const commentRouter = createTRPCRouter({
  createComment: publicProcedure
    .input(
      z.object({
        postId: z.string(),
        message: z.string().min(1),
        userId: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      try {
        const newComment = ctx.prisma.comment.create({
          data: {
            ...input,
          },
        });

        return newComment;
      } catch (error) {
        console.log(error);
      }
    }),
});
