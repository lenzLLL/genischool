import React,{useState,useEffect} from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { AuthSchema } from '@/lib/schemas'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import { useResult } from '@/hooks/result/use-result'

export default function ResultModal({sessions,user}:{sessions:any[],user:AuthSchema}) {
  const [session,setSession] = useState("")
  const {} = useResult()
  return (
    <div className='fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-40 flex items-center justify-center'>
        <div className='bg-white relative flex flex-col gap-3 w-[50%] h-[80%] p-10 rounded-md'>
        <div className='absolute top-3 right-3'><X/></div>

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
        <div className='flex items-center w-full justify-between gap-3'><Input /> <Button className='bg-blue-500 hover:bg-blue-700'>Enregistrer</Button></div>
        </div>
    </div>
  )
}
