"use client"
import React,{useState} from 'react'
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
import { BookOpenCheck, CalendarRange, CalendarSearch, CircleOff, CircleUserRound, ListFilter, SlidersHorizontal, Timer, X } from 'lucide-react'
export default function AttendanceLeft() {
  const [date,setDate] = useState<Date | undefined>(new Date())
  const [showCalendar,setShowCalendar] = useState<boolean>(false)
  return (
    <Card className='col-span-4 relative  bg-white p-3 rounded-lg'>
{       showCalendar &&<Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md absolute top-16 right-1 bg-white border shadow"
    />}
    <div className='flex gap-4 items-center'>
    <Select >
    <SelectTrigger className="w-full">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruits</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
    </Select>
    {!showCalendar && <CalendarSearch onClick={()=>setShowCalendar(true)}  className='cursor-pointer' size={30} />}
    {showCalendar && <X onClick={()=>setShowCalendar(false)}  className='cursor-pointer' size={30} />}
    </div>

    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2 mt-5">
        <TabsTrigger value="account">Leçons</TabsTrigger>
        <TabsTrigger value="password">Examens</TabsTrigger>
      </TabsList>
      <TabsContent value="account" >
        <div className='h-[100vh] p-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300'>

     {    [1,2,3,4,5,6,7,8,9,10,11].map(()=>(    <Card className='p-5 mb-2  cursor-pointer'>
            <div className='flex justify-start gap-3 items-center'>
            <CardTitle className='text-md flex items-center gap-2'><BookOpenCheck size={20} />mathematique</CardTitle>
            <div className="space-y-0 flex text-md items-center gap-2">
                <CircleUserRound /> Mr Lenz Younda
            </div>
            </div>
            <div className='flex justify-start items-start gap-3 mt-3'>
             <span className='flex items-center gap-1'><CalendarRange />28/01/2005 08:12:20</span> <span className='flex items-center gap-2'><Timer /> 3h30min</span>
            </div>
        </Card>))}
        </div>
      </TabsContent>
      <TabsContent value="password">
         <div className='flex justify-center flex-col items-center mt-32'> <CircleOff size={50} color='#555' /> Aucune donnée</div>       
      </TabsContent>
    </Tabs>
    </Card>
  )
}
