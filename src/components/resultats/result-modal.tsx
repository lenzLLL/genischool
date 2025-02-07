import React,{useState,useEffect,} from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AuthSchema } from '@/lib/schemas'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { getClassName } from './result-table'
import { useResult } from '@/hooks/result/use-result'

export default function ResultModal({setRefresh,refresh,sessions,user,setShowModal,students,currentUser,subjectId,sequenceId,classe}:{refresh:boolean, setRefresh:(v:boolean)=>void,classe:string, subjectId:string,sequenceId:string, currentUser:string,students:any[], setShowModal:(v:boolean)=>void,sessions:any[],user:AuthSchema}) {
  const [session,setSession] = useState("")
  const [studentId,setStudentId] = useState(currentUser)
  const [v,setV] = useState<number|null>(null)

  const {saveResult,loading,results} = useResult({subject:subjectId,sequence:sequenceId,session:session,classe,student:studentId,rating:v??0,lang:user.lang??""})

  const router = useRouter()

 const changeRating = (r:number) =>{
     if(!r){
      setV(null)
     }else{
      setV(r)
     }
 }
 const fixSave = () =>{
     saveResult() 
     setRefresh(!refresh)
 }
//  useEffect(
//   ()=>{
       
//   },[loading,results]
//  )

  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 flex items-center justify-center'>
        <div className='bg-white relative flex flex-col gap-3 w-[50%] h-[80%] p-10 rounded-md'>
        <div  onClick={()=>setShowModal(false)} className='absolute cursor-pointer top-3 right-3'><X/></div>

        <Select value = {studentId} onValueChange={(e)=>setStudentId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? `Selectionnez un élève`:`Select a student`} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          students.map(
            (s)=><SelectItem value={s.id}>
                {s.username}
            </SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
        </Select>
        <Select value = {session} onValueChange={(e)=>setSession(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={user?.lang === "Français"? `Selectionnez une session`:`Select a session`} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {
          sessions.map(
            (s)=><SelectItem value={s.id}>
                {s.title}
            </SelectItem>
          )
        }
      </SelectGroup>
    </SelectContent>
        </Select>
        <div className='flex items-center w-full justify-between gap-3'><Input placeholder='Entrez une note'  value={v?.toString()} onChange={(e)=>changeRating(parseInt(e.target.value))} /> <Button onClick={fixSave} className='bg-blue-500 w-[200px] hover:bg-blue-700'>{loading?< div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />:"Enregistrer"}</Button></div>
       <h1 className='my-2 text-[#555] font-bold'>Notes courantes</h1>
       <div className='flex justify-start gap-5 flex-wrap items-center'>
        {
           results.length !== 0 && sessions.map(
                (s)=>{
                    let r = results.find((r:any)=>r?.exam?.sessionId === s.id && r?.studentId === studentId && r?.exam?.subjectId === subjectId)
                    if(r){
                        return       <div className={'w-auto flex items-center justify-center rounded-md text-white px-5 py-2  '+getClassName(r?.rating)}>
                        {s?.title} {r?.rating}/20
                     </div>
                    }
                    return  
                }
            )
        }
        {
          results.length  === 0 && < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        }
        </div>
        </div>

    </div>
  )
}
