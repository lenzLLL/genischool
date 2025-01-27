import { getResultStudent } from "@/lib/actions"
import { Student } from "@prisma/client"
import React,{useEffect,useState} from "react"
import { toast } from "react-toastify"
export const useResult = ({classe,subject,mestre,sequence}:{classe:string,subject:string,mestre:string,sequence:string})=>{
    const [students,setStudents] = useState<any>([])
    const [isChanging,setIsChanging] = useState<boolean>(false)
    const getCurrentUser = async () => {
        try{
            setIsChanging(true)
            const r = await getResultStudent({classId:classe})
            setStudents(r.data)
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

         
        },[classe]
    )
    return {students,setIsChanging,isChanging}
}