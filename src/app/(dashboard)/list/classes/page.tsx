import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Secondpagination from "@/components/pagination2";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student, Teacher } from "@prisma/client";
import Image from "next/image";

type ClassList = Class & { supervisor: Teacher } & {currentStudents:Student[]};

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {

// const { sessionClaims } = auth();
// const role = (sessionClaims?.metadata as { role?: string })?.role;

const currentUser = await getCurrentUser()
const columns = [
  {
    header: currentUser?.lang === "Français"? "Nom":"Class Name",
    accessor: "name",
  },

  {
    header: currentUser?.lang === "Français"?  "Etudiants":"Students",
    accessor: "students",
    className: "hidden md:table-cell",
  },
  {
    header:  currentUser?.lang === "Français"? "Superviseurs":"Supervisor",
    accessor: "supervisor",
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

const renderRow = (item: ClassList) => (
  <tr
    key={item.id}
    className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
  >
    <td className="flex items-center gap-4 p-4">{item.name}</td>
    <td className="hidden md:table-cell">{item.currentStudents.length}</td>
    <td className="hidden md:table-cell">
      {item?.supervisor?.username}
    </td>
    <td>
      <div className="flex items-center gap-2">
         {currentUser?.role === "Admin" && (
          <>
            <FormContainer table="class" type="update" data={item} />
            <FormContainer table="class" type="delete" id={item.id} />
          </>
        )} 
      </div>
    </td>
  </tr>
);

  const { page,itemOffset,endOffset, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.ClassWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "supervisorId":
            query.supervisorId = value;
            break;
          case "search":
            query.name = { contains: value, mode: "insensitive" };
            break;
          default:
            break;
        }
      }
    }
  }
 query.schoolId = currentUser?.schoolId
  const [data, count] = await prisma.$transaction([
    prisma.class.findMany({
      where: query,
      include: {
        supervisor: true,
        currentStudents:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:[
        {
          name:"asc"
        }
      ]
    }),
    prisma.class.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{  currentUser?.lang === "Français"?"Classes": 'All Classes'}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
          
             {currentUser?.role === "Admin" && <FormContainer table="class" type="create" />} 
          </div>
        </div>
      </div>
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

export default ClassListPage;
