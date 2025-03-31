"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, use, useEffect, useState,useTransition } from "react";
import {
  studentSchema,
  StudentSchema,
  teacherSchema,
  TeacherSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createStudent,
  createTeacher,
  updateStudent,
  updateTeacher,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { CldUploadWidget } from "next-cloudinary";
import { ImageUpIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import { Parent, Prisma } from "@prisma/client";
import { AuthSchema } from "@/lib/schemas";
import Select from "react-select"
import makeAnimated from 'react-select/animated';

const StudentForm = ({
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
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });
  type selectSchema = {
    username:string,
    id:string
  }
  type selectSchema2 = {
    name:string,
    id:string
  }
  const [img, setImg] = useState<any>();
  const [searchTerm,setSearchTerm] = useState<string>()
  const [ps,setParents] = useState<Parent[]>([])
  const [isPending,startTransition] = useTransition()
  const [loadingParents,setLoadingParents] = useState<boolean>(false)
  const animatedComponents = makeAnimated();
  const [parent,setParent] = useState<selectSchema>()
  const [classe,setClasse] = useState<selectSchema2>()
  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
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
            formAction({ ...data,...(parent?.id && {parentId:parent.id}),classId:classe?.id,img:img? img?.secure_url:data.img,key:img? img?.public_id:data.key,newImage:(img)? true:false  });
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

  const {classes,parents } = relatedData;

  const getAllParent =  () => {       
        setLoadingParents(true)
        if(searchTerm){
          let r = []
          for(let i = 0;i<parents.length;i++){
            if(parents[i].username.toLowerCase().includes(searchTerm.toLowerCase())){
                r.push({...parents[i]})
            }
          }
          setParents(r)
        } 
        else{
          setParents(parents)
        }   
        setTimeout(() => {
          console.log("Une seconde s'est écoulée. Exécution du code !");
          setLoadingParents(false)
          // Placez ici le code à exécuter après l'attente
      }, 1000); 
        // }
        //   const p = await prisma.parent.findMany()
        //   setParents(p)
  }

  useEffect(
    ()=>{
        getAllParent() 
    },[]
  )
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
      {type === "create" ? user?.lang === "Français"? "Enregistrez un étudiant":"Create a student" : user?.lang === "Français"?"Modifier les données de l'étudiant":"Update the Student"}
       
      </h1>
      <span className="text-xs text-gray-400  font-medium">
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
          label={user?.lang === "Français"? "Matricule":"Registration Number"}
          name="matricule"
          defaultValue={data?.matricule}
          register={register}
          error={errors?.matricule}
        />
        <InputField
          label={user?.lang === "Français"?"Mot De Passe":"Password"}
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />

      </div>
      <span className="text-xs text-gray-400 font-medium">
          {user?.lang === "Français"? 'Informations personnelles':'Personal Informations'}
      </span>
    
    
      <div className="flex justify-start flex-wrap gap-4">
        
        
        <InputField
          label={user?.lang === "Français"?"Nom étudiant":"Student name"}
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label={user?.lang === "Français"?"Contact":"Phone"}
          name="phone"
          placeholder={"Ex: +237671434007"}
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label={user?.lang === "Français"?"Adresse":"Address"}
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

        {
          data && (
            <InputField        
            label="Id"
            name="key"
            defaultValue={data?.imgKey}
            register={register}
            hidden/>
          )
        }

      
        <div className="flex flex-col justify-center gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">{user?.lang === "Français"?"Sexe":"Sex"}</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">{user?.lang === "Français"?"Masculin":"Male"}</option>
            <option value="FEMALE">{user?.lang === "Français"?"Féminin":"Female"}</option>
          </select>
        </div>
    

        <div>
           <img className="h-16 w-16 rounded-full" src = {img? img.secure_url:data?.img? data?.img:"/noAvatar.png"}/>
        </div>        
      </div>
     
      <Select
          onChange={(data:any)=>setClasse(data)}
          className="flex-1"
          getOptionLabel ={(classes:{name:string,id:string})=>classes.name}
          getOptionValue={(name:{name:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Classe":"Class"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
            //  defaultValue={finalClassData}
          options={classes}
          value={classe}
        />
      <Select
          onChange={(data:any)=>setParent(data)}
          className="w-full"
          getOptionLabel ={(classes:{username:string,id:string})=>classes.username}
          getOptionValue={(name:{username:string,id:string})=>name.id}
          placeholder={user?.lang === "Français"? "Selectionnez un parent":"Select one parent"}   
          closeMenuOnSelect={false}
          components={animatedComponents}
            //  defaultValue={finalClassData}
          options={parents}
          value={parent}
        />
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
                      <ImageUpIcon/> {user?.lang === "Français"?"Importez la photo de profil":"Upload profil picture"}
              </label>
            );
          }}
        </CldUploadWidget>
        <button disabled={isPending} className={`bg-blue-400 text-white flex items-center justify-center p-2 rounded-md ${isPending && "opacity-50"}`}>
        {!isPending && (type === "create"? user?.lang === "Français"? "Créer":"Create" : user?.lang === "Français"?"Modifer":"Update")}
        {isPending &&    
            < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
         }
      </button>
    </form>
  );
};

export default StudentForm;
