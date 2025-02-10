"use client"
import { getCurrentUser } from "@/lib/functs"
import { Menu } from "lucide-react"
import Image from "next/image"
import { MobileSidebar } from "./sidebar/mobile-sidebar"
import React,{useEffect, useState} from "react"
import { AuthSchema } from "@/lib/schemas"
import { useUser } from "@/hooks/user/use-user"
export default function NavComponent({currentUser}:{currentUser:AuthSchema}) {
    const [close,setClose] = useState(true)
    useEffect(
        ()=>{

        },[]
    )
    return (
    <>
    {!close && <MobileSidebar onClose={setClose} user={currentUser}/>}
     <div className='flex shadow-sm lg:shadow-none fixed top-0 w-full bg-white lg:top-0 lg:bg-transparent lg:relative z-[99] items-center justify-between p-4'>
       <div onClick = {()=>setClose(false)}className="p-2 cursor-pointer block cursor-pointer lg:hidden bg-blue-600 rounded-lg"><Menu color="white"/></div>
       {/* SEARCH BAR */}
       {/* <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
         <Image src="/search.png" alt="" width={14} height={14}/>
         <input type="text" placeholder={currentUser?.lang === "Français"? "Rechercher...":"Search..."} className="w-[200px] p-2 bg-transparent outline-none"/>
       </div> */}
       {/* ICONS AND USER */}
       <div className='flex items-center gap-6 justify-end w-full'>
         <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer'>
           <Image src="/message.png" alt="" width={20} height={20}/>
         </div>
         <div className='bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'>
           <Image src="/announcement.png" alt="" width={20} height={20}/>
           <div className='absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs'>1</div>
         </div>
         <div className='flex flex-col items-start'>
           {/* <span className="text-xs leading-3 font-medium">{currentUser?.email?.substring(0,7)+"..."}</span> */}
           <span className="text-xs leading-3 font-medium">{currentUser?.email}</span>
           <span className="text-[10px] text-gray-500 text-right">
           {currentUser?.role}
           </span>
         </div>
         <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full"/>
       </div>
     </div>
     </>
  )
}
