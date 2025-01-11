"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { announcementSchema, AnnouncementSchema, examSchema, ExamSchema, lessonSchema, LessonSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createExam, createLessons, createSubject, updateAnnouncement, updateExam, updateLesson, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction,useTransition, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import makeAnimated from 'react-select/animated';
import Select from "react-select"
import { AuthSchema } from "@/lib/schemas";
const ExamForm = ({
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
  } = useForm<ExamSchema>({
    resolver: zodResolver(examSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
  type selectSchema = {
    name:string,
    id:string
  }
  type selectSchema2 = {
    username:string,
    id:string
  }
  type selectSchema3 = {
    type:string,
    id:string,
    order:Number
  }
  type selectSchema4 = {
    type:string,
    id:string,
    order:Number,
    mestreId:string
  }
  type selectSchema5 = {
    id:string,
    title:string
  }
  const [state, formAction] = useFormState(
    type === "create" ? createExam : updateExam,
    {
      success: false,
      error: false,
      eng:"",
      fr:""
    }
  );
  useEffect(() => {
    if (state.success) {
      toast(`${user?.lang === "Français"? 'La donnée a été':'Data has been'} ${type === "create" ? user?.lang === "Français"?"Créée":"created" :user?.lang === "Français"?'Modifiée': "updated"}!`);
      setOpen(false);
      startTransition(()=>{  
      })
      router.refresh();
    }
    if (state.error) {
      startTransition(()=>{  
      })
      toast(`${user?.lang === "Français"? state.fr:state.eng}`);
    }
  }, [state, type, setOpen]);
  const [isPending,startTransition] = useTransition()
  const onSubmit = handleSubmit((data) => {
      startTransition(
        ()=>{
            formAction({...data,subjectId:finalSubjectsData?.id,classes:finalClassesData,sessionId:session?.id,teacherId:finalTeacherData?.id});
              
        }
      )
  });
  const animatedComponents = makeAnimated();
  const router = useRouter();
  const [finalSubjectsData,setFinalSubjectsData] = useState<selectSchema>()
  const [finalTeacherData,setFinalTeacherData] = useState<selectSchema2>()
  const [finalClassesData,setFinalClassesData] = useState<selectSchema[]>([])
  const [sessionSequencesFilter,setSessionSequencesFilter] = useState<selectSchema4[]>([])
  const [sessionSequence,setSessionSequence] = useState<selectSchema4>()
  const [mestre,setMestre] = useState<selectSchema3>()
  const [session,setSession] = useState<selectSchema5>()
  const [sessionsFilter,setSessionsFilter] = useState<selectSchema5[]>()
  const { classes,teachers,subjects,sessions,mestres,sessionSequences } = relatedData;
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
  const mesterRender = (mester:string) =>{
      let msg = ""
      if(mester === "Semestre"){
        if(user?.lang === "Français"){
            msg = "Semestre"
        }
        else{
            msg = "Semester"
        }
      }
      else{
       if(user?.lang === "Français"){
          msg = "Trimestre"
       }
       else{
          msg = "Trimester"
       } 
      }
      return msg
  }
  const handleMestre = (value:selectSchema3) => {
      setMestre(value)
      for(let i = 0;i<sessionSequences.length;i++){
          if(sessionSequences[i].mestreId === value.id){
              setSessionSequence({type:sessionSequences[i]?.type,id:sessionSequences[i]?.id,order:sessionSequences[i]?.order,mestreId:sessionSequences[i]?.id})
              break;  
          }  
      }
  }
  useEffect(
    ()=>{
      
        if(!mestre){
          return
        }
        setSessionSequencesFilter(sessionSequences.filter((ss:any)=>ss?.mestreId === mestre?.id))
    },[sessionSequences,mestre]
  )
  useEffect(
    ()=>{
      
        if(!sessionSequence){
          return
        }
        setSessionsFilter(sessions.filter((ss:any)=>ss?.sessionSequenceId === sessionSequence?.id))
    },[sessionSequence]
  )
  useEffect(
    ()=>{
        setFinalSubjectsData({id:data?.subject?.id as string,name:data?.subject.name as string})
        setFinalTeacherData({id:data?.teacher?.id as string,username:data?.teacher.username as string})
        for(let i = 0;i<data?.classes?.length;i++)
        {  
            setFinalClassesData([...finalClassesData,{id:data?.subject?.id as string,name:data?.subject.name as string}])
        }
        setMestre({type:data?.session?.sessionSequence?.mestre?.type as string,id: data?.session?.sessionSequence?.mestre?.id,order:data?.session?.sessionSequence?.mestre?.order})
        setSessionSequence({type:data?.session?.sessionSequence?.type as string,id: data?.session?.sessionSequence?.id,order:data?.session?.sessionSequence?.order,mestreId:data?.session?.sessionSequence?.mestreId})
        setSession({id: data?.session?.id,title:data?.session?.title})
        
      },[data]
  )
  return (
    <form className="flex flex-col gap-8 m-auto " onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
          {type === "create" ? user?.lang === "Français"? "Enregistrer un examen":"Create a exam" : user?.lang === "Français"?"Modifier les données de l'examen":"Update the exam"}
      </h1>
      <div className="flex justify-start flex-wrap gap-4">
      <Select
          onChange={(data:any)=>setFinalSubjectsData(data)}
          className="w-full"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(classes:{name:string,id:string})=>classes.id}
          placeholder={user?.lang === "Français"? "Matière":"Subject"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
            //  defaultValue={finalClassData}
          options={subjects}
          value={finalSubjectsData}
        />
        <Select
          onChange={(data:any)=>setFinalTeacherData(data)}
          className="w-full"
          getOptionLabel ={(classes:{username:string,id:string})=>classes.username}
          getOptionValue={(name:{username:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Enseignant":"Teacher"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={teachers}
          value={finalTeacherData}
        />
        <Select
          onChange={(data:any)=>handleChangeClass(data)}
          className="w-full"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(name:{name:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Classes":"Classes"}   
          closeMenuOnSelect={false}
          isMulti
          components={animatedComponents}
          options={classes}
          value={finalClassesData}
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
                <InputField
          label="Credit"
          name="credit"
          type="number"
          defaultValue={data?.credit}
          register={register}
          error={errors?.credit}
          
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
          onChange={(data:any)=>handleMestre(data)}
          className="w-full"
          getOptionLabel ={(classes:{type:string,id:string,order:Number})=>mesterRender(classes.type)+" "+classes.order}
          getOptionValue={(name:{type:string,id:string,order:Number})=>name.id}
          placeholder={user?.lang === "Français"? mestres[0]?.type: mestres[0]?.type === "Semestre"? "Semester":"Trimester"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={mestres}
          value={mestre}
        /> 

{       sessionSequencesFilter.length >=2 && <Select
          onChange={(data:any)=>setSessionSequence(data)}
          className="w-full"
          getOptionLabel ={(classes:{type:string,id:string,order:Number})=>classes.type+" "+classes.order}
          getOptionValue={(name:{type:string,id:string,order:Number})=>name.id}
          placeholder={user?.lang === "Français"? sessionSequences[0]?.type: sessionSequences[0]?.type === "Séquence"? "Sequence":"Regular Session"}     
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={sessionSequencesFilter}
          value={sessionSequence}
        /> 
      }

      {       sessionSequence  && <Select
          onChange={(data:any)=>setSession(data)}
          className="w-full"
          getOptionLabel ={(classes:{title:string,id:string})=>classes.title}
          getOptionValue={(name:{title:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Session ":"Session"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          options={sessionsFilter}
          value={session}
        /> 
      }
 
   


        <div className="w-full md:w-1/2">
        {/* <label className="text-xs text-gray-500">{mestres[0].type === "Trimestre"? "Trimester":"Semester"}</label>
        <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            defaultValue={mestres[0].id}
          >
            {mestres.map((s: { id: number; order: number,type:string }) => (
              <option value={s.id} key={s.id}>
                {s.type === "Trimestre"? "Trimestre ":"Semestre "}{s.order}
              </option>
            ))}
          </select> */}
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


export default ExamForm