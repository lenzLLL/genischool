"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, use, useEffect, useState } from "react";
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

const StudentForm = ({
  type,
  data,
  setOpen,
  relatedData,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentSchema>({
    resolver: zodResolver(studentSchema),
  });

  const [img, setImg] = useState<any>();
  const [searchTerm,setSearchTerm] = useState<string>()
  const [ps,setParents] = useState<Parent[]>([])
  const [loadingParents,setLoadingParents] = useState<boolean>(false)
  const [state, formAction] = useFormState(
    type === "create" ? createStudent : updateStudent,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("hello");
    console.log(data);
    formAction({ ...data, img:img? img?.secure_url:data.img,key:img? img?.public_id:data.key,newImage:(img)? true:false  });
  });

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`Student has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const {classes,parents } = relatedData;

  const getAllParent =  () => {

        
        // setLoadingParents(true)
        // const query: Prisma.ParentWhereInput = {}
        // if(searchTerm){
        //   query.username = { contains: searchTerm, mode: "insensitive" };
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
        {type === "create" ? "Create a new student" : "Update the student"}
      </h1>
      <span className="text-xs text-gray-400  font-medium">
        Authentication Information
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
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors?.password}
        />
        <div>
           <img className="h-16 w-16 rounded-full" src = {img? img.secure_url:data?.img? data?.img:"/noAvatar.png"}/>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
    
    
      <div className="flex justify-start flex-wrap gap-4">
        
        
        <InputField
          label="User Name"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
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

      
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex.message.toString()}
            </p>
          )}
        </div>
    
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId}
          >
            {classes.map(
              (classItem: {
                id: number;
                name: string;
                _count: { students: number };
              }) => (
                <option value={classItem.id} key={classItem.id}>
                  {classItem.name}
                </option>
              )
            )}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
        
      </div>
      <div className="flex flex-col gap-2 w-full ">
          <label className="text-xs text-gray-500">Parent</label>
          <div className="flex gap-3">
          <input
                value={searchTerm}
                onChange={(e)=>setSearchTerm(e.target.value)}
                placeholder="type the parent's name"
                 className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            />
            <div onClick={()=>getAllParent()} className="bg-[#414141] text-white cursor-pointer py-2 px-5 rounded-md">Search</div>
          </div>
 {  !loadingParents &&       <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("parentId")}
            defaultValue={data?.parentId}
          >
            <option value = "" key ="none">
              none
            </option>
            {ps?.map(
              (classItem:{username:string,id:string}) => (
                <option value={classItem?.id} key={classItem?.id}>
                  {classItem?.username}
                </option>
              )
            )}
          </select>}
          {
            loadingParents && (
             <span>Loading</span> 
            )
          }
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId.message.toString()}
            </p>
          )}
        </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
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
                      <ImageUpIcon/> Upload profile picture  
                   </label>
            );
          }}
        </CldUploadWidget>
      <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
