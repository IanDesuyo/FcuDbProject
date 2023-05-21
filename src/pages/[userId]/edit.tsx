import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import EditableAbout from "~/components/Editable/About";
import EditableEducation from "~/components/Editable/Education";
import EditableSkills from "~/components/Editable/Skills";
import EditableWorkExperience from "~/components/Editable/WorkExperience";
import Navbar from "~/components/Navbar";
import { api } from "~/utils/api";

const UserPage: NextPage = () => {
  const { status: authStatus, data: sessionData } = useSession();
  const router = useRouter();

  const { userId } = router.query as { userId: string };
  const { isFetched, data } = api.user.info.useQuery(userId, {
    enabled: !!userId,
  });

  if (isFetched && !data) {
    return <p>404</p>;
  }

  // if (authStatus !== "authenticated" || sessionData?.user?.id !== userId) {
  //   return <p>403</p>;
  // }

  return (
    <>
      <Head>
        <title>{data?.website_title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userId={userId} />
      <main className="flex w-full justify-center">
        <div className="container flex flex-col gap-4 px-2">
          <EditableAbout userId={userId} />
          <EditableEducation userId={userId} />
          <EditableSkills userId={userId} />
          <EditableWorkExperience userId={userId} />
        </div>
      </main>
    </>
  );
};

export default UserPage;
