import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { eventsData, role } from "@/lib/data";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Class, Event, Prisma } from "@prisma/client";
import Image from "next/image";

type EventList = Event;




const EventListPage = async ({
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
      header: "Description",
      accessor: "description",
      className: "hidden md:table-cell",
    },
    
    {
      header: currentUser?.lang === "Français"?"Date de début":"Start time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: currentUser?.lang === "Français"?"Date de fin":"End time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    ...(currentUser.role === "Admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];
  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.title}</td>
      <td className="hidden md:table-cell">{item.description}</td>
     
      <td className="hidden md:table-cell">
      {item.startTime && new Intl.DateTimeFormat("en-US").format(item.startTime)}

      </td>
      <td className="hidden md:table-cell">
      {item.endTime && new Intl.DateTimeFormat("en-US").format(item.endTime)}
       
      </td>
      <td>
        <div className="flex items-center gap-2">
           {currentUser?.role=== "Admin" && (
            <>
              <FormContainer table="event" type="update" data={item} />
              <FormContainer table="event" type="delete" id={item.id} />
            </>
          )} 
          
        </div>
      </td>
    </tr>
  );
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION

  const query: Prisma.EventWhereInput = {};

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

  // ROLE CONDITIONS

  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where:query,
      include: {
      
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({ }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">{currentUser?.lang === "Français"?"é".toUpperCase()+'vènements':"All Events"}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch lang={currentUser?.lang? currentUser?.lang:""} />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
             {currentUser?.role === "Admin" && <FormContainer table="event" type="create" />} 
          </div>
        </div>
      </div>
      {data.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data} /> 
      {/* PAGINATION */}
       <Pagination page={p} count={count} /> </>}
       {
        data.length === 0 &&  
            <EmptyComponent msg = {currentUser?.lang === "Français"?"Aucunes données":'No Data'} />
       }
    </div>
  );
};

export default EventListPage;
