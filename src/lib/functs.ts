"use server"
import { redirect } from "next/navigation"
import prisma from "./prisma"
import { cookies } from 'next/headers'
import { AuthSchema } from "./schemas"
import { Class, Event, EventClass, Teacher } from "@prisma/client"

export const toLogin =  async ({email,password}:{email:string,password:string}) => {
    const cookieStore = await cookies()
    const auth = await prisma.auth.findFirst({
        where:{
            email:email,
            password:password
        },
        include:{
            schools:true
        }
    })
    if(auth){
        cookieStore.set("auth",auth.email,{expires:new Date(new Date().getTime() + 1000 * 60 * 60 * 24)})
        return auth
    }
    else{
        return false
    }
}

export const chooseSchool = async () => {

}
export const getCurrentUser = async () => {
    const cookieStore = await cookies()
    if(!cookieStore.get("auth")){
        redirect("/sign-in")
    }
    const email = cookieStore.get("auth")?.value
    const schoolId = "550e8400-e29b-41d4-a716-446655440000"
    const user = await prisma.auth.findFirst({
        where:{
            email
        },
        include:{
            schools:{
                where:{
                    schoolId
                }
            }
        }
    })
    if(!user){return}
    if(user.schools[0].role === "a"){
        const data = await prisma.admin.findFirst({
            where:{
                email,
                schoolId
            }
        })
        if(!data){return}
        const response:AuthSchema = {email:data.email,role:"Admin",fullname:data.username,id:data.id,schoolId:data.schoolId}
        return response
    }
}

export const getFilterEvents = async ({data,role}:{data:Event & {eventClass:(EventClass & {class:Class})[]},role:String}) => {
    let finalData:Event[] = []
    if(role === "Parent"){
    
    } 
    return finalData
}