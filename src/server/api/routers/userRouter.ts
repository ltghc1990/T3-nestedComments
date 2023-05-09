import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import * as trpc from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sendLoginEmail } from "~/utils/mailer";

import { getBaseUrl } from "~/utils/api";
import { encode } from "~/utils/base64";

const url = getBaseUrl();
// need to import the type from our prisma model

const createUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type createUserInput = z.TypeOf<typeof createUserSchema>;

const requestOtpSchema = z.object({
  email: z.string().email(),
  redirect: z.string().default("/"),
});

export type requestOtpSchema = z.TypeOf<typeof requestOtpSchema>;

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

  requestOtp: publicProcedure
    .input(requestOtpSchema)
    .mutation(({ input, ctx }) => {
      const { email, redirect } = input;

      const user = ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // create logintoken
      const token = ctx.prisma.loginToken.create({
        data: {
          redirect,
          // connect the user with the logintoken
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      // send email to user
      sendLoginEmail({
        email: email,
        url: url,
        token: encode(`${token.id}:${user.email}`),
      });

      return true;
    }),

  loginUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .query(({ input, ctx }) => {
      const { email } = input;
      const user = ctx.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),
});
