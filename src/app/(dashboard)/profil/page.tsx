"use client"
import AdminPorfil from "@/components/AdminPorfil"
import { useUser } from "@/hooks/user/use-user"
import React,{useEffect,useState} from "react"

export default function page() {
  const {user} = useUser()
  return (
    <div className='w-full h-full gap-5 p-5'>
       {
        user?.role ==="Admin" && <AdminPorfil/>
       }
    </div>
  )
}
