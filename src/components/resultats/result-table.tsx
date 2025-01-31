"use client"

import  React,{useState,useEffect} from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { AuthSchema } from "@/lib/schemas"
import { useResult } from "@/hooks/result/use-result"
import EmptyComponent from "../emptyComponent"
import Table from "../Table"
import FormContainer from "../FormContainer"
import { Mestre, Schoolyear, Session, SessionSequence, Student } from "@prisma/client"
import Secondpagination from "../pagination2"
import { headers } from "next/headers"

type StudentItem = Student

export function TableResult({sessions, user,classId,sequenceId,mesterId,subjectId}:{sessions:any[],classId:string,sequenceId:string,mesterId:string,subjectId:string, user:AuthSchema}) {
  const {students,setIsChanging,isChanging,allStudents,results}  = useResult({classe:classId,sequence:sequenceId,mestre:mesterId,subject:subjectId})

  if(isChanging){
    return   <div className='flex w-full items-center justify-center mt-24'>
    < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  }
  if(students?.length === 0){
    return <div>
      <EmptyComponent msg={"Aucune donnée"}  />
    </div>
  }
  const columns = [
    {
      header: user?.lang === "Français" ? "Etudiant(s)" : "Student(s)",
      accessor: "name",
    },
    ...sessions.map((s) => ({
      header: s.title,
      accessor: s.title,
    })),
   {
    header:"Total",
    accessor:"total"
   } 
    // ...(user?.role === "Admin"
    //   ? [
    //       {
    //         header: "Actions",
    //         accessor: "action",
    //       },
    //     ]
    //   : []),
  ];
 const getClassName = (value:number) => {
  let msg ="py-3 border flex items-center justify-center rounded-xl text-white text-md font-bold ";
  if(value<10){
    msg += "bg-red-300"
  }
  else if(value<=12){
    msg += "bg-orange-200"
  }
  return msg
 }
  const renderRow = (item:Student) => (
    <tr
      key={item.id}
      className="border-b rounded-md border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
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
                <p className="text-xs text-gray-500">{"#"+item.matricule}</p>
              </div>
            </td>
            {
                  ...sessions.map((s) =>{ 
                    let r = results.find((r:any)=>r?.student?.id === item.id && r.exam?.session?.id === s.id)
                    return <td className="pr-5">
                      <div className={getClassName(10)}>{r?.rating? `${r?.rating}/20 ${r?.session?.percentage}%`:"......"}</div>

                    </td>})
            }
            <td className=""><div className={getClassName(9)}>12/20</div></td>

    </tr>
  );
  return (
    <div className="w-full mt-14">
      <Table columns={columns} renderRow={renderRow} data={students} /> 
      <Secondpagination itemsPerPage={1} itemsCount={allStudents?.length}/>
    </div>
  )
}
