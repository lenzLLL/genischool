"use client";
import { CldUploadWidget } from "next-cloudinary";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import makeAnimated from 'react-select/animated';
import { Dispatch, SetStateAction, useEffect, useState, useTransition } from "react";
import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import { createTeacher, updateTeacher } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ImageUpIcon } from "lucide-react";
import { AuthSchema } from "@/lib/schemas";
import Select from "react-select"
const TeacherForm = ({
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
    
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });
  const { subjects } = relatedData;
  
  const [img, setImg] = useState<any>();
  const [isPending,startTransition] = useTransition()
  const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
      fr:"",
      eng:""
    }
  );
  type selectSchema = {
    name:string,
    id:string
  }
  const onSubmit = handleSubmit((data) => {
      startTransition(
        ()=>{
          console.log(data);
          formAction({ ...data,subjects:finalSubjectsData,img:img? img?.secure_url:data.img,key:img? img?.public_id:data.key,newImage:(img)? true:false });      
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

  const animatedComponents = makeAnimated();
  const [finalSubjectsData,setFinalSubjectsData] = useState<selectSchema[]>([])
  const handleChangeClass = (data: selectSchema[]) => {
    setFinalSubjectsData([])
    setFinalSubjectsData(prevData => {
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
            for(let i = 0;i<data?.subjects?.length;i++)
              {
                setFinalSubjectsData((state)=>([...state,{name:data?.subjects[i]?.name,id:data.subjects[i]?.id}]))
              }  
    },[data]
  )
  return (
    <form className="flex flex-col gap-2" onSubmit={onSubmit}>

      <h1 className="text-xl font-semibold">
        {type === "create" ? user?.lang === "Français"? "Enregistrez un enseignant":"Create a teacher" : user?.lang === "Français"?"Modifier les données de l'enseignant":"Update the Teacher"}
      </h1>
      <span className="text-xs text-gray-400 mb-2 font-medium">
        {user?.lang === "Français"? 'Informations d\'authentification':'Authentication Information'}
      </span>
      <div className="flex justify-start mb-3 flex-wrap gap-4">
       
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label={user?.lang === "Français"? "Mot De Passe":"Password"}
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
      </div>
      <span className="text-xs mb-2 text-gray-400 font-medium">
        {user?.lang === "Français"? 'Informations personnelles':'Personal Informations'}
      </span>
      <div className="flex justify-between flex-wrap gap-4">
       
      <InputField
          label={user?.lang === "Français"? "Nom":"Username"}
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors?.username}
        />
        
        <InputField
          label={user?.lang === "Français"? "Numéro téléphonique":"Phone"}
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label={user?.lang === "Français"? "Adresse":"Address"}
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
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
          placeholder={user?.lang === "Français"? "Selectionnez un ou plusieurs sujets":"Select one or more subjects"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
          isMulti
            //  defaultValue={finalClassData}
          options={subjects}
          value={finalSubjectsData}
        />
        
        <div className="w-full">
           <img className="h-32 w-32 rounded-full" src = {img? img.secure_url:data?.img? data?.img:"/noAvatar.png"}/>
           <span className="mt-3 text-[#555]">Photo de profil</span>
        </div>
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
                      <ImageUpIcon/> {user?.lang === "Français"? "Importez la photo de profil":"Upload profil picture"}  
                   </label>
            );
          }}
        </CldUploadWidget>

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

export default TeacherForm;
