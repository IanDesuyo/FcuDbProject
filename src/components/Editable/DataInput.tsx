interface DataInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  istextarea?: boolean;
  isCheckbox?: boolean;
}

const DataInput: React.FC<DataInputProps> = ({ label, ...props }) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">
          {label}
          {props.required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {props.istextarea ? (
        <textarea
          className="textarea-bordered textarea w-full"
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input className="input-bordered input w-full max-w-xs" {...props} />
      )}
    </div>
  );
};

export default DataInput;
