"use client";
import Select from "react-select"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, lessonSchema, LessonSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createLessons, createSubject, updateAnnouncement, updateLesson, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction,useTransition,useEffect,useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from '@/lib/schemas';
import makeAnimated from 'react-select/animated';
import { getCurrentUser } from "@/lib/functs";

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
  const [finalTeacherData,setFinalTeacherData] = useState<selectSchema2>()
  const [finalSubjectData,setFinalSubjectData] = useState<selectSchema>()
  const [finalClassesData,setFinalClassesData] = useState<selectSchema[]>([])
  const animatedComponents = makeAnimated();
  type selectSchema = {
    name:string,
    id:string
  }
  type selectSchema2 = {
    username:string,
    id:string
  }
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
        formAction({...data,classes:finalClassesData,subjectId:finalSubjectData?.id,teacherId:finalTeacherData?.id});
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
  useEffect(
    ()=>{
        setFinalSubjectData({id:data?.subject?.id as string,name:data?.subject.name as string})
        setFinalTeacherData({id:data?.teacher?.id as string,username:data?.teacher.username as string})
        for(let i = 0;i<data?.classes?.length;i++)
        {  
            setFinalClassesData([...finalClassesData,{id:data?.subject?.id as string,name:data?.subject.name as string}])
        }
        // setMestre({type:data?.session?.sessionSequence?.mestre?.type as string,id: data?.session?.sessionSequence?.mestre?.id,order:data?.session?.sessionSequence?.mestre?.order})
        // setSessionSequence({type:data?.session?.sessionSequence?.type as string,id: data?.session?.sessionSequence?.id,order:data?.session?.sessionSequence?.order,mestreId:data?.session?.sessionSequence?.mestreId})
        // setSession({id: data?.session?.id,title:data?.session?.title})
        
      },[data]
  )
  const { classes,teachers,subjects } = relatedData;
  const handleChangeClass = (data: selectSchema[]) => {
    setFinalClassesData([])
    setFinalClassesData(prevData => {
      // Filtrer les doublons

      const updatedData = [...prevData, ...data].filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.id === item.id // Remplacez `id` par la clé unique de votre objet
        ))
      );
      return updatedData;
    });
  };
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
      {type === "create" ? user?.lang === "Français"? "Enregistrer une leçon":"Create a lesson" : user?.lang === "Français"?"Modifier les données de la leçon":"Update the lesson"}
        
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
        <Select
          onChange={(data:any)=>handleChangeClass(data)}
          className="w-full"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(name:{name:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez une ou plusieurs classes":"Select one or more classes"}   
          closeMenuOnSelect={false}
          isMulti
          components={animatedComponents}
          options={classes}
          value={finalClassesData}
        />
        <Select
          onChange={(data:any)=>setFinalSubjectData(data)}
          className="w-full"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(name:{name:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez un sujet":"Select one subject"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={subjects}
          value={finalSubjectData}
        />
        <Select
          onChange={(data:any)=>setFinalTeacherData(data)}
          className="w-full"
          getOptionLabel ={(classes:{username:string,id:string})=>classes.username}
          getOptionValue={(name:{username:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez un enseignant":"Select one teacher"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={teachers}
          value={finalTeacherData}
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


export default LessonForm