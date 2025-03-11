"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  classSchema,
  ClassSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createClass,
  createSubject,
  updateClass,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch,useTransition, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@/lib/schemas";

const ClassForm = ({
  type,
  data,
  setOpen,
  relatedData,
  user,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
  user?:AuthSchema
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
  const [isPending,startTransition] = useTransition()
  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
      fr:"",
      eng:""
    }
  );

  const onSubmit = handleSubmit((data) => {
      startTransition(
        ()=>{
          console.log(data);
          formAction(data);
        }
      )
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(`${user?.lang === "Français"? 'La donnée a été':'Data has been'} ${type === "create" ? user?.lang === "Français"?"Créée":"created" :user?.lang === "Français"?'Modifiée': "updated"}!`);
      setOpen(false);
      router.refresh();
    }

    if (state.error) {
      toast.error(`${user?.lang === "Français"? state.fr:state.eng}`);
    }
  }, [state, router, type, setOpen]);

  const { teachers, grades } = relatedData;

  return (
    <form className="flex  flex-col  gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Créer une sale de classe":"Create a class" : user?.lang === "Français"?"Modifier la classe":"Update the class"}
      </h1>

      <div className="flex w-full flex-col md:flex-row md:justify-start   gap-4">
        <InputField
          label={user?.lang === "Français"? "Class name":"Nom de la classe"}
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />

        {data && (
          <InputField
            label="Id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">{user?.lang === "Français"? "Superviseur":'Supervisor'}</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.teachers}
          >
            {teachers.map(
              (teacher: { id: string; username: string }) => (
                <option
                  value={teacher.id}
                  key={teacher.id}
                  selected={data && teacher.id === data.supervisorId}
                >
                  {teacher.username}
                </option>
              )
            )}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId.message.toString()}
            </p>
          )}
        </div>
       
      </div>
    
      <button disabled={isPending} className={`bg-blue-400 text-white flex items-center justify-center p-2 rounded-md ${isPending && "opacity-50"}`}>
        {!isPending && (type === "create"? user?.lang === "Français"? "Créer":"Create" : user?.lang === "Français"?"Modifer":"Update")}
        {isPending &&    
            < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
         }
      </button>
    </form>
  );
};

export default ClassForm;
