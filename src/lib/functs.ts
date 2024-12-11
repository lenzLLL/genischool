"use server"
import { redirect } from "next/navigation"
import prisma from "./prisma"
import { cookies } from 'next/headers'
import { AuthSchema } from "./schemas"
import { Class, Event, Teacher } from "@prisma/client"

 export const toLogin =  async ({data}:{data:AuthSchema}) => {
     const cookieStore = await cookies()
     let res = null
     let route = ""
     if(!data.schoolId || data.schoolId === 'Choisir un établissement' ){
        return {error:"Veillez choisir un établissement!",route}
     }
     if(!data.role || data.role === "Rôle")
     {
        return {error:"Veillez choisir un rôle!",route}
     }
     const [current, schoolYears] = await prisma.$transaction([
        prisma.schoolyear.findFirst({where:{schoolId:data.schoolId,current:true}}),
        prisma.schoolyear.count({ where:{schoolId:data.schoolId} }),
      ]);
     if(current){
        return  {error:"Error School",route}
     }

     if(data.role === "Administrateur"){
        if(!data.email || !data.password){
            return {error:"Veillez remplir tous les champs!",route}
        }
        route ="/admin"
        res = await prisma.admin.findFirst({where:{email:data?.email? data.email:"",password:data.password}})
     }
     if(res){
        const role = data.role? data.role:""
        cookieStore.set("auth",res.id,{expires:new Date(new Date().getTime() + 1000 * 60 * 60 * 24)})
        cookieStore.set("role",role,{expires:new Date(new Date().getTime() + 1000 * 60 * 60 * 24)})
        cookieStore.set("school",data.schoolId,{expires:new Date(new Date().getTime() + 1000 * 60 * 60 * 24)})
        return {error:null,route}
     }
     else{
        return {error:"Les paramètres d'authentification sont incorrects, veillez ressayer!",route}
     }
    //  const auth = await prisma.auth.findFirst({
    //      where:{
    //          email:email,
    //          password:password
    //      },
    //      include:{
    //          schools:true
    //      }
    //  })

 }


 export const getCurrentUser = async () => {
     const cookieStore = await cookies()
     if(!cookieStore.get("auth") || !cookieStore.get("role")){
         redirect("/sign-in")
     }

     const role = cookieStore.get("role")?.value
     const school = cookieStore.get("school")?.value
     const id = cookieStore.get("auth")?.value
     let user = null
     if(role === "Administrateur"){
         user = await prisma.admin.findUnique({where:{id},include:{school:true}})
         if(!user){
             redirect("/sign-in")
         }
         const response:AuthSchema = {lang:user.school.lang,email:user.email,role:"Admin",fullname:user.username,id:user.id,schoolId:user.schoolId,password:"",matricule:""}
         return response                 
     }
     const response:AuthSchema = {lang:"", email:"",role:"",fullname:"",id:"",schoolId:"",password:"",matricule:""}
     return response

 }

