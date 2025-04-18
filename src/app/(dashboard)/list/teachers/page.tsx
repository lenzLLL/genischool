import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Secondpagination from "@/components/pagination2";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, teachersData } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Subject, Teacher } from "@prisma/client";
import { count } from "console";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";


type TeacherList = Teacher & {subjects:Subject[]} & {classes:Class[]}


const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header: "Infos",
      accessor: "infos",
      className: "hidden md:table-cell",

    },

    {
      header:currentUser?.lang === "Français"? "Matières":"Subjects",
      accessor: "subjects",
      className: "hidden md:table-cell",
    },
    {
      header: currentUser?.lang? "Supervision":"Supervision",
      accessor: "classes",
      className: "hidden md:table-cell",
    },
    {
      header:currentUser?.lang === "Français"? "Contact":"Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header: currentUser?.lang === "Français"? "Adresse":"Address",
      accessor: "address",
      className: "hidden lg:table-cell",
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
  
  const renderRow = (item: TeacherList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.img? item.img:"/noAvatar.png"}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.username}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.subjects.map(item=><span key={item.id} className="flex flex-wrap gap-1 text-sm">{item.name}</span>)}</td>
      <td className="hidden md:table-cell">{item.classes.map(item=><span key={item.id} className="flex flex-wrap gap-1 text-sm">{item.name}</span>)}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
           {currentUser?.role === "Admin" && (
            <>
           
            <FormContainer table="teacher" type="delete" id={item.id}/>
            </>
          )} 
        </div>
      </td>
    </tr>
  );
  const { page,itemOffset,endOffset, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.TeacherWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query.classes = {
              some:{
                id:value
              }
            };
            break;
          case "search":
            query.username = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }
  query.deleted = false
  query.schoolId = currentUser?.schoolId
  const [data, count] = await prisma.$transaction([
    prisma.teacher.findMany({
      where: query,
      include: {
        subjects:true,
        classes: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:[
        {
          username:"asc"
        }
      ]
    }),
  
    prisma.teacher.count({ where: query }),
  ]);
 
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"? 'Professeur(s)':'All Teachers'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch lang={currentUser?.lang? currentUser?.lang:""} />
          <div className="flex items-center gap-4 self-end">
           
             {currentUser?.role === "Admin" && (
              
               <FormContainer table="teacher" type="create"/>
            )} 
          </div>
        </div>
      </div>
      {/* LIST */}
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data} /> 
      {/* PAGINATION */}
              <Secondpagination itemsCount={data.length} itemsPerPage={10} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default TeacherListPage;
