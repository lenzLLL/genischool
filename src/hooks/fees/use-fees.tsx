"use client"
import { getClasses, getCurrentStudents, getCurrentStudentsWithStatus } from "@/lib/actions"
import { getCurrentUser } from "@/lib/functs"
import prisma from "@/lib/prisma"
import { AuthSchema } from "@/lib/schemas"
import { useSearchParams } from "next/navigation"
import React,{ useState,useEffect } from "react"

export const useFees = () => {
    const [students,setStudents] = useState<any[]>([])
    const [allstudents,setAllStudents] = useState<any[]>([])
    const [totalAmount,setTotalAmount] = useState(0)
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [classes,setClasses] = useState<any[]>([])
    const searchParams = useSearchParams();
    const [name,setName] = useState("")
    const currentQuery = Object.fromEntries(searchParams.entries());
    const [currentUser,setCurrentUser] = useState<AuthSchema|null>(null)
    const [classId,setClassId] = useState("")
    const [status,setStatus] = useState("")
    const [tranche,setTranche] = useState<number|null>(null)
    
    const getStudents = async () => {
        let start:number = currentQuery.itemOffset? parseInt(currentQuery.itemOffset):0
        let end:number = currentQuery.endOffset? parseInt(currentQuery.endOffset):1
        let cs = classes.find(c=>c?.id === classId)
        const sum = cs?.fees?.tranches?.reduce(
            (s:number,c:any)=>{
               return s += parseInt(c?.amount.toString())  
         
            },0
        )
       
        setTotalAmount(sum+parseInt(cs?.school?.inscription.toString()))
        setIsLoading(true)
        const r = await getCurrentStudents({classId})
        setAllStudents(r||[])
        setStudents(r?.slice(start,end)||[])
        setIsLoading(false)
    }
    const fetchCurrentUser = async () =>{
        const r = await getCurrentUser()
        const c = await getClasses({schoolId: r?.schoolId||""}) ||[]
     
        setClasses(c||[])
        setCurrentUser(r)
    }
    const getUserByName = () =>{
        if(name){
            setStudents(allstudents.filter((s)=>s.username.includes(name)))
        }
    }
    const superSearch = async () => {
        if(tranche && status && classId && tranche !== 0){
            const r = await getCurrentStudentsWithStatus({classId,status,tranche})   
            setStudents(r??[])
        }
    }
    useEffect(
        ()=>{
            getStudents()
            superSearch()
        },[classId,searchParams,status,tranche]
    )
    useEffect(
        ()=>{
            fetchCurrentUser()
        },[]
    )
    return {totalAmount,tranche,setTranche,status,setStatus,students,isLoading,currentUser,setClassId,classId,classes,allstudents,name,setName,getUserByName}
}