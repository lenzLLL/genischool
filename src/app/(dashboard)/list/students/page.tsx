import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role, studentsData } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Prisma, Student, StudentFees } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { StudentFilter } from "./components/filter";
import { groupBy, orderBy } from "lodash";
import Secondpagination from "@/components/pagination2";
type StudentList = Student & { currentClass: Class,studentFees:StudentFees[] };


const StudentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header: "Informations",
      accessor: "info",
    },
    {
      header: currentUser?.lang === "Français"? "Sexe":"Sex",
      accessor: "sex",
      className: "hidden md:table-cell",
    },
    {
      header:currentUser?.lang === "Français"? "Contact":"Phone",
      accessor: "phone",
      className: "hidden lg:table-cell",
    },
    {
      header:currentUser?.lang === "Français"? "Adresse":"Address",
      accessor: "address",
      className: "hidden lg:table-cell",
    },
    {
      header:currentUser?.lang === "Français"? "Paiement (Fcfa)":"Payment (Fcfa)",
      accessor: "payment",
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
  const renderRow = (item: StudentList) => (
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
          <p className="text-xs text-gray-500">{item.currentClass.name}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{currentUser?.lang === "Français"?  item.sex === "MALE"? "Masculin":"Féminin":item.sex}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>{item.studentFees[0]?.amount?.toString()}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/students/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
           {currentUser?.role === "Admin" && (
            <>
          
            <FormContainer table="student" type="delete" id={item.id}/>
            </>
          )} 
        </div>
      </td>
    </tr>
  );
   
  const { page,itemOffset,endOffset, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.StudentWhereInput = {};
 
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "teacherId":
            query.currentClass = {
              lessons: {
                some: {
                  lesson:{
                    teacherId:value
                  }
                },
              },
            };
            break;
          case "search":
            query.username = { contains: value, mode: "insensitive" };
            break;
          case "status":
            query.classYears = {some:{isSolded:value==="s"?true:false}}
            break
          case "classId":
            query.currentClassId = value
            break
          default:
            break;
        }
      }
    }
  }
  query.deleted = false
  query.schoolId = currentUser?.schoolId
  const [data, count] = await prisma.$transaction([
    prisma.student.findMany({
      where: query,
      include: {
        currentClass:{
          include:{
            lessons:{
              include:{
                lesson:{
                  include:{
                    teacher:true
                  }
                }
              }
            }
          }
        },
        studentFees:{
          where:{
            schoolYearId:currentUser?.currentSchoolYear||""
          }
        }  
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      ...((queryParams.tri === "name-asc" || queryParams.tri === "name-desc")  && {orderBy:[
        {
          username:queryParams.tri === "name-asc"?"asc":"desc"
        }
      ]})
    }),
  
    prisma.student.count({ where: query }),
  ]);
  console.log(data)
  const classes = await prisma.class.findMany({
    where:{
      schoolId:currentUser?.schoolId
    }
  })
 const sortedData = (queryParams.tri === "price-asc"||queryParams.tri === "price-desc") ? data.sort((a:any, b:any) => {
  const feeA = {amount:parseInt(a?.studentFees[0]?.amount.toString())};
  const feeB = {amount:parseInt(b?.studentFees[0]?.amount.toString())};
  return queryParams.tri === "price-asc" ? feeA.amount - feeB.amount : feeB.amount - feeA.amount;
}):[]
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"é".toUpperCase()+"tudiants":"All Students"}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch lang={currentUser?.lang||"Français"}/>
          <div className="flex items-center gap-4 self-end">
              <StudentFilter  user = {currentUser||null} classes = {classes} />
          
             {currentUser?.role === "Admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormContainer table="student" type="create"/>
            )} 
          </div>
        </div>
      </div>
      {/* LIST */}
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow}  data={sortedData.length !== 0? sortedData.slice(parseInt(itemOffset||""),parseInt(endOffset||"")):data.slice(parseInt(itemOffset||""),parseInt(endOffset||""))} /> 
      {/* PAGINATION */}
        <Secondpagination itemsCount={sortedData.length !== 0? sortedData.length:data.length} itemsPerPage={10} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default StudentListPage;
