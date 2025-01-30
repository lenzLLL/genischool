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

import { AuthSchema } from "@/lib/schemas"
import { useResult } from "@/hooks/result/use-result"
import EmptyComponent from "../emptyComponent"
import Table from "../Table"
import FormContainer from "../FormContainer"
import { Mestre, Schoolyear, Session, SessionSequence, Student } from "@prisma/client"
import Secondpagination from "../pagination2"

type StudentItem = Student

export function TableResult({user,classId,sequenceId,mesterId,subjectId,current}:{current:Schoolyear&{semestres:(Mestre&{session:(SessionSequence&{sessions:Session[]})[]})[]}|null,classId:string,sequenceId:string,mesterId:string,subjectId:string, user:AuthSchema}) {
  const {students,setIsChanging,isChanging,allStudents}  = useResult({classe:classId,sequence:sequenceId,mestre:mesterId,subject:subjectId})

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
      header:user?.lang === "Français"? "Etudiant":"Student",
      accessor: "name",
    },
    ...(user?.role === "Admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item:Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">{item.username}</td>
    </tr>
  );
  return (
    <div className="w-full mt-14">
      <Table columns={columns} renderRow={renderRow} data={students} /> 
      <Secondpagination itemsPerPage={1} itemsCount={allStudents?.length}/>
    </div>
  )
}
