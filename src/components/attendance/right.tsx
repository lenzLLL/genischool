"use client"
import React,{useEffect, useState, useTransition} from 'react'
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
import { LibraryBig, SaveAll } from 'lucide-react'
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
  const [isLoading,setIsLoading] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [attendances,setAttendaces] = useState<AttendanceSchema[]>([])
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
  const {fixAttendace,isSaving,initData} = useAttendance()
  const addAttendance = (s:Student,isChecked:boolean|string) => {

    if(isChecked){
        if(attendances.find(a=>a.studentId === s.id))
        {
          setAttendaces(prevTableau => 
            prevTableau.map(item => 
                item.studentId === s.id ? { ...item, type: true } : item
            )
        );
        }
        else
        {
        setAttendaces([...attendances,{
        time:'2000' ,
        type:isChecked as boolean,
        studentId:s.id,
        ...(currentQuery.lesson && {lessonId:currentQuery.lesson}),
        ...(currentQuery.exam && {examenId:currentQuery.exam}),  
      }])
      }
  }
  else{
    if(attendances.find(a=>a.studentId === s.id))
      {
        setAttendaces(prevTableau => 
          prevTableau.map(item => 
              item.studentId === s.id ? { ...item, type: false } : item
          )
      );
      }
      else
      {
      setAttendaces([...attendances,{
      time:'2000' ,
      type:false,
      studentId:s.id,
      ...(currentQuery.lesson && {lessonId:currentQuery.lesson}),
      ...(currentQuery.exam && {examenId:currentQuery.exam}),  
    }])
    }
  }

}
  useEffect(
    ()=>{
        const currentQuery = Object.fromEntries(searchParams.entries());
        setSearchTerm(currentQuery.search)
        setIsLoading(false)
    },[students,searchParams]
  )
  
  return (
    <Card className='col-span-6 bg-white  p-5 rounded-lg '>
            <Tabs>
            <TabsList className="grid w-full grid-cols-5 mb-5">
              <TabsTrigger value="1">Tout</TabsTrigger>
              <TabsTrigger value="2">0h-5h</TabsTrigger>
              <TabsTrigger value="3">6h-10h</TabsTrigger>
              <TabsTrigger value="4">11h-15h</TabsTrigger>
              <TabsTrigger value="5">16h et plus</TabsTrigger>
            </TabsList>
        <div className='flex items-center gap-3 mb-5'>
          <Input value={searchTerm} onChange = {(e)=>setSearchTerm(e.target.value)} placeholder="veillez entrer le nom d'un étudiant"/>
          <button onClick={addSearch} className={`bg-blue-400 text-sm text-white flex items-center justify-center p-2 rounded-md`}>
              Rechercher
          </button>
        </div>
        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {!isLoading ? <><div className='relative'>{students.map((s)=>{
              const totalTime = s.attendances.reduce((sum, attendance) => {
                return sum + Number(attendance.time); // Assurez-fvous de convertir en Number si nécessaire
              }, 0);
            return(
            <Card className='mb-2 p-6 flex items-center justify-between'>
                        <div  className='flex items-center gap-2'>
                        <Image
                          src={s.img || "/noAvatar.png"}
                          alt=""
                          width={40}
                          height={40}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col'>
                          <h2 className='text-md text-black-900'>{s.username}</h2>
                          <p className='text-gray-400 text-[13px]'>{totalTime === 0? "0h d'absence":millisecondsToHoursMinutes(s.totalTime.toString())}</p>
                        </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox disabled = {!(currentQuery.lesson || currentQuery.exam)} onCheckedChange={(e)=>addAttendance(s,e)} id={s.id} />
                           <label
                              htmlFor={s.id}
                               className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                               >
                                    marquer comme absent
                               </label>
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
          < div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          }
        </div>
       </Tabs>   
    </Card>
  )
}
