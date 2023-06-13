import DataInput from "./DataInput";
import { type editableWorkExperienceSchema } from "~/utils/schema";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const EditableWorkExperience: React.FC<Props> = ({ userId }) => {
  const { data, refetch } = api.user.workExperience.useQuery(userId);
  const update = api.user.updateWorkExperience.useMutation({
    onSuccess: () => refetch(),
  });
  const remove = api.user.removeWorkExperience.useMutation({
    onSuccess: () => refetch(),
  });
  const add = api.user.addWorkExperience.useMutation({
    onSuccess: () => refetch(),
  });

  const handleEdit = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as typeof editableWorkExperienceSchema._type;

    data.in_school = formData.get("in_school") === "on";

    console.log(data);

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
    ) as unknown as typeof editableWorkExperienceSchema._type;

    data.in_school = formData.get("in_school") === "on";

    add.mutate(data);
    e.currentTarget.reset();
  };

  const isLoading = update.isLoading || remove.isLoading || add.isLoading;

  return (
    <div className="grid gap-2 rounded-xl bg-base-200 p-4 shadow-xl">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">經歷</h2>
        <p className=" text-sm text-base-content text-opacity-60"></p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((workExperience) => (
          <form
            className="flex max-w-full flex-row items-end justify-between gap-4"
            key={workExperience.id}
            onSubmit={(e) => handleEdit(workExperience.id, e)}
            onBlur={(e) => handleEdit(workExperience.id, e)}
          >
            <div className="flex gap-2">
              <DataInput
                name="in_school"
                label="校內經歷"
                defaultChecked={workExperience.in_school}
                type="checkbox"
                className="checkbox"
              />
              <DataInput
                name="company"
                label="公司"
                defaultValue={workExperience.company}
                placeholder="XX公司"
                type="text"
                required
              />

              <DataInput
                name="position"
                label="職位"
                defaultValue={workExperience.position}
                placeholder="老闆"
                type="text"
                required
              />
            </div>
            <div className="btn-group">
              {/* <button className="btn" type="submit" disabled={isLoading}>
                儲存
              </button> */}
              <button
                className="btn-error btn"
                onClick={() => handleDelete(workExperience.id)}
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
            className="flex max-w-full flex-row items-end justify-between gap-4"
            onSubmit={handleAdd}
          >
            <div className="flex gap-2">
              <DataInput
                name="in_school"
                label="校內經歷"
                type="checkbox"
                className="checkbox"
              />
              <DataInput
                name="company"
                label="公司"
                placeholder="XX公司"
                type="text"
                required
              />

              <DataInput
                name="position"
                label="職位"
                placeholder="老闆"
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

export default EditableWorkExperience;
