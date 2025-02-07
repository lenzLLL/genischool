import { addResult, getResult, getResultStudent } from "@/lib/actions"
import prisma from "@/lib/prisma"
import { Result, Student } from "@prisma/client"
import { usePathname, useSearchParams } from "next/navigation"
import React,{useEffect,useState,useCallback} from "react"
import { toast } from "react-toastify"

export const useResult = ({session,classe,student,rating,subject,mestre,sequence,lang}:{lang?:string,session?:string,student?:string,rating?:number,classe?:string,subject?:string,mestre?:string,sequence?:string})=>{
  const [students,setStudents] = useState<any>([])
  const [results,setResults] = useState<any>([])
  const [newResults,setNewResults] = useState<Result[]>([])
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());
  const [allStudents,setAllStudents] = useState<any>([])
  const [loading,setLoading] = useState(false)
  
  const [isChanging,setIsChanging] = useState<boolean>(false)
  const getResults = async () => {
    try{
        if(!classe||!subject||!sequence){
            
            return 
        }
        const r = await getResult({classId:classe,subjectId:subject,sessionId:sequence})
        setResults(r.data)
    }
    catch(error:any){
        alert(error.message)
    }
  }
  const saveResult = async () => {
    try{
        setLoading(true)
        if(!session||!student||!classe||!rating){
            let msg = lang === 'Français'? "Veillez entrer tous les champs":"Please fill in all fields session,student,classe and rating"
            toast(msg)
            return
        }
        const r = await addResult({session,classe,student,rating})
        if(lang === "Français"){
            toast(r.fr)
        }
        else{
            toast(r.eng)
        }
        return r.status
    
    }
    catch(error:any){
        toast(error.message)
        return error.response.status
    }
    finally{
        setLoading(false)
    }
}
   
    const getCurrentUser = async () => {
        let start:number = currentQuery.itemOffset? parseInt(currentQuery.itemOffset):0
        let end:number = currentQuery.endOffset? parseInt(currentQuery.endOffset):1
        try{
            if(!classe){
                let msg = lang === 'Français'? "Veillez choisir une classe":"You have to choose any class"
                toast("")
                return 
            }
            setIsChanging(true)
            const r = await getResultStudent({classId:classe})
            setStudents(r.data?.slice(start,end))
            setAllStudents(r.data)
            setIsChanging(false)        
        }
        catch(error:any){
            toast(error.message)
        }
    }
    useEffect(
        ()=>{
            if(classe){
                getCurrentUser()
            }
        },[classe,searchParams]
    )
    useEffect(
        ()=>{
       
                getResults()
             
        },[classe,subject,sequence,loading]
    )
    return {getResults,students,loading,setIsChanging,isChanging,getCurrentUser,allStudents,setNewResults,results,saveResult}
}

