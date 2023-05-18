import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure.query(({ ctx }) => {
    // select param to only get selected fields from the model
    try {
      const posts = ctx.prisma.post.findMany({
        select: {
          id: true,
          title: true,
        },
      });

      return posts;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "something went wrong",
        });
      }
    }
  }),
  singlePost: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      const postId = input.postId;
      try {
        const post = ctx.prisma.post.findUnique({
          // id comes from client, find the post where the id matches
          where: {
            id: postId,
          },

          select: {
            body: true,
            title: true,
            // grab all comments from the post
            comments: {
              // filter the comments by desc order
              orderBy: {
                createdAt: "desc",
              },
              // can also select the fields we want to return from the comment table
              select: {
                id: true,
                message: true,
                parentId: true,
                createdAt: true,
                // more nested querys
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        });

        return post;
      } catch (error) {}
    }),
});

// export const testRouter = createTRPCRouter({
//   lol: publicProcedure.query(({ctx})=> {
//     const posts = ctx.prisma.post.findMany()
//   })
// })
