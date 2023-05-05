import React from "react";
// something about monorepo allows the trpc magic to work,

// trpc needs to be set up on the client side

// go to where the api is located for more information of how it works.

// a simplified version of what we use in the client side to access our router methods.
// the httpbatch links will batch all our api request together
// const api = createTRPCNext<AppRouter>({
//   links: [
//     httpBatchLink({
//       url: "http://localhost:3000/trpc",
//     }),
//   ],
// });

import { api } from "~/utils/api";
// we can then make use of our api obj to call any of the functions we put in the router

const TutorialTRPC = () => {
  // gives us automatic type completion
  const data = api.example.hello.useQuery({ text: "howell" });
  const { data: userList } = api.tutorial.listsUsers.useQuery();

  return (
    <div>
      <h1>Tutorial for trpc</h1>
      {data.data?.greeting}
      {userList &&
        userList.map((user) => {
          return <div key={user.id}>{user.name}</div>;
        })}
    </div>
  );
};

export default TutorialTRPC;
