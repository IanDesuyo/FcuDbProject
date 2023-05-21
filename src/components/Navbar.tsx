import Link from "next/link";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

type Props = {
  userId: string;
};

const Navbar: React.FC<Props> = ({ userId }) => {
  const { status, data: sessionData } = useSession();
  const { data } = api.user.info.useQuery(userId);

  const router = useRouter();

  return (
    <header className="px-4 py-2">
      <div className="navbar rounded-box bg-base-300 shadow-xl">
        <div className="flex-1">
          <Link className="btn-ghost btn text-xl normal-case" href="/">
            {data?.website_title || "某人的網站"}
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              {status === "authenticated" &&
              sessionData.user.id === userId &&
              router.pathname.endsWith("/edit") ? (
                <Link className="btn-primary btn" href={`/${userId}`}>
                  返回
                </Link>
              ) : (
                <Link className="btn-primary btn" href={`/${userId}/edit`}>
                  修改
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
