"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import Image from "next/image";
import { Dispatch, SetStateAction, use, useEffect, useState,useTransition } from "react";
import {
  accountingSchema,
  AccountingSchema,
  attendanceSchema,
  AttendanceSchema,
  studentSchema,
  StudentSchema,
  teacherSchema,
  TeacherSchema,
} from "@/lib/formValidationSchemas";
import { useFormState } from "react-dom";
import {
  createAccounting,
  createStudent,
  createTeacher,
  updateAccounting,
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

const AccountForm = ({
  type,
  data,
  setOpen,
  user,
}: {
  type: "create" | "update";
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  user?:AuthSchema
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountingSchema>({
    resolver: zodResolver(accountingSchema),
  });

  const [img, setImg] = useState<any>();
  const [searchTerm,setSearchTerm] = useState<string>()
  const [ps,setParents] = useState<Parent[]>([])
  const [isPending,startTransition] = useTransition()
  const [loadingParents,setLoadingParents] = useState<boolean>(false)
  const animatedComponents = makeAnimated()
  const [state, formAction] = useFormState(
    type === "create" ? createAccounting : updateAccounting,
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
            formAction({...data});
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

 
  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
      {type === "create" ? user?.lang === "Français"? "Enregistrez un dépense":"Create a expense" : user?.lang === "Français"?"Modifier les données de la charge":"Update the expense"}
       
      </h1>
    
      <div className="flex justify-start mb-3 flex-wrap gap-4">
        <InputField
          label={user?.lang === "Français"?"Titre":"Title"}
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label={user?.lang === "Français"?"Montant":"Amount"}
          name="amount"
          type="number"
          defaultValue={data?.amount.toString()}
          register={register}
          error={errors?.amount}
        />
        <InputField
          label={user?.lang === "Français"? "Description":"Description"}
          name="description"
          defaultValue={data?.description}
          register={register}
          error={errors?.description}
        />
         <InputField
          label={user?.lang === "Français"? "Date":"Date"}
          name="paymentDate"
          defaultValue={data?.paymentDate}
          register={register}
          error={errors?.paymentDate}
          type="datetime-local"
        />  

      </div>
     
    
    
      <div className="flex justify-start flex-wrap gap-4">
        
        
       


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

export default AccountForm;
