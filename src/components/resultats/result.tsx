"use client"
import React,{useState,useEffect,useCallback} from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Class, Mestre, School, Schoolyear, Session, SessionSequence, Subject } from '@prisma/client'
import { AuthSchema } from '@/lib/schemas'
import { TableResult } from './result-table'
import { useSearchParams } from 'next/navigation'
import { useResult } from '@/hooks/result/use-result'

export default function ResultComponent({classes,subjects,user,school,current}:{current:Schoolyear&{semestres:(Mestre&{session:(SessionSequence&{sessions:Session[]})[]})[]}|null,school:School|null,user:AuthSchema, classes:Class[],subjects:Subject[]}) {
  const [classId,setClassId] = useState<string>("")
  const searchParams = useSearchParams();
  const [subjectId,setSubjectId] = useState<string>("")
  const [mesterId,setMesterId] = useState<string>("")
  const [lang,setLang] = useState(user?.lang)
  const [sequenceId,setSequenceId] = useState<string>("")
  const [sessions,setSession] = useState<any[]>([])

  let msg1 = current?.semestres[0].type === "Semestre"? "Semestre":"Trimestre"
  let msg2 = current?.semestres[0].type === "Semestre"? "Semester":"Trimester"
  const {setIsChanging} = useResult({classe:classId,subject:subjectId,mestre:mesterId,sequence:sequenceId})
    const changeClass = (value:string) => {
      setClassId(value)
    }
    const changeMestre = (value:string) => {
      setMesterId(value)
      if(msg1 = "Semestre"){
        setSequenceId(current?.semestres.filter((s)=>s.id === value)[0].session[0].id||"")
      }
    }
    const getCurrentSession =  useCallback(
      ()=>{
          const semester = current?.semestres.find(s=>s.id === mesterId)
          const sequence = semester?.session.find((s:any)=>s?.id === sequenceId)
          setSession(sequence?.sessions||[])
      },[sequenceId,mesterId]
    )
  useEffect(
    ()=>{
        getCurrentSession() 
    },[sequenceId,mesterId]
  )
  return (
    <div className='p-5 min-h-screen w-full bg-white rounded-lg'>
        <h1 className="hidden md:block text-lg font-semibold mb-2">{  user?.lang === "Français"?"Résultats": 'Results'}</h1>
        <div className='flex justify-between items-center gap-5'>
        <Select value = {mesterId} onValueChange={(e)=>changeMestre(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? `Selectionnez un ${msg1}`:`Select a ${msg2}`} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          current?.semestres.map(
            (s)=><SelectItem value={s.id}>
              {user?.lang === "Français"? (msg1 === "Semestre"? "Semestre":"Trimestre"):(msg1 === "Semestre"? "Semester":"Trimester")}{" "+s.order}
            </SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
        </Select>
   {msg1 !== "Semestre" && <Select value = {sequenceId} onValueChange={(e)=>setSequenceId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? `Selectionnez une séquence`:"Select a sequence"} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          current?.semestres.find(s=>s.id === mesterId)?.session.map(
            (s)=><SelectItem value={s.id}>
              {`Sequence ${s.order}`}
            </SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
    </Select>}
        <Select value = {classId} onValueChange={(e)=>changeClass(e)} >
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
        <TableResult sessions = {sessions}  sequenceId = {sequenceId} classId = {classId} subjectId = {subjectId} mesterId = {mesterId}    user={user}/>
    </div>
  )
}
