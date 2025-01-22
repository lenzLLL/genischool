"use client"
import React,{useEffect,useRef,useState, useTransition} from 'react'
import Image from 'next/image'
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
import { Separator } from '@radix-ui/react-select'
import { Checkbox } from '../ui/checkbox'
import { Attendance, Class, Exam, Lesson, Student } from '@prisma/client'
import { CalendarX2, LibraryBig, RefreshCcw, SaveAll, SlidersHorizontal, TimerOff } from 'lucide-react'
import { millisecondsToHoursMinutes } from '@/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useForm, useFormState } from 'react-hook-form'
import { AttendanceSchema, attendanceSchema, ExamSchema } from '@/lib/formValidationSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { createAttendance, createEvent, updateEvent } from '@/lib/actions'
import {toast} from "react-toastify"
import { useAttendance } from '@/hooks/attendance/use-attendance'
export default function AttendanceRight({data1,data2,students}:{students:(Student &  {attendances:Attendance[]} & {totalTime:BigInt|number})[], data1:Lesson[],data2:Exam[]}) {
  const searchParams = useSearchParams();
  const [searchTerm,setSearchTerm] = useState("")
  const [value1,setValue1] = useState(0)
  const [value2,setValue2] = useState(0)
  const [value3,setValue3] = useState(0)
  const [isLoading,setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [currentUserId,setCurrentUserId] = useState<string>("")
  const [currentValue,setCurrentValue] = useState<string>("")
  const [isHover,setIsHover] = useState<boolean>(false)

  const [isPending,startTransition] = useTransition()
  const addSearch = () => {
      
      setIsLoading(true)
      const params = new URLSearchParams(searchParams.toString()); 
        
      if (searchTerm) {
        const currentQuery = Object.fromEntries(searchParams.entries());
  
        // Ajouter ou mettre à jour le paramètre de date
        currentQuery.search = searchTerm; // Assurez-vous que la date est au format souhaité
  
        // Construire la nouvelle URL avec les paramètres mis à jour
        const newSearch = new URLSearchParams(currentQuery).toString();
        const newUrl = `${pathname}?${newSearch}`;
  
        // Pousser la nouvelle route avec l'URL complète
        router.push(newUrl);
      }
    
      // Redirige avec les nouveaux paramètres de recherche
       
    } 
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<ExamSchema>({
      resolver: zodResolver(attendanceSchema),
    })

  const params = new URLSearchParams(searchParams.toString()); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const deleteSearch = () =>{
    setIsLoading(true) 
    setSearchTerm("")
     delete currentQuery.search
     // Construire la nouvelle URL avec les paramètres mis à jour
     const newSearch = new URLSearchParams(currentQuery).toString();
     const newUrl = `${pathname}?${newSearch}`;
     // Pousser la nouvelle route avec l'URL complète
     router.push(newUrl);
  }  
  const {fixAttendace,isSaving,attendances,setAttendances,getAttendances} = useAttendance()
  const addAttendance = (s:Student,isChecked:string,item:string,time:number) => {
    if(!(currentQuery.time&&(currentQuery.exam||currentQuery.lesson))){
      toast("Veillez choisir une lesson ou un examen avant toute opération!")
      return
    }
    if(isChecked === "a"){
        setCurrentValue("a")
        if(attendances.find(a=>a.studentId === s.id&&(a.examenId === item||a.lessonId === item)))
        {
          setAttendances(prevTableau => 
            prevTableau.map(i => 
              (i.studentId === s.id&&(i.examenId === item||i.lessonId === item)) ? { ...i, type: true } : i
            )
        );
        }
        else
        {

        setAttendances([...attendances,{
        time:currentQuery.time ,
        type:true,
        studentId:s.id,
        ...(currentQuery.lesson && {lessonId:currentQuery.lesson}),
        ...(currentQuery.exam && {examenId:currentQuery.exam}),  
      }])
      }
  }
  else{
    setCurrentUserId("p")
    if(attendances.find(a=>a.studentId === s.id&&(a.examenId === item||a.lessonId === item)))
      {
        setAttendances(prevTableau => 
          prevTableau.map(i => 
            (i.studentId === s.id&&(i.examenId === item||i.lessonId === item)) ? { ...i, type: false } : i
          )
      );
      }
      else
      {
      setAttendances([...attendances,{
      time:'2000' ,
      type:false,
      studentId:s.id,
      ...(currentQuery.lesson && {lessonId:currentQuery.lesson}),
      ...(currentQuery.exam && {examenId:currentQuery.exam}),  
    }])
    }
  }
  
  // setTimeout(()=>{fixAttendace(attendances)},1500)
}
const countValue1 = () =>{
  setValue1(value1+1)
}
useEffect(
    ()=>{
        const currentQuery = Object.fromEntries(searchParams.entries());
        setSearchTerm(currentQuery.search)
        setIsLoading(false)
    },[students,searchParams,currentValue]
  )
  
  return (
    <Card className='col-span-6 bg-white  p-5 rounded-lg '>
            <Tabs defaultValue='1'>
            <TabsList className="grid w-full grid-cols-5 mb-5">
              <TabsTrigger value="1">Tout</TabsTrigger>
              <TabsTrigger value="2">0h-5h</TabsTrigger>
              <TabsTrigger value="3">5h-10h</TabsTrigger>
              <TabsTrigger value="4">10h-15h</TabsTrigger>
              <TabsTrigger value="5">15h et plus</TabsTrigger>
            </TabsList>
            <div className='flex items-center gap-3 mb-5'>
          <Input value={searchTerm} onChange = {(e)=>setSearchTerm(e.target.value)} placeholder="veillez entrer le nom d'un étudiant"/>
           {    currentQuery.search &&      <div onClick={deleteSearch} className='w-10 h-9 cursor-pointer flex items-center justify-center px-2 rounded-md bg-gray-100'>
            <RefreshCcw/>
          </div>}
          <button onClick={addSearch} className={`bg-blue-400 text-sm text-white flex items-center justify-center p-2 rounded-md`}>
              Rechercher
          </button>

        </div>
        <TabsContent value="1">
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
            
              
            let totalTime = 0
            let examCount = 0
            for(let i = 0;i<s.attendances.length;i++){
              if(s.attendances[i].examenId){
                examCount += 1
              }
              else{
              totalTime += Number(s.attendances[i].time)
              }
            }
            let exam =  currentQuery.exam
            let lesson =  currentQuery.lesson
            let isCheckedExam = (exam && attendances.find((a)=>a.examenId === exam && a.studentId === s.id && a.type))? true:false
            let isCheckedLesson = (lesson && attendances.find((a)=>a.lessonId === lesson && a.studentId === s.id && a.type))? true:false
            return(
            <Card onMouseLeave={()=>setIsHover(false)} onClick={()=>setIsHover(false)}  className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={70}
                          height={70}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col justify-center'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <div className='flex items-center gap-2'>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><TimerOff  size={17} />{totalTime === 0? "0h":millisecondsToHoursMinutes(totalTime.toString())}</p>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><CalendarX2 size={17} />{examCount}</p>
                          </div>
                        </div>
                        </div>
                        <div  className="flex items-center space-x-2 cursor-pointer">
                         {!(isHover&&currentUserId === s.id) ?                        <Select    value={((isCheckedExam||isCheckedLesson)?"a":"p")}   onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>:
                                               <Select  disabled = {!(currentQuery.time&&(exam||lesson))}      onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut"  />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>}
                         </div>
            </Card>
          )})}
            
            <button onClick={()=>fixAttendace(attendances)} className='fixed bottom-5 right-20 bg-blue-500 p-3 rounded-full shadow-md transition-all duration-150 hover:bg-blue-700' type='submit'>{isSaving? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />: <SaveAll color='white' />}</button>
          </div>
          
          {
            students.length === 0 && <div className='mt-28 flex justify-center'>
                <span className='text-4xl font-bold text-[#555] flex flex-col items-center'><LibraryBig size={100}/> Aucun élève</span>
            </div>
          }
    
          </>:
          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
        </TabsContent>
        <TabsContent value="2">
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
            
              
            let totalTime = 0
            let examCount = 0
            for(let i = 0;i<s.attendances.length;i++){
              if(s.attendances[i].examenId){
                examCount += 1
              }
              else{
              totalTime += Number(s.attendances[i].time)
              }
            }
            let exam =  currentQuery.exam
            let lesson =  currentQuery.lesson
            let isCheckedExam = (exam && attendances.find((a)=>a.examenId === exam && a.studentId === s.id && a.type))? true:false
            let isCheckedLesson = (lesson && attendances.find((a)=>a.lessonId === lesson && a.studentId === s.id && a.type))? true:false
            if(totalTime > 18000000){return}
            
            return(
            <Card onMouseLeave={()=>setIsHover(false)} onClick={()=>setIsHover(false)}  className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={70}
                          height={70}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col justify-center'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <div className='flex items-center gap-2'>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><TimerOff  size={17} />{totalTime === 0? "0h":millisecondsToHoursMinutes(totalTime.toString())}</p>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><CalendarX2 size={17} />{examCount}</p>
                          </div>
                        </div>
                        </div>
                        <div  className="flex items-center space-x-2 cursor-pointer">
                         {!(isHover&&currentUserId === s.id) ?                        <Select    value={((isCheckedExam||isCheckedLesson)?"a":"p")}   onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>:
                                               <Select  disabled = {!(currentQuery.time&&(exam||lesson))}      onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut"  />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>}
                         </div>
            </Card>
          )})}
            
            <button onClick={()=>fixAttendace(attendances)} className='fixed bottom-5 right-20 bg-blue-500 p-3 rounded-full shadow-md transition-all duration-150 hover:bg-blue-700' type='submit'>{isSaving? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />: <SaveAll color='white' />}</button>
          </div>
          
          {
            (students.length === 0) && <div className='mt-28 flex justify-center'>
                <span className='text-4xl font-bold text-[#555] flex flex-col items-center'><LibraryBig size={100}/> Aucun élève</span>
            </div>
          }
    
          </>:
          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
        </TabsContent>
        <TabsContent value="3">
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
            
              
            let totalTime = 0
            let examCount = 0
            for(let i = 0;i<s.attendances.length;i++){
              if(s.attendances[i].examenId){
                examCount += 1
              }
              else{
              totalTime += Number(s.attendances[i].time)
              }
            }
            let exam =  currentQuery.exam
            let lesson =  currentQuery.lesson
            let isCheckedExam = (exam && attendances.find((a)=>a.examenId === exam && a.studentId === s.id && a.type))? true:false
            let isCheckedLesson = (lesson && attendances.find((a)=>a.lessonId === lesson && a.studentId === s.id && a.type))? true:false
            if(totalTime < 18000000 || totalTime > 36000000){return}
            
            return(
            <Card onMouseLeave={()=>setIsHover(false)} onClick={()=>setIsHover(false)}  className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={70}
                          height={70}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col justify-center'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <div className='flex items-center gap-2'>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><TimerOff  size={17} />{totalTime === 0? "0h":millisecondsToHoursMinutes(totalTime.toString())}</p>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><CalendarX2 size={17} />{examCount}</p>
                          </div>
                        </div>
                        </div>
                        <div  className="flex items-center space-x-2 cursor-pointer">
                         {!(isHover&&currentUserId === s.id) ?                        <Select    value={((isCheckedExam||isCheckedLesson)?"a":"p")}   onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>:
                                               <Select  disabled = {!(currentQuery.time&&(exam||lesson))}      onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut"  />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>}
                         </div>
            </Card>
          )})}
            
            <button onClick={()=>fixAttendace(attendances)} className='fixed bottom-5 right-20 bg-blue-500 p-3 rounded-full shadow-md transition-all duration-150 hover:bg-blue-700' type='submit'>{isSaving? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />: <SaveAll color='white' />}</button>
          </div>
          
          {
            (students.length === 0) && <div className='mt-28 flex justify-center'>
                <span className='text-4xl font-bold text-[#555] flex flex-col items-center'><LibraryBig size={100}/> Aucun élève</span>
            </div>
          }
    
          </>:
          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
        </TabsContent>
        <TabsContent value="4">
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
            
              
            let totalTime = 0
            let examCount = 0
            for(let i = 0;i<s.attendances.length;i++){
              if(s.attendances[i].examenId){
                examCount += 1
              }
              else{
              totalTime += Number(s.attendances[i].time)
              }
            }
            let exam =  currentQuery.exam
            let lesson =  currentQuery.lesson
            let isCheckedExam = (exam && attendances.find((a)=>a.examenId === exam && a.studentId === s.id && a.type))? true:false
            let isCheckedLesson = (lesson && attendances.find((a)=>a.lessonId === lesson && a.studentId === s.id && a.type))? true:false
            if(totalTime < 36000000||totalTime>54000000){return}
            
            return(
            <Card onMouseLeave={()=>setIsHover(false)} onClick={()=>setIsHover(false)}  className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={70}
                          height={70}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col justify-center'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <div className='flex items-center gap-2'>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><TimerOff  size={17} />{totalTime === 0? "0h":millisecondsToHoursMinutes(totalTime.toString())}</p>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><CalendarX2 size={17} />{examCount}</p>
                          </div>
                        </div>
                        </div>
                        <div  className="flex items-center space-x-2 cursor-pointer">
                         {!(isHover&&currentUserId === s.id) ?                        <Select    value={((isCheckedExam||isCheckedLesson)?"a":"p")}   onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>:
                                               <Select  disabled = {!(currentQuery.time&&(exam||lesson))}      onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut"  />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>}
                         </div>
            </Card>
          )})}
            
            <button onClick={()=>fixAttendace(attendances)} className='fixed bottom-5 right-20 bg-blue-500 p-3 rounded-full shadow-md transition-all duration-150 hover:bg-blue-700' type='submit'>{isSaving? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />: <SaveAll color='white' />}</button>
          </div>
          
          {
            (students.length === 0) && <div className='mt-28 flex justify-center'>
                <span className='text-4xl font-bold text-[#555] flex flex-col items-center'><LibraryBig size={100}/> Aucun élève</span>
            </div>
          }
    
          </>:
          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
        </TabsContent>
        <TabsContent value="5">
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
            let totalTime = 0
            let examCount = 0
            for(let i = 0;i<s.attendances.length;i++){
              if(s.attendances[i].examenId){
                examCount += 1
              }
              else{
              totalTime += Number(s.attendances[i].time)
              }
            }
            let exam =  currentQuery.exam
            let lesson =  currentQuery.lesson
            let isCheckedExam = (exam && attendances.find((a)=>a.examenId === exam && a.studentId === s.id && a.type))? true:false
            let isCheckedLesson = (lesson && attendances.find((a)=>a.lessonId === lesson && a.studentId === s.id && a.type))? true:false
            if(totalTime<54000000){return}
            return(
            <Card onMouseLeave={()=>setIsHover(false)} onClick={()=>setIsHover(false)}  className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={70}
                          height={70}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col justify-center'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <div className='flex items-center gap-2'>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><TimerOff  size={17} />{totalTime === 0? "0h":millisecondsToHoursMinutes(totalTime.toString())}</p>
                          <p className='text-gray-400 text-[14px] flex gap-1 items-center justify-center'><CalendarX2 size={17} />{examCount}</p>
                          </div>
                        </div>
                        </div>
                        <div  className="flex items-center space-x-2 cursor-pointer">
                         {!(isHover&&currentUserId === s.id) ?                        <Select    value={((isCheckedExam||isCheckedLesson)?"a":"p")}   onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>:
                                               <Select  disabled = {!(currentQuery.time&&(exam||lesson))}      onValueChange={(e)=>{addAttendance(s,e,exam||lesson,totalTime)}}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Statut"  />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="p">Présent</SelectItem>
                                     <SelectItem value="a">Absent</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                        </Select>}
                         </div>
            </Card>
          )})}
            
            <button onClick={()=>fixAttendace(attendances)} className='fixed bottom-5 right-20 bg-blue-500 p-3 rounded-full shadow-md transition-all duration-150 hover:bg-blue-700' type='submit'>{isSaving? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />: <SaveAll color='white' />}</button>
          </div>
          
          {
            (students.length === 0) && <div className='mt-28 flex justify-center'>
                <span className='text-4xl font-bold text-[#555] flex flex-col items-center'><LibraryBig size={100}/> Aucun élève</span>
            </div>
          }
    
          </>:
          <div className='flex w-full items-center justify-center mt-24'>
          < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
        </TabsContent>
        
       </Tabs>   
    </Card>
  )
}
