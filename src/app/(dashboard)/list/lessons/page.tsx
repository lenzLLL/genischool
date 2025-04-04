import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { lessonsData, role } from "@/lib/data";
import {  getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Lesson, LessonClass, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { LessonsFilter } from "./components/filter";
import Secondpagination from "@/components/pagination2";

type LessonList = Lesson & { subject: Subject }&{classes:(LessonClass & {class:Class})[]}  & {teacher: Teacher;} & {attendances:Attendance[]};


const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header:currentUser?.lang === "Français"? "Matière":"Subject Name",
      accessor: "name",
    },
    {
      header: "Classes",
      accessor: "classes",
    },
    {
      header:currentUser?.lang === "Français"?"Enseignant":"Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    
    {
      header:currentUser?.lang === "Français"? "Date de début":"Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: currentUser?.lang === "Français"?"Date de fin":"End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    ...(currentUser?.role === "Admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  
  const renderRow = (item: LessonList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.classes.map((item) => item.class.name).join(", ")}</td>
      <td className="hidden md:table-cell">
      {item.teacher.username}
      </td>
      
      <td className="hidden md:table-cell">
      {item.startTime &&  customizedFormatDate(item.startTime)}

      </td>
      <td className="hidden md:table-cell">
      {item.endTime && customizedFormatDate(item.endTime)}
       
      </td>
      <td>
        <div className="flex items-center gap-2">
           {currentUser?.role === "Admin" && (
            <>
              <FormContainer table="lesson" type="update" data={item} />
              <FormContainer table="lesson" type="delete" id={item.id} />
            </>
          )} 
        </div>
      </td>
    </tr>
  );
  
  const { page,itemOffset,endOffset, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.LessonWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classes = {some:{classId:value}};
            break;
          case "subjectId":
            query.subjectId = value;
            break;
          case "date":
            query.startTime = {
              gte: new Date(value), // Date début
              lt: new Date(new Date(value).getTime() + 86400000) // Date fin (le lendemain)
            }
            break
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.OR = [
              { subject: { name: { contains: value, mode: "insensitive" } } },
              { teacher: { username: { contains: value, mode: "insensitive" } } },
            ];
            break;
          default:
            break;
        }
      }
    }
  }
  if(currentUser?.role === "Student"){
    query.classes = {
      some: {
        class: {
          currentStudents: {
            some: {
              id: currentUser.id||""
            }
          }
        }
      }
    };
  }
  else if(currentUser?.role === "Parent"){
    query.classes = {
      some:{
        class:{
          currentStudents:{
            some:{
              parentId:currentUser.id
            }
          }
        }
      }
    } 
  }
  else if(currentUser?.role === "Teacher"){
    query.classes = {
      some:{
        class:{
           lessons:{
            some:{
              lesson:{
                teacherId:currentUser?.id||""
              }
            }
           }
          }
        }
      }
    } 
  query.schoolId = currentUser?.schoolId
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where: query,
      include: {
        subject: { select: { name: true } },
        classes:{include:{class:true}},
        teacher: { select: { username: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:[
        {
          startTime:"desc"
        }
      ]
    }),
    prisma.lesson.count({ where: query }),
  ]);
  const subjects = await prisma.subject.findMany({
    where:{
      schoolId:currentUser?.schoolId
    }
  })
  const classes = await prisma.class.findMany({
    where:{
      schoolId:currentUser?.schoolId
    }
  })
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"Leçons":'All Lessons'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <LessonsFilter user = {currentUser||null} subjects={subjects} classes = {classes} />
         
             {currentUser?.role === "Admin" && <FormContainer table="lesson" type="create" />} 
          </div>
        </div>
      </div>
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data} /> 
      {/* PAGINATION */}
        <Secondpagination itemsCount={count} itemsPerPage={10} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default LessonListPage;

export function customizedFormatDate(date:Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Ajoute un zéro si nécessaire
  const day = String(date.getDate()).padStart(2, '0'); // Ajoute un zéro si nécessaire
  const hours = String(date.getHours()).padStart(2, '0'); // Ajoute un zéro si nécessaire
  const minutes = String(date.getMinutes()).padStart(2, '0'); // Ajoute un zéro si nécessaire

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}