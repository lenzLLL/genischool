import { getResultStudent } from "@/lib/actions"
import { Student } from "@prisma/client"
import { usePathname, useSearchParams } from "next/navigation"
import React,{useEffect,useState,useCallback} from "react"
import { toast } from "react-toastify"
export const useResult = ({classe,subject,mestre,sequence}:{classe:string,subject:string,mestre:string,sequence:string})=>{
    const [students,setStudents] = useState<any>([])
  const searchParams = useSearchParams();
  const currentQuery = Object.fromEntries(searchParams.entries());

 
    const [allStudents,setAllStudents] = useState<any>([])
    const [isChanging,setIsChanging] = useState<boolean>(false)
    const getCurrentUser = async () => {
        let start:number = currentQuery.itemOffset? parseInt(currentQuery.itemOffset):0
        let end:number = currentQuery.endOffset? parseInt(currentQuery.endOffset):1
        try{
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
    return {students,setIsChanging,isChanging,getCurrentUser,allStudents}
}