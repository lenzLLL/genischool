"use client";
import makeAnimated from 'react-select/animated';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState,useTransition } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@/lib/schemas";
import Select from "react-select"

const SubjectForm = ({
  type,
  data,
  setOpen,
  relatedData,
  user
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
  } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createSubject : updateSubject,
    {
      success: false,
      error: false,
      fr:"",
      eng:""
    }
  );
  type selectSchema = {
    username:string,
    id:string
  }
  const onSubmit = handleSubmit((data) => {
      startTransition(
        ()=>{
          formAction({...data,teachers:finalTeachersData})
        }
      )
  });
  const [isPending,startTransition] = useTransition()
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
  const { teachers } = relatedData;
  const animatedComponents = makeAnimated();
  const [finalTeachersData,setFinalTeachersData] = useState<selectSchema[]>([])
  const handleChangeClass = (data: selectSchema[]) => {
    setFinalTeachersData([])
    setFinalTeachersData(prevData => {
      // Filtrer les doublons
      const updatedData = [...prevData, ...data].filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.id === item.id // Remplacez `id` par la clé unique de votre objet
        ))
      );
      return updatedData;
    });
  };
  useEffect(
    ()=>{
            for(let i = 0;i<data?.teachers?.length;i++)
              {
                setFinalTeachersData((state)=>([...state,{username:data?.teachers[i]?.username,id:data?.teachers[i]?.id}]))
              }  
    },[data]
  )

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Enregistrez une matière":"Create a subject" : user?.lang === "Français"?"Modifier les données sur la matière":"Update the subject"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label={user?.lang === "Français"? "Nom de la matière":"Subject name"}
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
               <Select
          onChange={(data:any)=>handleChangeClass(data)}
          className="w-full"
          getOptionLabel ={(classes:{username:string,id:string})=>classes.username}
          getOptionValue={(name:{username:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez un ou plusieurs enseignants":"Select one or more tearchers"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
            //  defaultValue={finalClassData}
          options={teachers}
          value={finalTeachersData}
        />
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

export default SubjectForm;
