import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { tutorialRouter } from "./routers/Tutorial";
import { userRouter } from "./routers/userRouter";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  tutorial: tutorialRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
