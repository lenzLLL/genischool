"use client"
import { addFees, getClasses, getCurrentStudents, getCurrentStudentsWithStatus, getStudentById, getStudentByMatricule } from "@/lib/actions"
import { getCurrentUser } from "@/lib/functs"
import prisma from "@/lib/prisma"
import { AuthSchema } from "@/lib/schemas"
import { useSearchParams } from "next/navigation"
import React,{ useState,useEffect } from "react"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
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
    const [selectedUser,setSelectedUser] = useState("")
    const [tranche,setTranche] = useState<number|null>(null)
    const [currentStudent,setCurrentStudent] = useState<any>(null)
    const [isSettingStudent,setIsSettingStudent] = useState(false)
    const [matricule,setMatricule] = useState("qsd")
    const [settingFees,SetSettingFees] = useState(false)
    const router = useRouter()
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
        else{
            setStudents(allstudents)
        }
    }
    const superSearch = async () => {
        if(tranche && status && classId && tranche !== 0){
            const r = await getCurrentStudentsWithStatus({classId,status,tranche})   
            setStudents(r??[])
        }
    }
    const studentById = async () => {
        setIsSettingStudent(true)
        setMatricule("")
        if(selectedUser){
           const r = await getStudentById({id:selectedUser})
           setCurrentStudent(r.data)
       }
       setIsSettingStudent(false)

    }
    const studentBymatricule = async () => {
        setIsSettingStudent(true)
        setSelectedUser("")
        const currentUser = await getCurrentUser()
        if(matricule){
            const r = await getStudentByMatricule({m:matricule})
            if(r.data){
                setCurrentStudent(r.data)
            }
            else{
                let msg = currentUser?.lang === "Français"?"L'utilisateur de matricule "+matricule+" n'existe pas":"The user with registration number " + matricule + " does not exist."
                alert(msg)
            }
        }
        setIsSettingStudent(false)

    }
    const addAmount = async (amount:number) => {
        const currentUser = await getCurrentUser()
        SetSettingFees(true)
        if(amount === 0){
            if(currentUser.lang === "Français"){
                toast("Le champs nouveau montant est vide!")
            }
            else{
                toast("New amount field is empty!")
            }  
        }
        let r = await addFees({amount,id:selectedUser,m:matricule})
        if(currentUser.lang === "Français"){
            toast(r.fr)
        }
        else{
            toast(r.eng)
        }
        SetSettingFees(false)
        router.refresh()
        if(matricule)
        {
          studentBymatricule()
        }
        else{
          studentById()
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
   
    useEffect(
        ()=>{
            studentById()
        },[selectedUser]
    )
    return {settingFees,addAmount, studentBymatricule, currentStudent,isSettingStudent,matricule,setMatricule,selectedUser,setSelectedUser,totalAmount,tranche,setTranche,status,setStatus,students,isLoading,currentUser,setClassId,classId,classes,allstudents,name,setName,getUserByName}
}