import DataInput from "./DataInput";
import { type editableEducationSchema } from "~/utils/schema";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const EditableEducation: React.FC<Props> = ({ userId }) => {
  const { data, refetch } = api.user.educations.useQuery(userId);
  const update = api.user.updateEducations.useMutation({
    onSuccess: () => refetch(),
  });
  const remove = api.user.removeEducation.useMutation({
    onSuccess: () => refetch(),
  });
  const add = api.user.addEducation.useMutation({
    onSuccess: () => refetch(),
  });

  const handleEdit = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as typeof editableEducationSchema._type;

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
    ) as typeof editableEducationSchema._type;

    add.mutate(data);
    e.currentTarget.reset();
  };

  const isLoading = update.isLoading || remove.isLoading || add.isLoading;

  return (
    <div className="grid gap-2 rounded-xl bg-base-200 p-4 shadow-xl">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">學歷</h2>
        <p className=" text-sm text-base-content text-opacity-60"></p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((education) => (
          <form
            className="flex max-w-full flex-row items-end justify-between gap-4"
            key={education.id}
            onSubmit={(e) => handleEdit(education.id, e)}
            onBlur={(e) => void handleEdit(education.id, e)}
          >
            <div className="flex gap-2">
              <DataInput
                name="school"
                label="學校"
                defaultValue={education.school}
                placeholder="逢甲大學"
                type="text"
                required
              />
              <DataInput
                name="major"
                label="科系"
                defaultValue={education.major}
                placeholder="資訊工程系"
                type="text"
                required
              />
              <DataInput
                name="degree"
                label="學位"
                defaultValue={education.degree}
                placeholder="學士"
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
                onClick={() => handleDelete(education.id)}
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
                name="school"
                label="學校"
                placeholder="逢甲大學"
                type="text"
                required
              />
              <DataInput
                name="major"
                label="科系"
                placeholder="資訊工程系"
                type="text"
                required
              />
              <DataInput
                name="degree"
                label="學位"
                placeholder="學士"
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

export default EditableEducation;
