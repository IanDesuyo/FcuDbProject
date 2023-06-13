import { useMemo } from "react";
import { api } from "~/utils/api";
import getProjectType from "~/utils/projectType";

type Props = {
  userId: string;
};

const Projects: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.projects.useQuery(userId);

  const groupData = useMemo(
    () =>
      data?.reduce((acc, cur) => {
        if (acc[cur.type]) {
          // eslint-disable-next-line
          // @ts-ignore
          acc[cur.type].push(cur);
        } else {
          acc[cur.type] = [cur];
        }
        return acc;
      }, {} as Record<number, typeof data>),
    [data]
  );

  return (
    <div>
      <h3 className=" text-2xl">論文及參與計畫</h3>
      <div className="divider my-0"></div>

      <div className="flex flex-col gap-2">
        {groupData &&
          Object.entries(groupData).map(([key, data]) => (
            <div key={key} className="collapse pl-4">
              <input type="checkbox" defaultChecked />
              <div className="collapse-title p-0">
                <h4 className="text-xl">
                  {getProjectType(key)} ({data.length})
                </h4>
                <div className="divider my-0"></div>
              </div>

              <div className="collapse-content p-0">
                {data?.map((project) => (
                  <p key={project.id}>
                    <span>
                      {`${project.author} (${project.release_date}). `}
                    </span>
                    <span className="font-bold text-blue-500">{`"${project.title}". `}</span>
                    <span>{`${project.journal} ${project.reference}`}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Projects;
