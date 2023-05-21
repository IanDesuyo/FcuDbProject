import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const Education: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.educations.useQuery(userId);

  return (
      <div>
        <h3 className=" text-2xl">學歷</h3>
        <div className="divider my-0"></div>

        <div className="flex flex-col gap-2">
          {data?.map((education) => (
            <p key={education.id}>
              {education.school} {education.major} {education.degree}
            </p>
          ))}
        </div>
      </div>
  );
};

export default Education;