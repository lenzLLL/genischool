"use client"
import { deletePictureUser, getAdminByContact, getCurrentSchool, getCurrentUserInfos, getNotificationForUser, sendWhatsAppMessage, updateProfilUser, uploadProfilPicture } from "@/lib/actions"
import { getCurrentUser } from "@/lib/functs"
import { AuthSchema } from "@/lib/schemas"
import React,{useEffect,useState} from "react"
import { toast } from "react-toastify";
import {useRouter} from "next/navigation"
import { string } from "zod"
import { Parent, Student } from "@prisma/client"
export const useUser = () =>{
    const [close,setClose] = useState(true)
    const router = useRouter()
    const [isLoading,setIsLoading] = useState(false)
    const [user,setUser] = useState<AuthSchema|null>(null)
    const [userInfos,setUserInfos] = useState<any>(null)
    const [isSaving,setIsSaving] = useState(false)
    const deletePicture = async () => {
        try{
        setIsLoading(true)
        let msg = user?.lang === "Français"?"Suppression terminée":"Deleting finished"
        await deletePictureUser()
        router.refresh()
        toast.success(msg) 
        }
        catch(error:any){
            let msg = user?.lang === "Français"?"Une erreur s'est produite s'il vous plaît veillez vérifier votre connexion et recommencer":"Something went wrong, please check your network before trying"
            toast.error(msg)
        }
        finally{
            setIsLoading(false)
            await getUser()
         }  
    }
    const getUser = async () => {
        setIsLoading(true)
        const r = await getCurrentUser()
        setUser(r||null)
        const f = await getCurrentUserInfos()
        setUserInfos(f)
        setIsLoading(false)
    }
    const uploadProfil = async ({key,url}:{key:string,url:string}) =>{
        if(!key || !url){
            return null
        }
        try{
           setIsLoading(true)
           await uploadProfilPicture({key,url})
        }
        catch(error:any){
            let msg = user?.lang === "Français"?"Une erreur s'est produite s'il vous plaît veillez vérifier votre connexion et recommencer":"Something went wrong, please check your network before trying"
        }
    
    }
    const setProfil = async ({key,url,password,email,username,lang}:{key:string,url:string,password:string,email:string,username:string,lang:string}) =>{
        try{
            setIsSaving(true)
            await uploadProfil({key,url})
            await updateProfilUser({password,username,lang,email})
            let msg = user?.lang === "Français"?"Modification terminée":"Updating finished"
            toast.success(msg) 
        }
        catch(error:any){
            let msg = user?.lang === "Français"?"Une erreur s'est produite s'il vous plaît veillez vérifier votre connexion et recommencer":"Something went wrong, please check your network before trying"
            toast.error(msg)
        }
        finally{
            setIsSaving(false)
            await getUser()
         }
    }
    const getNotifications = async () => {
        setIsLoading(true)
        const r = await getNotificationForUser()
        setIsLoading(false)
        return r
    }
    const forgetadmininfos = async ({tel}:{tel:string}) => {
        try{
            setIsLoading(true)
            const admin = await getAdminByContact({contact:tel})
            let msg = user?.lang === "Français"?admin.fr:admin.eng
            let whatsappMsg = user?.lang === "Français"? 
            `${admin.data?.school?.name} Informations d'authentification Email: ${admin.data?.admin.email}, Mot de passe:${admin.data?.admin.password}`:
            `${admin.data?.school?.name} Authentification Information Email: ${admin.data?.admin.email} password:${admin.data?.admin.password}`
            if(admin.status === 200){
                toast.success(msg)
                await sendWhatsAppMessage({to:tel,body:whatsappMsg})
                router.push("/sign-in")
            }
            else{
                toast.error(msg)
            }
        }
        catch(error){
            console.log(error)
        }
        finally{
            setIsLoading(false)
        }
    }
    const sendwhatsapp = async ({s,msg}:{s:{s:string,p:string|null},msg:string}) => {
        const school = await getCurrentSchool()
        let m = user?.lang === "Français"? `Cordialement ${school?.name}`:`Cordialy ${school?.name}`
        await sendWhatsAppMessage({to:s.s||"",body:msg})
        await sendWhatsAppMessage({to:s.s||"",body:m})
        if(s.p){
            await sendWhatsAppMessage({to:s.p,body:msg})
            await sendWhatsAppMessage({to:s.p,body:m})
        }
    }
    useEffect(
        ()=>{
            getUser()
        },[]
    )
   
   return {sendwhatsapp, forgetadmininfos,getNotifications,isSaving,close,setClose,deletePicture,user,userInfos,uploadProfil,isLoading,setProfil,setUserInfos}
}