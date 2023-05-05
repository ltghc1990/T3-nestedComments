import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import * as trpc from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

// need to import the type from our prisma model

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

type createUserInput = z.TypeOf<typeof createUserSchema>;

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(createUserSchema)
    .mutation(({ input, ctx }) => {
      const { email, name } = input;

      // prisma modal email must have unique id, need to check if one already exist
      try {
        const user = ctx.prisma.user.create({
          data: {
            email,
            name,
          },
        });

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exist",
            });
          }

          throw new trpc.TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }
      }
    }),
});
