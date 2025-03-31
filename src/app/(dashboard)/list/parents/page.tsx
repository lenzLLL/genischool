import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Secondpagination from "@/components/pagination2";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { parentsData, role } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Parent, Prisma, Student } from "@prisma/client";
import Image from "next/image";

type ParentList = Parent & { students: Student[] };


const ParentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
const currentUser = await getCurrentUser()
  
const columns =[
  {
    header: currentUser?.lang === "Français"? "Nom":"Name",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: currentUser?.lang === "Français"? "é".toUpperCase()+'tudiant(s)':"Student(s)+",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header: currentUser?.lang === "Français"?"Contact":"Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: currentUser?.lang === "Français"?"Adresse":"Address",
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

  const renderRow = (item: ParentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.username}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      
      <td className="hidden md:table-cell">{item.students.map((student) => student.username).join(", ")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
           {currentUser?.role === "Admin" && (
            <>
              <FormContainer table="parent" type="update" data={item} />
              <FormContainer table="parent" type="delete" id={item.id} />
            </>
          )} 
        </div>
      </td>
    </tr>
  );
  const { page,itemOffset,endOffset, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ParentWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.username = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }
  query.schoolId = currentUser?.schoolId
  const [data, count] = await prisma.$transaction([
    prisma.parent.findMany({
      where: query,
      include: {
        students: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:[
        {
          username:"asc"
        }
      ]
    }),
    prisma.parent.count({ where: query }),
  ]);
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"Parents":"All Parents"}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch lang={currentUser?.lang? currentUser?.lang:""} />
          <div className="flex items-center gap-4 self-end">
         
             {currentUser?.role === "Admin" && (
              <FormContainer table="parent" type="create"/>
            )} 
          </div>
        </div>
      </div>
      {/* LIST */}
       {/* LIST */}
       {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data.slice(parseInt(itemOffset||""),parseInt(endOffset||""))} /> 
      {/* PAGINATION */}
              <Secondpagination itemsCount={data.length} itemsPerPage={10} /> 
      
        </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default ParentListPage;
