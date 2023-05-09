import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

const createPostSchema = z.object({
  title: z.string().max(256, "Max title length is 256"),
  body: z.string().min(10),
});

const getSinglePost = z.object({
  postId: z.string().uuid(),
});

export type createPostSchema = z.TypeOf<typeof createPostSchema>;

// createpost should be a private procedure since you need to be a valid user inorder to post
export const postRouter = createTRPCRouter({
  createPost: publicProcedure
    .input(createPostSchema)
    .mutation(({ input, ctx }) => {
      const post = ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.user.id
            }
          },
        },
      });
    }),
  // posts: publicProcedure.input().query(),
  // singlePost: publicProcedure.input().query(),
});
