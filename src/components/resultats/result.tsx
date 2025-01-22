"use client"
import React,{useState} from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Class, School, Subject } from '@prisma/client'
import { AuthSchema } from '@/lib/schemas'
import { TableResult } from './result-table'

export default function ResultComponent({classes,subjects,user,school}:{school:School|null,user:AuthSchema, classes:Class[],subjects:Subject[]}) {
  const [classId,setClassId] = useState<string>("")
  const [subjectId,setSubjectId] = useState<string>("")
  return (
    <div className='p-5 min-h-screen w-full bg-white rounded-lg'>
        <h1 className="hidden md:block text-lg font-semibold mb-2">{  user?.lang === "Français"?"Résultats": 'Results'}</h1>
        <div className='flex justify-between items-center gap-5'>
        <Select value = {subjectId} onValueChange={(e)=>setSubjectId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? "Selectionnez une séquence":"Select a sequence"} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          subjects.map(
            (c)=><SelectItem value={c.id}>{c.name}</SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
    </Select>
        <Select value = {classId} onValueChange={(e)=>setClassId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"?"Selectionnez une classe":"Select a class"} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          classes.map(
            (c)=><SelectItem value={c.id}>{c.name}</SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
    </Select>
    <Select value = {subjectId} onValueChange={(e)=>setSubjectId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? "Selectionnez une matière":"Select a subject"} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          subjects.map(
            (c)=><SelectItem value={c.id}>{c.name}</SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
    </Select>

        </div>
        <TableResult school = {school} user={user}/>
    </div>
  )
}
