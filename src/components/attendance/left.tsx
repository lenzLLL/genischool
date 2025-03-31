"use client"
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import React,{useCallback, useEffect, useState} from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { BookOpenCheck, CalendarRange, CalendarSearch, Check, CircleCheck, CircleOff, CircleUserRound, ListFilter, SlidersHorizontal, Timer, X } from 'lucide-react'
import { Class, Exam, Lesson, Subject, Teacher } from '@prisma/client'
import { millisecondsToHoursMinutes } from '@/lib/utils'
import { useSearchParams,useRouter, usePathname } from 'next/navigation'
import { AuthSchema } from '@/lib/schemas';
type DateRange = {
  start: Date;
  end: Date;
};
export default function AttendanceLeft({data1,data2,classes,user}:{user:AuthSchema|null, classes:Class[] ,data1:(Lesson & {teacher:Teacher}&{subject:Subject})[] ,data2:(Exam & {teacher:Teacher}&{subject:Subject})[]}) {
  const [showCalendar,setShowCalendar] = useState<boolean>(false)
  const searchParams = useSearchParams();
  const [selectedLesson,setSelectedLesson] = useState("")
  const [selectedExamen,setSelectedExamen] = useState("")
  const [classId, setClassId] = useState('');
  const [lang,setLang] = useState(user?.lang)
  const [secondClass,setSecondClass] = useState('')
  const [isLoading,setIsLoading] = useState(false)
  const params = new URLSearchParams(searchParams.toString()); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }
  // Ajouter ou mettre à jour le paramètre de date


  const fixSelectedLesson = (id:string,time:number) => {
      setSelectedLesson(id)
      setSelectedExamen("")
      const currentQuery = Object.fromEntries(searchParams.entries());
      if(currentQuery.exam){
        delete currentQuery.exam
      }
      currentQuery.lesson = id
      currentQuery.time = time.toString()
      const newSearch = new URLSearchParams(currentQuery).toString();
      const newUrl = `${pathname}?${newSearch}`;

      // Pousser la nouvelle route avec l'URL complète
      router.push(newUrl);
  }

  const fixSelectedExamen = (id:string,time:number) => {
    setSelectedExamen(id)
    setSelectedLesson("") 
    const currentQuery = Object.fromEntries(searchParams.entries());
    if(currentQuery.lesson){
      delete currentQuery.lesson
    }
    currentQuery.exam = id
    currentQuery.time = time.toString()
    const newSearch = new URLSearchParams(currentQuery).toString();
    const newUrl = `${pathname}?${newSearch}`;
    // Pousser la nouvelle route avec l'URL complète
    router.push(newUrl); 
}
  const router = useRouter()
  const pathname = usePathname(); 
  const addData = (data:any)=>{
    setIsLoading(true)
    selectionRange.startDate = data.selection.startDate
    selectionRange.endDate = data.selection.endDate
    if (selectionRange) {
      const currentQuery = Object.fromEntries(searchParams.entries());

      // Ajouter ou mettre à jour le paramètre de date
      currentQuery.start = selectionRange.startDate.toISOString(); // Assurez-vous que la date est au format souhaité
      currentQuery.end = selectionRange.endDate.toISOString(); // Assurez-vous que la date est au format souhaité

      // Construire la nouvelle URL avec les paramètres mis à jour
      const newSearch = new URLSearchParams(currentQuery).toString();
      const newUrl = `${pathname}?${newSearch}`;

      // Pousser la nouvelle route avec l'URL complète
      router.push(newUrl);
  }
    
  }
  const searchData = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString()); 
    if (secondClass) {
      setIsLoading(true)
      const currentQuery = Object.fromEntries(searchParams.entries());
      // Ajouter ou mettre à jour le paramètre de date
      currentQuery.classId = classId; // Assurez-vous que la date est au format souhaité
      // Construire la nouvelle URL avec les paramètres mis à jour
      const newSearch = new URLSearchParams(currentQuery).toString();
      const newUrl = `${pathname}?${newSearch}`;
      // Pousser la nouvelle route avec l'URL complète
      router.push(newUrl);
    }
    setSecondClass("")


    // Redirige avec les nouveaux paramètres de recherche
     
  }  ,[classId,searchParams])
  const onSetClassId = (id:string)=>{
    // setSecondClass(id)
    setClassId(id)
  }
  useEffect(
    ()=>{
        setIsLoading(false)
        const currentQuery = Object.fromEntries(searchParams.entries());
        searchData()


    },[classId,searchParams]
  )
  useEffect(
    ()=>{
      if(currentQuery.start){
        selectionRange.startDate = new Date(currentQuery.start)
    }
    if(currentQuery.end){
      selectionRange.endDate = new Date(currentQuery.end)
    }
    if(currentQuery.exam){
      setSelectedExamen(currentQuery.exam)
      setSelectedLesson("")
    }
    if(currentQuery.lesson){
      setSelectedLesson(currentQuery.lesson)
      setSelectedExamen("")
    }
    if(currentQuery.classId){
      setClassId(currentQuery.classId)
    }
  
    },[]
  )
  return (
    <Card className='col-span-4 relative  bg-white p-3 rounded-lg'>
{       showCalendar && 
 <div style={{boxShadow:"0 0 3px rgba(0,0,0,0.5)"}} className='absolute -mt-3 pl-5 pr-5 pb-5 bg-white rounded-sm top-16 left-0 z-[9999999999]'> 
 
    <div onClick={()=>setShowCalendar(false)} className='flex cursor-pointer w-full justify-end py-5'><X/></div>
    <DateRangePicker
        ranges={[selectionRange]}
        onChange={(data)=>addData(data)}
      />
  </div>
    
  }
    <div className='flex gap-4 items-center'>
    <Select value = {classId} onValueChange={(e)=>onSetClassId(e)} >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={lang === "Français"? "Selectionnez une classe":"Select a class"} />
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
    {!showCalendar && <CalendarSearch onClick={()=>setShowCalendar(true)}  className='cursor-pointer' size={30} />}
    {showCalendar && <X onClick={()=>setShowCalendar(false)}  className='cursor-pointer' size={30} />}
    </div>

    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 mt-5">
        <TabsTrigger value="account">{lang === "Français"? 'Leçons':'lessons'}</TabsTrigger>
        <TabsTrigger value="password">{lang === "Français"? 'Examens':'Exams'}</TabsTrigger>
      </TabsList>
      <TabsContent value="account" >
        <div className='h-[100vh] p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300'>

      {  !isLoading?    <>{      data1.length>0 && data1.map((d)=>(    <Card onClick={()=>fixSelectedLesson(d.id,d.endTime.getTime()-d.startTime.getTime())}  key={d.id} className='p-5 mb-2  cursor-pointer relative'>
          {(selectedLesson === d.id) && <CircleCheck className='absolute text-green-600 top-2 right-5'/>}
            <div className='flex justify-start gap-3 items-center'>
            <CardTitle className='text-md flex items-center gap-2'><BookOpenCheck size={20} />{d.subject.name}</CardTitle>
            <div className="space-y-0 flex text-md items-center gap-2">
                <CircleUserRound /> {d.teacher.username}
            </div>
            </div>
            <div className='flex justify-start items-center gap-3 mt-3'>
             <span className='flex items-center gap-1'><CalendarRange />{d.startTime.toLocaleString()}</span> <span className='flex items-center gap-2'><Timer />{millisecondsToHoursMinutes((d.endTime.getTime() - d.startTime.getTime()).toString())}</span>
            </div>
        </Card>))}
        {
        
        data1.length === 0  && <div className='flex justify-center flex-col items-center mt-32'> <CircleOff size={50} color='#555' />{lang === "Français"? 'Aucune donnée':'No Data'}</div>       
        
        }
        </>:          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>}
        </div>
      </TabsContent>
      <TabsContent value="password">
      <div className='h-[100vh] p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300'>

{      !isLoading? <>{ data2.length>0 && data2.map((d)=>(    <Card onClick={()=>fixSelectedExamen(d.id,d.endTime.getTime()-d.startTime.getTime())}  key={d.id} className='p-5 mb-2 relative  cursor-pointer'>
        {selectedExamen === d.id && <CircleCheck className='absolute text-green-600 top-2 right-5'/>}
       
       <div className='flex justify-start gap-3 items-center'>
       <CardTitle className='text-md flex items-center gap-2'><BookOpenCheck size={20} />{d.subject.name}</CardTitle>
       <div className="space-y-0 flex text-md items-center gap-2">
           <CircleUserRound /> {d.teacher.username}
       </div>
       </div>
       <div className='flex justify-start items-center gap-3 mt-3'>
        <span className='flex items-center gap-1'><CalendarRange />{d.startTime.toLocaleString()}</span> <span className='flex items-center gap-2'><Timer />{millisecondsToHoursMinutes((d.endTime.getTime() - d.startTime.getTime()).toString())}</span>
       </div>
   </Card>))}
   {
   
   data2.length === 0  && <div className='flex justify-center flex-col items-center mt-32'> <CircleOff size={50} color='#555' /> {lang === "Français"? 'Aucune donnée':'No Data'}</div>       
   
   }</>:      <div className='flex w-full items-center justify-center mt-24'>
   < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
   </div>}
   </div>   
   
   </TabsContent>
    </Tabs>
    </Card>
  )
}
