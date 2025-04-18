"use client"

import  React,{useState,useEffect} from "react"

import { ArrowUpDown, ChevronDown, MoreHorizontal, Pen, Pencil, PenIcon } from "lucide-react"

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
import ResultModal from "./result-modal"

type StudentItem = Student
export function formatNumber(num:number) {
  // Vérifie si le nombre est décimal
  if (num % 1 !== 0) {
    return num.toFixed(2); // Formate avec deux décimales
  }
  return num; // Retourne le nombre tel quel
}
export function TableResult({sessions, user,classId,sequenceId,mesterId,subjectId}:{sessions:any[],classId:string,sequenceId:string,mesterId:string,subjectId:string, user:AuthSchema|null}) {
  const {students,setIsChanging,isChanging,allStudents,results,loading,getResults}  = useResult({classe:classId,sequence:sequenceId,mestre:mesterId,subject:subjectId})
  const [showModal,setShowModal] = useState<boolean>(false)
  const [currentResults,setCurrentResults]  = useState<any[]>(results)
  const [currentUser,setCurrentUser] = useState("")
  const [refresh,setRefresh] = useState(false)

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
    header: user?.lang === "Français"? "Note":"Rating",
    accessor:"note"
   },
   {
    header: user?.lang === "Français"? "Crédit":"Credit",
    accessor:"credit"
   },
   {
    header:"Total",
    accessor:"total"
   },
   {
    header:"Action",
    accessor:"action"
   },
   
    // ...(user?.role === "Admin"
    //   ? [
    //       {
    //         header: "Actions",
    //         accessor: "action",
    //       },
    //     ]
    //   : []),
  ];
 

 const getTotal = (user:string) => {
  let t = 0;
  let p = 0;
  for(let i = 0;i<sessions.length;i++){
    let r = results.find((r:any)=>r?.exam?.session?.id === sessions[i]?.id && user === r?.studentId )
    if(r){
       t += (r?.rating*r?.exam?.session?.percentage)/100
       p += r?.exam?.session?.percentage;
    }
  }
  if(p !== 100){
    t = (100*t)/p
  } 
  return t
 }

 const openModal = (id:string) =>{
  setCurrentUser(id)   
  setShowModal(true) 
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
                    let r = results.find((rr:any)=>rr?.student?.id === item.id && rr.exam?.session?.id === s.id)
                    let rating = r?.rating
                    return <td key = {s.id}  className="pr-5">
                      <div className={getClassName(rating)}>{r?.rating? `${r?.rating}/20 ${r?.exam?.session?.percentage}%`:"......"}</div>

                    </td>})
               }
            <td className="pr-5"><div className={getClassName(getTotal(item.id))}>{getTotal(item.id)? formatNumber(getTotal(item.id))+"/20":"......"}</div></td>
            <td className="pr-5"><div className={getClassName(getTotal(item.id))}>{results[0]?.exam?.credit? results[0]?.exam?.credit:"......"}</div></td>
            <td className="pr-5"><div className={getClassName(getTotal(item.id))}>{getTotal(item.id)? formatNumber(getTotal(item.id)*results[0]?.exam?.credit)+'/'+formatNumber(20*results[0]?.exam?.credit):"......"}</div></td>
            <td onClick={()=>openModal(item.id)}><div className="bg-blue-500 cursor-pointer border-dashed px-2 py-2 text-white flex items-center justify-center rounded-xl"><Pencil/></div></td>
    </tr>
  )
 useEffect(
  ()=>{
      getResults() 
  },[refresh]
 )
 if(students?.length === 0){
  return <div>
    <EmptyComponent msg={"Aucune donnée"}  />
  </div>
}
 if(isChanging){
  return   <div className='flex w-full items-center justify-center mt-24'>
  < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
}
  return (
    <div className="w-full mt-14">
      <Table columns={columns} renderRow={renderRow} data={students} /> 
      <Secondpagination itemsPerPage={10} itemsCount={allStudents?.length}/>
      {showModal && <ResultModal setRefresh={setRefresh} refresh = {refresh} subjectId={subjectId} sequenceId={sequenceId}  currentUser={currentUser} students={allStudents} setShowModal={setShowModal} user={user||null} sessions={sessions} classe={classId}/>}
    </div>
  )
}

export const getClassName = (value:number) => {
  let msg ="py-3 border flex items-center justify-center rounded-xl text-white text-md font-bold ";
  if(!value){
    msg += "bg-gray-500"
  }
  else if(value<6){
    msg += "bg-red-400"
  }
  else if(value<10){
    msg += "bg-red-200"
  }
  else if(value<12){
    msg += "bg-orange-200"
  }
  else if(value<14){
    msg += "bg-orange-300"
  }
  else if(value<16){
    msg += "bg-blue-200"
  }
  else if(value<18){
    msg += "bg-blue-400"
  }
  else{
    msg += "bg-green-400"
  }
  return msg
 }