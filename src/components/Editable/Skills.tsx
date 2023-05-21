import DataInput from "./DataInput";
import { type editableSkillsSchema } from "~/utils/schema";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const EditableSkills: React.FC<Props> = ({ userId }) => {
  const { data, refetch } = api.user.skills.useQuery(userId);
  const update = api.user.updateSkills.useMutation({
    onSuccess: () => refetch(),
  });
  const remove = api.user.removeSkills.useMutation({
    onSuccess: () => refetch(),
  });
  const add = api.user.addSkills.useMutation({
    onSuccess: () => refetch(),
  });

  const handleEdit = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as typeof editableSkillsSchema._type;

    update.mutate({ id, ...data });
  };

  const handleDelete = (id: number) => {
    remove.mutate(id);
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as typeof editableSkillsSchema._type;

    add.mutate(data);
    e.currentTarget.reset();
  };

  const isLoading = update.isLoading || remove.isLoading || add.isLoading;

  return (
    <div className="grid gap-2 rounded-xl bg-base-200 p-4">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">專長</h2>
        <p className=" text-sm text-base-content text-opacity-60"></p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((skill) => (
          <form
            className="flex flex-row items-end justify-between gap-4"
            key={skill.id}
            onSubmit={(e) => handleEdit(skill.id, e)}
          >
            <div className="flex gap-2">
              <DataInput
                name="skill"
                label="技能"
                defaultValue={skill.skill}
                placeholder="睡覺"
                type="text"
                required
              />
              <DataInput
                name="skill_en"
                label="技能(英文)"
                defaultValue={skill.skill_en}
                placeholder="Sleep"
                type="text"
                required
              />
            </div>
            <div className="btn-group">
              <button className="btn" type="submit" disabled={isLoading}>
                修改
              </button>
              <button
                className="btn-error btn"
                onClick={() => handleDelete(skill.id)}
                type="button"
                disabled={isLoading}
              >
                刪除
              </button>
            </div>
          </form>
        ))}
      </div>

      <div className="collapse-arrow collapse my-2 rounded-lg bg-base-100">
        <input type="checkbox" />
        <button className="collapse-title text-left">新增</button>
        <div className="collapse-content">
          <form
            className="flex flex-row items-end justify-between gap-4"
            onSubmit={handleAdd}
          >
            <div className="flex gap-2">
              <DataInput
                name="skill"
                label="技能"
                placeholder="睡覺"
                type="text"
                required
              />
              <DataInput
                name="skill_en"
                label="技能(英文)"
                placeholder="Sleep"
                type="text"
                required
              />
            </div>
            <div className="btn-group">
              <button className="btn" type="submit" disabled={isLoading}>
                儲存
              </button>
              <button
                className="btn-error btn"
                type="reset"
                disabled={isLoading}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditableSkills;
