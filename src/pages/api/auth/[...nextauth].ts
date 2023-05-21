import type { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

/**
 * Rewrite the default NextAuth handler to use FCU NID login
 */
export default function auth(req: NextApiRequest, res: NextApiResponse) {
  // Handle the redirect from FCU NID
  if (
    req.method == "POST" &&
    req.headers.origin == "https://opendata.fcu.edu.tw"
  ) {
    // redirect to /api/auth/callback/fcu-nid?code=xxx
    const query = new URLSearchParams(req.query as Record<string, string>);
    const { user_code } = req.body as { user_code: string };

    query.set("code", user_code);

    return res.redirect(302, `/api/auth/callback/fcu-nid?${query.toString()}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return NextAuth(req, res, authOptions);
}
