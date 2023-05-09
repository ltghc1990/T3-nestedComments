import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { api } from "~/utils/api";

import Layout from "~/components/layout/Layout";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { data, error } = api.user.loginUser.useQuery({
    email: "ltgdrgn@gmail.com",
  });
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={true} />
      </Layout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
