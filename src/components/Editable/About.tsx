import DataInput from "./DataInput";
import { type editableUserSchema } from "~/utils/schema";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const EditableAbout: React.FC<Props> = ({ userId }) => {
  const { data } = api.user.info.useQuery(userId);
  const { isLoading, mutate } = api.user.updateInfo.useMutation();

  const handler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(
      formData.entries()
    ) as typeof editableUserSchema._type;

    mutate(data);

    return;
  };

  return (
    <form
      className="grid gap-2 rounded-xl bg-base-200 p-4"
      onSubmit={(e) => void handler(e)}
    >
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold">個人資料</h2>
        <p className=" text-sm text-base-content text-opacity-60">
          這裡是你的個人資料，你可以在這裡進行修改。
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        <DataInput
          name="name"
          label="姓名"
          defaultValue={data?.name}
          placeholder="李榮山"
          type="text"
          required
        />
        <DataInput
          name="email"
          label="電子郵件"
          defaultValue={data?.email}
          placeholder="example@example.com"
          type="email"
          required
        />
        <DataInput
          name="image"
          label="大頭照連結"
          defaultValue={data?.image || undefined}
          placeholder=""
          type="url"
          required
        />
        <DataInput
          name="phone"
          label="電話"
          defaultValue={data?.phone || undefined}
          placeholder="0900000000"
          type="tel"
        />
        <DataInput
          name="department"
          label="系所"
          defaultValue={data?.department}
          placeholder="資電學院"
          type="text"
          required
        />
        <DataInput
          name="major"
          label="科系"
          defaultValue={data?.major}
          placeholder="資訊工程學系"
          type="text"
          required
        />
        <DataInput
          name="position"
          label="職稱"
          defaultValue={data?.position}
          placeholder="教授"
          type="text"
          required
        />
        <DataInput
          name="bio"
          label="自我介紹"
          defaultValue={data?.bio || undefined}
          placeholder=""
          type="text"
          istextarea
        />
      </div>
      <div className="flex justify-end">
        <button className="btn-primary btn" type="submit" disabled={isLoading}>
          儲存
        </button>
      </div>
    </form>
  );
};

export default EditableAbout;
