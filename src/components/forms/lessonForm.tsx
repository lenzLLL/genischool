"use client";
import makeAnimated from 'react-select/animated';
import Select from "react-select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, lessonSchema, LessonSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createLessons, createSubject, updateAnnouncement, updateLesson, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction,useTransition,useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from '@/lib/schemas';

const LessonForm = ({
  type,
  data,
  setOpen,
  relatedData,
  user
}: {
  type: "create" | "update";
  data?: any;
  user?: AuthSchema;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });
  const [state, formAction] = useFormState(
    type === "create" ? createLessons : updateLesson,
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
        formAction(data);
      }
    )
  });
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast(`${user?.lang === "Français"? 'La donnée a été':'Data has been'} ${type === "create" ? user?.lang === "Français"?"Créée":"created" :user?.lang === "Français"?'Modifiée': "updated"}!`);
      setOpen(false);
      router.refresh();
    }
    if (state.error) {
      toast(`${user?.lang === "Français"? state.fr:state.eng}`);
    }
  }, [state, router, type, setOpen]);
  const { classes,teachers,subjects } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
      {type === "create" ? user?.lang === "Français"? "Créer une leçon":"Create a lesson" : user?.lang === "Français"?"Modifier les données de la leçon":"Update the lesson"}
        
      </h1>
      <div className="flex justify-start flex-wrap gap-4">
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
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
            defaultValue={data?.subjectId}
          >
            {subjects.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
       
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId.message.toString()}
            </p>
          )}
        </div>
       
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Select classes</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classes")}
            defaultValue={data?.classes}
          >
            {classes.map((subject: { id: number; name: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.classes?.message && (
            <p className="text-xs text-red-400">
              {errors.classes.message.toString()}
            </p>
          )}
        </div>
        <div className="w-full md:w-1/2">
        <label className="text-xs text-gray-500">Select teacher</label>
        <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId}
          >
            {teachers.map((subject: { id: number; username: string }) => (
              <option value={subject.id} key={subject.id}>
                {subject.username}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId.message.toString()}
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


export default LessonForm