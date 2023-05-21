import Link from "next/link";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const About: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.info.useQuery(userId);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 py-4">
        <div className="w-full">
          <h2 className="text-4xl font-bold">{data?.name}</h2>
          <div className="divider my-0"></div>
          <div className="flex gap-2">
            <span>{data?.department}</span>
            <span>{data?.major}</span>
            <span>{data?.position}</span>
          </div>
        </div>

        <div className="rounded bg-base-200 p-4">
          <p className="whitespace-pre-line">{data?.bio}</p>
        </div>

        <div className="flex gap-2">
          {data?.email && (
            <Link
              className="btn-outline btn-primary btn lowercase"
              href={`mailto:${data.email}`}
            >
              信箱: {data.email}
            </Link>
          )}
          {data?.phone && (
            <Link
              className="btn-outline btn-secondary btn"
              href={`tel:${data.phone}`}
            >
              電話: {data.phone}
            </Link>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <picture className=" w-auto">
          <img
            src={data?.image || "/images/avatar.png"}
            className=" rounded-2xl"
            alt="Avatar"
          />
        </picture>
      </div>
    </div>
  );
};

export default About;
