"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import {
  classSchema,
  ClassSchema,
  parentSchema,
  ParentSchema,
  subjectSchema,
  SubjectSchema,
} from "@/lib/formValidationSchemas";
import {
  createClass,
  createParent,
  createSubject,
  updateClass,
  updateParent,
  updateSubject,
} from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch,useTransition, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@/lib/schemas";

const ParentForm = ({
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
  } = useForm<ParentSchema>({
    resolver: zodResolver(parentSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
  const [isPending,startTransition] = useTransition()
  const [state, formAction] = useFormState(
    type === "create" ? createParent : updateParent,
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

  const { students } = relatedData;

  return (
    <form className="flex  flex-col  gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Enregistrez un parent":"Create Parent" : user?.lang === "Français"?"Modifier les données":"Update data"}
      </h1>

      <div className="flex w-full flex-col md:flex-row md:justify-start   gap-4">
        <InputField
          label={user?.lang === "Français"? "Nom":"Name"}
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        <InputField
          label={"email"}
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        /> 
         <InputField
        label={user?.lang === "Français"? "Numéro Téléphonique":"Phone"}
        name="phone"
        defaultValue={data?.phone}
        register={register}
        error={errors?.phone}
      /> 
        </div>
        <div className="flex w-full flex-col md:flex-row md:justify-start   gap-4">
       <InputField
      label={user?.lang === "Français"? "Adresse":"Address"}
      name="address"
      defaultValue={data?.address}
      register={register}
      error={errors?.address}
    />
     <InputField
          label={user?.lang === "Français"? "Mot De Passe":"Password"}
          name="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
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

export default ParentForm;
