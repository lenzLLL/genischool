import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Announcement, AnnouncementClass, Class, Prisma } from "@prisma/client";
import Image from "next/image";
import { customizedFormatDate } from "../lessons/page";

type AnnouncementList = Announcement & { announcementClass:(AnnouncementClass & {class:Class})[] };



const AnnouncementListPage = async  ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
    
  const columns = [
    {
      header: currentUser?.lang === "Français"? "Titre":"Title",
      accessor: "title",
    },
    {
      header:"Classes",
      accessor: "class",
    },
    {
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
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
  const renderRow = (item: AnnouncementList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td>{item.announcementClass.map((item) => item.class.name).join(",")}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell">
      {item.date && customizedFormatDate(item?.date)}
      </td>
      <td>
        <div className="flex items-center gap-2">
        {currentUser?.role === "Admin" && (
            <>
               <FormContainer table="announcement" type="update" data={item} /> 
               <FormContainer table="announcement" type="delete" id={item.id} /> 
            </>
          )}
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AnnouncementWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.title = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }
  if(currentUser?.role === "Student"){
    query.announcementClass = {
      some: {
        class: {
          currentStudents: {
            some: {
              id: currentUser?.id? currentUser?.id:""
            }
          }
        }
      }
    };
  }
  else if(currentUser?.role === "Parent"){
    query.announcementClass = {
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
    query.announcementClass = {
      some:{
        class:{
           lessons:{
            some:{
              lesson:{
                teacherId:currentUser?.id||''
              }
            }
           }
          }
        }
      }
    } 
  
  // ROLE CONDITIONS

  const roleConditions = {
    // teacher: { lessons: { some: { teacherId: currentUserId! } } },
    // student: { students: { some: { id: currentUserId! } } },
    // parent: { students: { some: { parentId: currentUserId! } } },
  };

  // query.OR = [
  //   { classId: null },
  //   {
  //     class: roleConditions[role as keyof typeof roleConditions] || {},
  //   },
  // ];

  const [data, count] = await prisma.$transaction([
    prisma.announcement.findMany({
      where: query,
      include: {
        announcementClass: {
          include:{
            class:true
          }
        },
      },
      orderBy:{
        date:"desc"
      }    ,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.announcement.count({ where: query }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          {currentUser?.lang === "Français"?"Annonces": "All Announcements"}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch lang = {currentUser?.lang? currentUser?.lang:""} />
          <div className="flex items-center gap-4 self-end">
             {currentUser?.role === "Admin" && (
              <FormContainer table="announcement" type="create" />
            )} 
          </div>
        </div>
      </div>
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

export default AnnouncementListPage;
