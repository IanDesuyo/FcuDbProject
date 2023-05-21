import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import About from "~/components/About";
import Education from "~/components/Education";
import Navbar from "~/components/Navbar";
import Skills from "~/components/Skills";
import WorkExperience from "~/components/WorkExperience";
import { api } from "~/utils/api";

const UserPage: NextPage = () => {
  const router = useRouter();

  const { userId } = router.query as { userId: string };
  const { isFetched, data } = api.user.info.useQuery(userId, {
    enabled: !!userId,
  });

  if (isFetched && !data) {
    return <p>404</p>;
  }

  return (
    <>
      <Head>
        <title>{data?.website_title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar userId={userId} />
      <main className="flex w-full justify-center">
        <div className="container px-2 flex flex-col gap-4">
          <About userId={userId} />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Education userId={userId} />
            <Skills userId={userId} />
          </div>
          <WorkExperience userId={userId} />
        </div>
      </main>
    </>
  );
};

export default UserPage;