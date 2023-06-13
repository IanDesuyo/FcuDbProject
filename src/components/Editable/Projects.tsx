import DataInput from "./DataInput";
import { type editableProjectSchema } from "~/utils/schema";
import { api } from "~/utils/api";
import { projectTypes } from "~/utils/projectType";

type Props = {
  userId: string;
};

const EditableProjects: React.FC<Props> = ({ userId }) => {
  const { data, refetch } = api.user.projects.useQuery(userId);
  const update = api.user.updateProjects.useMutation({
    onSuccess: () => refetch(),
  });
  const remove = api.user.removeProjects.useMutation({
    onSuccess: () => refetch(),
  });
  const add = api.user.addProjects.useMutation({
    onSuccess: () => refetch(),
  });

  const handleEdit = (id: number, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as unknown as typeof editableProjectSchema._type;

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
    ) as unknown as typeof editableProjectSchema._type;

    add.mutate(data);
    e.currentTarget.reset();
  };

  const isLoading = update.isLoading || remove.isLoading || add.isLoading;

  return (
    <div className="grid gap-2 rounded-xl bg-base-200 p-4 shadow-xl">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">
          論文及參與計畫
        </h2>
        <p className=" text-sm text-base-content text-opacity-60"></p>
      </div>

      <div className="flex flex-col gap-4">
        {data?.map((project) => (
          <form
            className="flex max-w-full flex-row items-end justify-between gap-4"
            key={project.id}
            onSubmit={(e) => handleEdit(project.id, e)}
            onBlur={(e) => handleEdit(project.id, e)}
          >
            <div className="flex flex-wrap gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">
                    類別
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="type"
                  className="select w-full max-w-xs"
                  defaultValue={project.type}
                >
                  {projectTypes.map((type, index) => (
                    <option key={index} value={index}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <DataInput
                name="author"
                label="作者"
                defaultValue={project.author}
                placeholder="作者"
                type="text"
                required
              />
              <DataInput
                name="release_date"
                label="發布日期"
                defaultValue={project.release_date}
                type="month"
                required
              />
              <DataInput
                name="title"
                label="標題"
                defaultValue={project.title}
                placeholder="標題"
                type="text"
                required
              />
              <DataInput
                name="journal"
                label="期刊"
                defaultValue={project.journal}
                placeholder="期刊"
                type="text"
                required
              />
              <DataInput
                name="reference"
                label="外部參考"
                defaultValue={project.reference}
                placeholder="外部參考"
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
                onClick={() => handleDelete(project.id)}
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
            <div className="flex flex-wrap gap-2">
              <div className="form-control w-full max-w-xs">
                <label className="label">
                  <span className="label-text">
                    類別
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <select
                  name="type"
                  className="select w-full max-w-xs"
                  defaultValue="-1"
                >
                  <option disabled value="-1">
                    選擇類別
                  </option>
                  {projectTypes.map((type, index) => (
                    <option key={index} value={index}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <DataInput
                name="author"
                label="作者"
                placeholder="作者"
                type="text"
                required
              />
              <DataInput
                name="release_date"
                label="發布日期"
                type="month"
                required
              />
              <DataInput
                name="title"
                label="標題"
                placeholder="標題"
                type="text"
                required
              />
              <DataInput
                name="journal"
                label="期刊"
                placeholder="期刊"
                type="text"
                required
              />
              <DataInput
                name="reference"
                label="外部參考"
                placeholder="外部參考"
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

export default EditableProjects;
