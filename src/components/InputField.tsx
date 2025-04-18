import { FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input"


type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  hidden?: boolean;
  placeholder?:String;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  hidden,
  inputProps,
  placeholder
}: InputFieldProps) => {
  if(type === "textarea"){
    return    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-full"}>
    <label className="text-xs text-gray-500">{label}</label>
    <textarea
      rows={5}
      {...register(name)}
      className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
      {...inputProps}
      defaultValue={defaultValue}
    />
    {error?.message && (
      <p className="text-xs text-red-400">{error.message.toString()}</p>
    )}
  </div>
  }
  return (
    <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
      <label className="text-xs text-gray-500">{label}</label>
      <input
        type={type}
        placeholder={placeholder||""}
        {...register(name)}
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
