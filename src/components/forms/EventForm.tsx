"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, EventSchema, eventSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createEvent, createSubject, updateAnnouncement, updateEvent, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch,useTransition, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SelectComponents from "./selectComponents";
import { getCurrentUser } from "@/lib/functs";
import { AuthSchema } from "@/lib/schemas";

const EventForm = ({
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
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
 const currentUser = getCurrentUser()
  const [state, formAction] = useFormState(
    type === "create" ? createEvent : updateEvent,
    {
      success: false,
      error: false,
      fr:"",
      eng:""
    }
  );
  const [isPending,startTransition] = useTransition()
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

 const {d} = relatedData
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Créer un évènement":"Create an event" : user?.lang === "Français"?"Modifier l'évènement":"Update the event"}
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
          label={user?.lang === "Français"? "Heure de début":"Start time"}
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />  
         <InputField
          label={user?.lang === "Français"? "Heure de fin":"End time"}
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
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

export default EventForm;
