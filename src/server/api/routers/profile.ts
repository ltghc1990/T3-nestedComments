import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id }, ctx }) => {
      const currentUserId = ctx.session?.user.id;

      const profile = await ctx.prisma.user.findUnique({
        where: { id },
        select: {
          name: true,
          image: true,
          _count: { select: { followers: true, follows: true, tweets: true } },
          // run a query on the followers if there are any.
          followers:
            currentUserId == null
              ? undefined
              : { where: { id: currentUserId } },
        },
      });

      if (profile == null) return;

      return {
        name: profile.name,
        image: profile.image,
        followersCount: profile._count.followers,
        followsCount: profile._count.follows,
        tweetsCount: profile._count.tweets,
        isFollowing: profile.followers.length > 0,
      };
    }),
  toggleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.session.user.id;
      // its strange because it looks like when i click follow it goes to that persons user object and inserts the follow..

      // kind of hard to follow but here goes
      // we click follow, that persons userid gets sent as input
      // we go into that persons user object, and search for followers,
      // if our current session is in followers that means it exist
      const existingFollow = await ctx.prisma.user.findFirst({
        where: { id: input.userId, followers: { some: { id: currentUserId } } },
      });

      let addedFollow;
      if (existingFollow == null) {
        // there is no followers table, instead theres a relation that references itself inside of user
        // followers     User[]    @relation(name: "Followers")
        // follows       User[]    @relation(name: "Followers")

        await ctx.prisma.user.update({
          where: { id: input.userId },
          // use connect wich adds a row
          data: { followers: { connect: { id: currentUserId } } },
        });
        addedFollow = true;
      } else {
        await ctx.prisma.user.update({
          where: { id: input.userId },
          // removes them from the follower list
          data: { followers: { disconnect: { id: currentUserId } } },
        });
        addedFollow = false;
      }

      void ctx.revalidateSSG?.(`/profiles/${input.userId}`);
      void ctx.revalidateSSG?.(`/profiles/${currentUserId}`);
      return { addedFollow };
    }),
});
