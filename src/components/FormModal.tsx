"use client";

import {
  deleteAnnouncement,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteLesson,
  deleteParent,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";
import SchoolYearForm from "./forms/schoolYear";
import Announcements from "./Announcements";
import { getCurrentUser } from "@/lib/functs";
import { AuthSchema } from "@/lib/schemas";
import { School, User } from "lucide-react";
import { string } from "zod";

const deleteActionMap = {
//   subject: deleteSubject,
//   school:deleteSubject,
//   schoolyear:deleteSubject,
//   class: deleteClass,
//   teacher: deleteTeacher,
//   student: deleteStudent,
//   exam: deleteExam,
// // TODO: OTHER DELETE ACTIONS
//   parent: deleteSubject,
//   lesson: deleteLesson,
//   assignment: deleteSubject,
//   result: deleteSubject,
//   attendance: deleteSubject,
  attendance:deleteSubject,
  result:deleteSubject,
  assignment:deleteSubject,
  lesson:deleteSubject,
  parent:deleteParent,
  exam:deleteSubject,
  student:deleteSubject,
  teacher:deleteSubject,
  class:deleteClass,
  school:deleteSubject,
  schoolyear:deleteSubject,
  subject:deleteSubject,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

// USE LAZY LOADING

// import TeacherForm from "./forms/TeacherForm";
// import StudentForm from "./forms/StudentForm";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>
});
 const ClassForm = dynamic(() => import("./forms/ClassForm"), {
   loading: () => <h1>Loading...</h1>,
 });
 const SchoolForm = dynamic(() => import("./forms/schoolForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"), {
  loading: () => <h1>Loading...</h1>,
}
);
const LessonForm = dynamic(() => import("./forms/lessonForm"), {
  loading: () => <h1>Loading...</h1>,
}
);

const ExamForm = dynamic(() => import("./forms/examenForm"), {
  loading: () => <h1>Loading...</h1>,
})
const ParentForm = dynamic(()=>import("./forms/parentForm"),{loading:()=><h1>Loading...</h1>})

// const ExamForm = dynamic(() => import("./forms/ExamForm"), {
//   loading: () => <h1>Loading...</h1>,
// });
// TODO: OTHER FORMS

const forms: {
  [key: string]: (
    setOpen: Dispatch<SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    relatedData?: any,
    user?:AuthSchema
  ) => JSX.Element;
} = {
  subject: (setOpen, type, data, relatedData,user) => (
    <SubjectForm
      type={type}
      data={data}
      user = {user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
   class: (setOpen, type, data, relatedData,user) => (
     <ClassForm
       type={type}
       data={data}
       user={user}
       setOpen={setOpen}
       relatedData={relatedData}
    />
   ),
   teacher: (setOpen, type, data, relatedData,user) => (
     <TeacherForm
       type={type}
       data={data}
       user={user}
       setOpen={setOpen}
       relatedData={relatedData}
     />
   ),
   student: (setOpen, type, data, relatedData,user) => (
     <StudentForm
       type={type}
       data={data}
       user={user}
       setOpen={setOpen}
       relatedData={relatedData}
     />
   ),
   school: (setOpen, type, data, relatedData,user) => (
    <SchoolForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  schoolyear: (setOpen, type, data, relatedData,user) => (
    <SchoolYearForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  )
  ,
  announcement:(setOpen, type, data, relatedData,user) => (
    <AnnouncementForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  event:(setOpen, type, data, relatedData,user) => (
    <EventForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  lesson:(setOpen, type, data, relatedData,user) => (
    <LessonForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  ),
  exam:(setOpen, type, data, relatedData,user) => (
    <ExamForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  )
  ,
  parent:(setOpen, type, data, relatedData,user) => (
    <ParentForm
      type={type}
      data={data}
      user={user}
      setOpen={setOpen}
      relatedData={relatedData}
    />
  )
  // exam: (setOpen, type, data, relatedData) => (
  //   <ExamForm
  //     type={type}
  //     data={data}
  //     setOpen={setOpen}
  //     relatedData={relatedData}
  //   />
  //   // TODO OTHER LIST ITEMS
  // ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
  classes,
  user
}: FormContainerProps & { relatedData?: any,classes?:Array<any>,user:AuthSchema }) => {
  
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
      fr:"",
      eng:""
    });

    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast(`${user?.lang === "Français"?"La donnée a été supprimée": "Data has been deleted"}!`);
        setOpen(false);
        router.refresh();
      }
    }, [state, router]);

    return(
      <div className="">
   {  type === "delete" && id ? (
      <form action={formAction} className="p-4 overflow-hidden flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          {user.lang === "Français"? `Êtes-vous sûr de vouloir supprimer cette donnée ?`:`Are you sure you want to delete this data?`}
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
         {user.lang === "Français"? "Supprimer": 'Delete'}
        </button>
      </form>
    ) : (type === "create" || type === "update") ? (
       forms[table](setOpen, type, data, relatedData? relatedData:{d:classes},user={...user})
    ) : (
      "Form not found!"
    )}
  </div>)  
  };
  
 if(!user){
  return
 }
  return (
    
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen !overflow-hidden h-screen fixed left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 overflow-hidden rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
