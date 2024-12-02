"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "../InputField";
import { SchoolYearchema, schoolYearSchema, subjectSchema, SubjectSchema } from "@/lib/formValidationSchemas";
import { createSchoolYear, createSubject, updateSubject } from "@/lib/actions";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SchoolYearForm = ({
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
  } = useForm<SchoolYearchema>({
    resolver: zodResolver(schoolYearSchema),
  });

  // AFTER REACT 19 IT'LL BE USEACTIONSTATE

  const [state, formAction] = useFormState(
    type === "create" ? createSchoolYear : createSchoolYear,
    {
      success: false,
      error: false,
    }
  );
 const [title,setTitle] = useState("")


  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast(`School year has been ${type === "create" ? "created" : "updated"}!`);
      setOpen(false);
      router.refresh();
    }
  }, [state, router, type, setOpen]);

  const { school } = relatedData;
  const create = () =>{
    if(type === "create"){
      createSchoolYear({title:title,type:school.type,schoolId:school.id})
    }
  }
  return (
    <div className="flex flex-col gap-8" >
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new school year" : "Update the school year"}
      </h1>

      <div className="flex justify-between flex-wrap gap-4">
        <input
        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
        
        type ="text" value = {title} onChange={(e)=>setTitle(e.target.value)}/>

       
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button onClick={()=>create()} className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </div>
  );
};

export default SchoolYearForm;
