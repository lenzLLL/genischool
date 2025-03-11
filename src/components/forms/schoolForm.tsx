"use client";
import { CldUploadWidget } from "next-cloudinary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { schoolSchema, SchoolSchema} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createSchool, createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImageUpIcon } from "lucide-react";

const SchoolForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SchoolSchema>({
    resolver: zodResolver(schoolSchema),
  });

  const [img, setImg] = useState<any>();
  const [image,setImage] = useState<any>("")
  const [state, formAction] = useFormState(
    type === "create" ? createSchool : createSchool,
    {
      success: false,
      error: false,
      msg:""
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    formAction({ ...data, img:img? img?.secure_url:data.img,key:img? img?.public_id:data.key,newImage:(img)? true:false });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`School has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);


  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new school" : "Update the school"}
      </h1>

      <div className="flex justify-start mb-3 flex-wrap gap-4">
      <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        /> 
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
          <InputField
          label="Inscription (xaf)"
          name="inscription"
          defaultValue={data?.inscription}
          register={register}
          error={errors?.inscription}
        />

<div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Category</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("type")}
            defaultValue={data?.teachers}
          >
            {["Université",'Collège'].map(
        (item)=> (
                <option
                  value={item}
                  key={item}
                
                >
                  {item}
                </option>
              )
            )}
          </select>
          </div>
        
<div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Langue</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lang")}
            defaultValue={data?.teachers}
          >
            {["Français",'Anglais'].map(
        (item)=> (
                <option
                  value={item}
                  key={item}
                
                >
                  {item}
                </option>
              )
            )}
          </select>
        
        </div>
      </div>

     
      {state.error && (
        <span className="text-red-500">{state.msg? state.msg:"Someting went wrong"}</span>
      )}
              <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (

                      <label onClick={() => open()} htmlFor='cv' className='cursor-pointer shadow-sm hover:shadow-lg flex flex-row justify-center border w-full py-[10px] items-center gap-2 px-20 bg-[#414141] text-white rounded-lg '>
                      <ImageUpIcon/> Upload logo  
                   </label>
            );
          }}
        </CldUploadWidget>

      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default SchoolForm;
