// in another file we const the router function from the trpc object to use.
// we can then create multiple routers each with their own specific queries/mutations

import { createTRPCRouter } from "../trpc";
type User = {
  id: number;
  name: string;
};

const userList: User[] = [
  { id: 0, name: "howell Chen" },
  { id: 1, name: "david Chen" },
];

// once we init our trpc we get back an object. with this object we can do .router() and give it an object with functions we want to perform when the specific keys are hit.

// procedure is also coming from the trpc object we init
// it is also an object with functions inside of it; query, mutation, subscription etc
// we select the procedure we want when our action gets called.

import { publicProcedure } from "../trpc";
// with input we want to parse the userinput and make sure its the correct shape before proceeding. here we use zod. We can then pass the input to the query with typesaftey

import { z } from "zod";

export const tutorialRouter = createTRPCRouter({
  listsUsers: publicProcedure.query(() => userList),
  getUserById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return userList.find((user) => user.id === input.id);
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      const newUser = {
        name: input.name,
        id: userList[userList.length - 1].id,
      };

      userList.push(newUser);

      return newUser;
    }),
});

// the tutorialRouter then has to be given to the trpc middleware to handle your routes.

// in this case, since we have multiple routers, we create another router and import our other router objects to combine it like soo

// export const appRouter = createTRPCRouter({
//   example: exampleRouter,
//   tutorial: tutorialRouter,
// });

// we can then type out the router allowing the frontend to know the shape of all our methods/actions
// export type AppRouter = typeof appRouter;

// go to the TutorialTRPC file for client side trpc tutorial
