import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const Skills: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.skills.useQuery(userId);

  return (
    <div>
      <h3 className=" text-2xl">專長</h3>
      <div className="divider my-0"></div>

      <div className="flex flex-col gap-2">
        {data?.map((skill) => (
          <p key={skill.id}>{skill.skill} ({skill.skill_en})</p>
        ))}
      </div>
    </div>
  );
};

export default Skills;
