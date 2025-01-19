"use client"
import { createAttendance, getAllAttendances } from "@/lib/actions"
import { AttendanceSchema } from "@/lib/formValidationSchemas"
import React,{useState,useEffect} from "react"
export const useAttendance = () => {
    const [isSaving,setIsSaving] = useState(false)
    const [attendances,setAttendances] = useState<AttendanceSchema[]>([])
    const fixAttendace = async (attendaces:AttendanceSchema[]) => {
        try{
            setIsSaving(true)
            for(let i =0;i<attendaces.length;i++){
                await createAttendance(attendaces[i])
            }
            setIsSaving(false)
            return {status:200}
        }
        catch(error:any){
            setIsSaving(false)
            return {status:500}
        }
    }
    const getAttendances = async () => {
        try{
            const data = await getAllAttendances()||[]
            setAttendances([])
            for(let i = 0;i<data.length;i++){
                setAttendances((state)=>[...state,{  id:data[i].id,
                  time:data[i].time.toString(),
                  type:true,
                  studentId:data[i].studentId,
                  lessonId:data[i].lessonId||"",
                  examenId:data[i].examenId||""}])
            }
            
            
        }
        catch(error:any){
            return {status:500}
        }
    }
    // useEffect(
    //     ()=>{
    //         getAttendances()  
    //     },[isSaving]
    // )
    return {isSaving,fixAttendace,setAttendances,attendances,getAttendances}
}