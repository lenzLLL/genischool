import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { lessonsData, role } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Lesson, LessonClass, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";

type LessonList = Lesson & { subject: Subject }&{classes:(LessonClass & {class:Class})[]}  & {teacher: Teacher;} & {attendances:Attendance[]};


const LessonListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header: "Subject Name",
      accessor: "name",
    },
    {
      header: "Classes",
      accessor: "classes",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
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
      <td>{item.classes.map((item) => item.class.name).join(",")}</td>
      <td className="hidden md:table-cell">
      {item.teacher.username}
      </td>
      
      <td className="hidden md:table-cell">
      {item.startTime && new Intl.DateTimeFormat("en-US").format(item.startTime)}

      </td>
      <td className="hidden md:table-cell">
      {item.endTime && new Intl.DateTimeFormat("en-US").format(item.endTime)}
       
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
  
  const { page, ...queryParams } = searchParams;

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
              id: currentUser.id
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
                teacherId:currentUser?.id
              }
            }
           }
          }
        }
      }
    } 
  
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
    }),
    prisma.lesson.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lessons</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
             {currentUser?.role === "Admin" && <FormContainer table="lesson" type="create" />} 
          </div>
        </div>
      </div>
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data} /> 
      {/* PAGINATION */}
       <Pagination page={p} count={count} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {'No Data'} />
       }
    </div>
  );
};

export default LessonListPage;
