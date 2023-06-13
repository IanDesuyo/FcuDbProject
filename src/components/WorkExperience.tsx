import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const WorkExperience: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.workExperience.useQuery(userId);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <h3 className=" text-2xl">校內經歷</h3>
        <div className="divider my-0"></div>

        <div className="flex flex-col gap-2">
          {data &&
            data
              .filter((x) => x.in_school)
              .map((ex) => (
                <p key={ex.id}>
                  {ex.company} ({ex.position})
                </p>
              ))}
        </div>
      </div>
      <div>
        <h3 className=" text-2xl">校外經歷</h3>
        <div className="divider my-0"></div>

        <div className="flex flex-col gap-2">
          {data &&
            data
              .filter((x) => !x.in_school)
              .map((ex) => (
                <p key={ex.id}>
                  {ex.company} ({ex.position})
                </p>
              ))}
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
