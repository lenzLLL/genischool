"use client"
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { Mail, SaveAll } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyComponent from '@/components/emptyComponent'
import { useFees } from '@/hooks/fees/use-fees'
import Image from 'next/image'
import { Student } from '@prisma/client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import Secondpagination from '@/components/pagination2'
export default function page() {
  type StudentList = Student
  const [currentTranche,setCurrentTranche] = useState("")
  const {totalAmount,status,setStatus,tranche,setTranche, students,currentUser,setClassId,classId,classes,isLoading,allstudents,name,setName,getUserByName} = useFees()
  const onCurrentTranche = (v:string) => {
    if(v === '0'){
       setTranche(0)
       setCurrentTranche(v)
       return
    }
    const cs =  classes.find((c)=>c?.id === classId)?.fees?.tranches
    console.log(cs)
    console.log(v)
    const f = cs.find((c:any)=>c.id === v)?.order
    console.log(f)
    setTranche(f)
    setCurrentTranche(v)
  }
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 p-5'>
        <div className='bg-white rounded-lg p-3 min-h-screen'>
     
            <div className='grid grid-cols-2 gap-3'>
               <div className="col-span-2">
                 <Select  value = {classId} onValueChange={(e)=>setClassId(e)} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selectionnez une classe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                           {
                               classes.map(
                                    (c)=><SelectItem value={c?.id}>{c?.name}</SelectItem>
                                )
                            }
                        </SelectGroup>
                    </SelectContent>
                 </Select>
               </div> 
                <Select value = {currentTranche} onValueChange={(e)=>onCurrentTranche(e)} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tranche" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem   value={'0'}><button >Aucune</button></SelectItem>
                        <SelectGroup>
                           {
                               classes.find((c)=>c?.id === classId)?.fees?.tranches.map(
                                    (c:any)=><SelectItem  value={c?.id}>Tranche {c?.order}</SelectItem>
                                )
                            }
                     
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value = {status} onValueChange={(e)=>setStatus(e)}  >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                           {
                               [{key:"1",fr:"Soldé"},{key:"2",fr:"Non Soldé"}].map(
                                    (c)=><SelectItem key={c.key} value={c.key}>{c.fr}</SelectItem>
                                )
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex mt-3 justify-between items-center'>
                <div className='flex items-center justify-start gap-2'>
                <Input placeholder='student name' value={name} onChange={(e)=>setName(e.target.value)}/>
                <Button onClick={()=>getUserByName()} className='bg-blue-500 hover:bg-blue-600'>Search</Button>
                </div>
                <div>
                    <Button><Mail className='text-white '/></Button>
                </div>
            </div> 
            <div>
             {students.length !== 0 && <>
                <Table className='mt-5 overflow-hidden'>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">{currentUser?.lang === "Français"? "Etudiant":"Student"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Paiement":"Payment"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Reste":"Remaining"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Action":"Action"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((s) => {
          let a = s?.studentFees[0]?.amount
          return (
          <TableRow key={s?.id}>
            <TableCell className="font-medium">
                   
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{s.username}</h3>
                        </div>
            </TableCell>
            <TableCell>{a.toString()}</TableCell>
            <TableCell>{totalAmount-parseInt(a.toString())}</TableCell>
            <TableCell><Checkbox/></TableCell>
          </TableRow>
        )
        }
      )}
      </TableBody>
      
    </Table> 
    <Secondpagination itemsPerPage={10} itemsCount={allstudents.length}/>

                      {/* PAGINATION */}
           </>}
            {
                    ( students.length === 0 && !isLoading) &&  
                     <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
            }
            {
            isLoading && < div className="w-6 mt-24 mx-auto h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            
            }
            </div>       
        </div>









        <div className='bg-white rounded-lg p-3'>
                cool
        </div>
      
    </div>
  )
}
