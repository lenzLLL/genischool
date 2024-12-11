"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createSubject, updateAnnouncement, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@/lib/schemas";
import Loading from "../loading";

const AnnouncementForm = ({
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
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    isDisabled,
    type === "create" ? createAnnouncement : updateAnnouncement,
    {
      success: false,
      error: false,
      fr:"",
      eng:""
    },
    
  );

  const onSubmit = handleSubmit((data) => {
    // setIsLoading(true)
    console.log(data);
    formAction(data);
    if(state.success){
      setIsDisabled(true)
    }
  //  if(state.success || state.error)
  //  {
  //      setIsLoading(true) 
  //  }
  
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`${user?.lang === "Français"? 'La donnée a été':'Subject has been'} ${type === "create" ? user?.lang === "Français"?"Créée":"created" :user?.lang === "Français"?'Modifiée': "updated"}!`);
      setOpen(false);
      setIsDisabled(true)
      router.refresh();
    }
    if (state.error) {
      toast(`${user?.lang === "Français"? state.fr:state.eng}`);
    }
  }, [state, router, type, setOpen]);
  const [isDisabled,setIsDisabled] = useState(false)
  const { classes } = relatedData;
  
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Créer une annonce":"Create an announcement" : user?.lang === "Français"?"Modifier l'annonce":"Update the Announcement"}
      </h1>
      <div className="flex justify-start flex-wrap gap-4">
      <InputField
          label={user?.lang === "Français"?"Titre":"Title"}
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label={`Date`}
          name="date"
          defaultValue={data?.date}
          register={register}
          error={errors?.date}
          type="datetime-local"
        />  
      </div>
      <div className="flex justify-between flex-wrap gap-4">
      
                   <InputField
          label="Description"
          name="description"
          type ="textarea"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
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
          <label className="text-xs text-gray-500">Classes</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classes")}
            defaultValue={data?.classes}
          >
                 {classes?.map(
              (teache: { id: string;name: string }) => (
                <option value={teache.id} key={teache.id}>
                  {teache.name}
                </option>
              )
            )}
          </select>
          {errors.classes?.message && (
            <p className="text-xs text-red-400">
              {errors.classes.message.toString()}
            </p>
          )}
        </div>
      </div>
      <button disabled={isDisabled} className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create"? user?.lang === "Français"? "Créer":"Create" : user?.lang === "Français"?"Modifer":"Update"}
      </button>
   
    </form>
  );
};

export default AnnouncementForm;
