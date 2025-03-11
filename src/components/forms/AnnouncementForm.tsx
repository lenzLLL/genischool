"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select"
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import makeAnimated from 'react-select/animated';
import { announcementSchema, AnnouncementSchema, ClassSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createAnnouncement, createSubject, updateAnnouncement, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction,useTransition, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AuthSchema } from "@/lib/schemas";

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
  type selectSchema = {
    name:string,
    id:string
  }
  // AFTER REACT 19 IT'LL BE USEACTIONSTATE
  const [finalClassData,setFinalClassData] = useState<selectSchema[]>([])
  
  const [isPending,startTransition] = useTransition()
  const [state, formAction] = useFormState(
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
    
   startTransition(
       ()=>{
            formAction({...data,classes:finalClassData});
            if(state.success){
            setIsDisabled(true)
            }
       }
   )
  //  if(state.success || state.error)
  //  {
  //      setIsLoading(true) 
  //  }
  
  });

  const router = useRouter();
  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (state.success) {
      toast.success(`${user?.lang === "Français"? 'La donnée a été':'Data has been'} ${type === "create" ? user?.lang === "Français"?"Créée":"created" :user?.lang === "Français"?'Modifiée': "updated"}!`);
      setOpen(false);
      setIsDisabled(true)
      router.refresh();
    }
    if (state.error) {
      toast.error(`${user?.lang === "Français"? state.fr:state.eng}`);
    }
  }, [state, router, type, setOpen]);
  const [isDisabled,setIsDisabled] = useState(false)
  const { classes } = relatedData;

  useEffect(
    ()=>{
         
          
            for(let i = 0;i<data?.announcementClass?.length;i++)
              {
                setFinalClassData((state)=>([...state,{name:data?.announcementClass[i]?.class?.name,id:data?.announcementClass[i]?.class?.id}]))
              }
          
         
      
        
    },[data]
  )
  const handleChangeClass = (data: selectSchema[]) => {
    setFinalClassData(prevData => {
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
      <Select
          onChange={(data:any)=>handleChangeClass(data)}
          className="w-full z-50"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(name:{name:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez une ou plusieurs écoles":"Select one or more schools"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
            //  defaultValue={finalClassData}
          options={classes}
          value={finalClassData}
        />
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
     
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
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
        </div> */}
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

export default AnnouncementForm;
