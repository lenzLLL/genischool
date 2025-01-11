import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { examsData, role } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Class, Exam, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { Result } from "postcss";

type ExamList = Exam & {teacher:Teacher} & {subject:Subject} & {results:Result[]} &{attendances:Attendance[]} & {classes:Class[]}
const ExamListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header: currentUser?.lang === "Français"? "Matière":"Subject Name",
      accessor: "name",
    },
    {
      header: currentUser?.lang === "Français"? "Enseignant":"Teacher",
      accessor: "teacher",
    },
    {
      header: "Classes",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header: "Credit",
      accessor: "credit",
      className: "hidden md:table-cell",
    },
    {
      header: "Resultas",
      accessor: "resultas",
      className: "hidden md:table-cell",
    },    {
      header: currentUser?.lang === "Français"? "Absences": "Attendances",
      accessor: "attendances",
      className: "hidden md:table-cell",
    },
    {
      header: currentUser?.lang === "Français"? "Date de début":"Start Time",
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
  const renderRow = (item: ExamList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.subject.name}</td>
      <td>{item.teacher.username}</td>
      <td className="hidden md:table-cell">
      {item.classes.map((item) => item.name).join(", ")}
      </td>
      <td className="hidden md:table-cell">{item.credit}</td>
      <td className="hidden md:table-cell">{item.results.length}</td>
      <td className="hidden md:table-cell">{item.attendances.length}</td>
      <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell">
      {new Intl.DateTimeFormat("en-US").format(item.endTime)}
      </td>
      <td>
        <div className="flex items-center gap-2">
           {(currentUser?.role === "Admin") && (
            <>
              <FormContainer table="exam" type="update" data={item} />
              <FormContainer table="exam" type="delete" id={item.id} />
            </>
          )} 
        </div>
      </td>
    </tr>
  );
  
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ExamWhereInput = {};


  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classes = {some:{id:value}};
            break;
          case "teacherId":
            query.teacherId = value;
            break;
          case "search":
            query.subject = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS

  switch(currentUser?.role){
     case "Admin":
       break;
     case "Teacher":
        query.teacherId = currentUser?.id;
        break;
      case "Student":
        query.classes = {some:{currentStudents:{some:{id:currentUser?.id}}}};
        break;
      case "Parent":
        query.classes = {some:{currentStudents:{some:{parentId:currentUser?.id}}}};
        break;
     default:
       break  
  }


  const [data, count] = await prisma.$transaction([
    prisma.exam.findMany({
      where: query,
      include: {
        teacher:true,
        classes:{
          include:{
            currentStudents:{
              include:{
                parent:true
              }
            }
          }
        },
        session:{
          include:{
            sessionSequence:{
              include:{
                mestre:true
              }
            }
          }
        },
        subject:true,
        results:true,
        attendances:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.exam.count({ where: query }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"Examens":"All Exams"}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch  lang={currentUser?.lang? currentUser?.lang:"Français"}/>
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
             {currentUser?.role === "Admin"  && <FormContainer table="exam" type="create" />} 
          </div>
        </div>
      </div>
      {/* LIST */}
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data} /> 
      {/* PAGINATION */}
       <Pagination page={p} count={count} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default ExamListPage;
