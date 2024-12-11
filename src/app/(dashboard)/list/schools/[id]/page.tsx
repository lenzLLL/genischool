import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import BigCalendar from "@/components/BigCalender";
import EmptyComponent from "@/components/emptyComponent";
import FormContainer from "@/components/FormContainer";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Performance from "@/components/Performance";
import Table from "@/components/Table";
// import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { School, Schoolyear, Teacher } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {MdPerson, MdPlace} from "react-icons/md"
const SingleTeacherPage = async ({
  params: { id,page },
}: {
  params: { id: string, page:number };
}) => {
  
  type SchoolYearList = Schoolyear;
  // const currentUser = await getCurrentUser()
  const currentUser = {role:"Owner"}
  const school = await prisma.school.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          admins: true,
          schoolyears: true
        },
      },
      schoolyears:true
    },
  });
 const data = school?.schoolyears
  if (!school) {
    return notFound();
  }


  const p = page ? page : 1;
  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Started",
      accessor: "started",
      className: "hidden md:table-cell",
    },
    {
      header: "ended",
      accessor: "Ended",
      className: "hidden md:table-cell",
    },
    {
      header: "Activate",
      accessor: "activate",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];

  const renderRow = (item: SchoolYearList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">

        <div className="flex flex-col">
          <h3 className="font-semibold">{item.title}</h3>
        </div>
      </td>

      
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-GB").format(item.createdAt)}</td>
      <td className="hidden md:table-cell">{new Intl.DateTimeFormat("en-GB").format(item?.endedAt ? item?.endedAt:Date.now())}</td>
      <td className="hidden md:table-cell">
      {item.current? "Activé":"Désactivé"}
      </td>

    </tr>
  );
  return (
    <><div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <img
                src={school?.logo? school?.logo:""}
                alt=""
                width={100}
                height={100}
                className="rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {school.name}
                </h1>
                {currentUser?.role === "Admin" && (
                  <FormContainer table="teacher" type="update" data={school} />
                )}
              </div>
              {/* <p className="text-sm text-gray-500">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p> */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdPlace size={17}/>
                  <span>{school.address}</span>
                </div> 
                 <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <MdPerson size={17}/>
                  
                  <span>
                    admins {school._count.admins}
                  </span>
                </div> 
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{school.email || "-"}</span>
                </div>

              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
  
        </div>
        {/* BOTTOM */}
      
      </div>
      {currentUser?.role === "Owner" && (        
          <FormContainer data={school.id}   table="schoolyear" type="create"/>
      )} 
    </div>
     {/* RIGHT */}
     {data?.length !== 0 && <><Table columns={columns} renderRow={renderRow} data={data? data:[]} /> 
     {/* PAGINATION */}
      <Pagination page={p} count={data?.length? data.length:0} /> </>}
      {
       data?.length === 0 &&  
           <EmptyComponent msg = {'No Data'} />
      }</>
  );
};

export default SingleTeacherPage;
