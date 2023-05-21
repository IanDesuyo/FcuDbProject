import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const ssrSession = api.user.session.useQuery(undefined, {
    enabled: !session && typeof window === "undefined", // only fetch on server
    refetchOnWindowFocus: false,
  });

  return (
    <SessionProvider session={session || ssrSession.data}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
