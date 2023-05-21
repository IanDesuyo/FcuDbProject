import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  type DefaultUser,
} from "next-auth";
import { env } from "~/env.mjs";
import { getConnection } from "./database";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    department: string;
    major: string;
    class: string;
  }
}

type UserInfoResponse = {
  UserInfo: {
    id: string;
    name: string;
    type: string;
    classname: string;
    unit_id: string;
    unit_name: string;
    dept_id: string;
    dept_name: string;
    Email: string;
  }[];
};

type FcuNidProfile = {
  id: string;
  name: string;
  email: string;
  class: string;
  department: string;
  major: string;
  image: string;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
      }

      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
  },
  providers: [
    {
      id: "fcu-nid",
      name: "FCU NID",
      type: "oauth",
      authorization: {
        url: "https://opendata.fcu.edu.tw/fcuOAuth/Auth.aspx",
        params: {
          client_url: `${env.NEXTAUTH_URL}/api/auth/callback/fcu-nid`,
        },
      },
      token: {
        request({ params }) {
          return {
            tokens: {
              access_token: params.code,
              expires_at: new Date().getTime() + 10 * 1000, // 10 seconds
            },
          };
        },
      },
      userinfo: {
        async request({ tokens }) {
          if (!tokens.access_token) {
            return {};
          }

          const response = await fetch(
            "https://opendata.fcu.edu.tw/fcuapi/api/GetUserInfo" +
              `?client_id=${env.NID_CLIENT_ID}&user_code=${tokens.access_token}`
          );

          const { UserInfo } = (await response.json()) as UserInfoResponse;

          if (UserInfo.length !== 1 || !UserInfo[0]?.id) {
            return {};
          }

          const data = {
            id: UserInfo[0].id,
            type: UserInfo[0].type,
            name: UserInfo[0].name,
            email: UserInfo[0].Email,
            class: UserInfo[0].classname,
            department: UserInfo[0].dept_name,
            major: UserInfo[0].unit_name,
            image: `https://***REMOVED***/download_photo.aspx?file_name=${UserInfo[0].id}.jpg`,
          };

          const db = await getConnection();

          await db.execute(
            `
            INSERT IGNORE INTO users (id, name, email, image, department, major, position)
              VALUES (:id, :name, :email, :image, :department, :major, :type);
          `,
            data
          );

          await db.execute(
            `
            INSERT IGNORE INTO website (user_id, website_title)
              VALUES (:id, :websiteTitle);
            `,
            { ...data, websiteTitle: `${data.name}的網站` }
          );

          await db.commit();

          return data;
        },
      },
      profile(profile: FcuNidProfile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.image,
          department: profile.department,
          major: profile.major,
          class: profile.class,
        };
      },
      clientId: env.NID_CLIENT_ID,
    },
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
