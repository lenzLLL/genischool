import React from 'react'
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
export default function AttendanceRight() {
  return (
    <Card className='col-span-6 bg-white  p-5 rounded-lg '>
        <div className='flex items-center gap-3 mb-5'>
          <Input placeholder="veillez entrer le nom d'un étudiant"/>
          <button className={`bg-blue-400 text-sm text-white flex items-center justify-center p-2 rounded-md`}>
              Rechercher
          </button>
        </div>

        <div className='overflow-y-scroll pr-2 h-[100vh] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-300'>
          {[1,2,3,4,5,6,7].map(()=>(
            <Card className='mb-2 p-6 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                        <Image
                          src={"/noAvatar.png"}
                          alt=""
                          width={40}
                          height={40}
                          className="xl:block w-10 h-10 rounded-full object-cover"
                        />
                        <div className='flex flex-col'>
                          <h2 className='text-md text-black-900'>Lenz Younda</h2>
                          <p className='text-gray-400 text-[13px]'>23h d'absence</p>
                        </div>
                        </div>
                        <div className="flex items-center space-x-2 cursor-pointer">
                            <Checkbox id="terms" />
                           <label
                              htmlFor="terms"
                               className="text-sm cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                               >
                                    marquer comme absent
                               </label>
                         </div>
            </Card>
          ))}
        </div>
   
    </Card>
  )
}
