import { prisma } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { date, z } from "zod";
// should be a private proceedure since we need to chck if they are a valid user before doing any of the methods

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
          select: {
            id: true,
            message: true,
            parentId: true,
            createdAt: true,

            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        return newComment;
      } catch (error) {
        console.log(error);
      }
    }),

  // deleting might have some weird behavior due to its nested nature.
  // deleting a root comment will force the comments related to it to break down; a child component turns into a root lv comment; suddenly a parent id becomes null since that comment has been deleted, etc...
  deleteComment: publicProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => {
      const id = input;
      try {
        const deleted = ctx.prisma.comment.delete({
          where: {
            id,
          },
        });

        return deleted;
      } catch (error) {
        console.log(error);
      }
    }),

  editComment: publicProcedure
    .input(
      z.object({
        id: z.string(),
        message: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      const commentId = input.id;
      // our auth data exist in ctx
      // get comment id find the comment and get userid

       
      // const userId = ctx.prisma.comment.findUnique({
      //   where: {
      //     id: commentId,
      //   },
      //   select: { userId: true },
      // });

      // if (userId !== ctx.session?.user.id) {
      //   // throw error
      // }

      const updatedComment = ctx.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          message: input.message,
        },
        select: { message: true },
      });

      return updatedComment
    }),
});
