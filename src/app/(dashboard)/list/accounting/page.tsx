import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Accounting, Class, Prisma, Student, StudentFees } from "@prisma/client";
import { customizedFormatDate } from "../lessons/page";
import Secondpagination from "@/components/pagination2";
import { AccountingFilter } from "./components/filter";
type AccountList = Accounting;
const AccountingPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const columns = [
    {
      header:currentUser?.lang === "Français"? "Titre":"Title",
      accessor: "title",
    },
    {
      header: currentUser?.lang === "Français"? "Montant":"Amount",
      accessor: "amount",
    },
    {
      header:"Date",
      accessor: "date",
    },
    {
      header:"Description",
      accessor: "description",
      className: "hidden lg:table-cell",
    },
    {
      header: currentUser?.lang === "Français"? "Enregsitré le":"Recorded on",
      accessor: "saved at",
    },
    ...(currentUser?.role === "Admin" ||currentUser?.role === "Accounter"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];  
  const renderRow = (item:AccountList) => (
    <tr
      key={item.id}
      style={{padding:"5px !important"}}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight p-5"
    >
     
      <td>{item.title}</td>
      <td>{item.amount.toString()} Fcfa</td>
      <td>{ item.paymentDate &&  customizedFormatDate(item.paymentDate)}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td>{ item.createdAt &&  customizedFormatDate(item.createdAt)}</td>
      <td>
        <div className="flex items-center gap-2">
         
           {currentUser?.role === "Admin" && (
            <>
          
            <FormContainer table="accounting" type="delete" id={item.id}/>
            <FormContainer table="accounting" type="update" data={item} /> 

            </>
          )} 
        </div>
      </td>
    </tr>
  );
   
  const { page, itemOffset,endOffset,search } = searchParams;
  
  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.AccountingWhereInput = {};
  query.schoolId = currentUser?.schoolId
  if(search){
    query.title = { contains: query.title?.toString()||"", mode: "insensitive" };
  }
  const [data, count] = await prisma.$transaction([
    prisma.accounting.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy:{
        createdAt:"desc"
      }
    }),
    prisma.accounting.count(),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"Dépenses":"Expenses"}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
              {/* <StudentFilter  user = {currentUser} classes = {classes} /> */}
          
             {currentUser?.role === "Admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <>
              <FormContainer table="accounting" type="create"/>
              </>
            )} 
          </div>
        </div>
      </div>
      {/* LIST */}
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data.slice(parseInt(itemOffset||""),parseInt(endOffset||""))} /> 
      {/* PAGINATION */}
       <Secondpagination itemsCount={data.length} itemsPerPage={10} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
       }
    </div>
  );
};

export default AccountingPage;
