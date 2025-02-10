"use client"
import { getCurrentUser } from "@/lib/functs"
import { AuthSchema } from "@/lib/schemas"
import React,{useEffect,useState} from "react"
export const useUser = () =>{
    const [close,setClose] = useState(true)
    const [user,setUser] = useState<AuthSchema|null>(null)
    const getUser = async () => {
        const r = await getCurrentUser()
        setUser(r)
    }
    useEffect(
        ()=>{
            getUser()
        },[]
    )
   
   return {close,setClose,user}
}