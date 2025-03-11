"use client"
import { deletePictureUser, getCurrentUserInfos, updateProfilUser, uploadProfilPicture } from "@/lib/actions"
import { getCurrentUser } from "@/lib/functs"
import { AuthSchema } from "@/lib/schemas"
import React,{useEffect,useState} from "react"
import { toast } from "react-toastify";
import {useRouter} from "next/navigation"
import { string } from "zod"
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
        setUser(r)
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
    useEffect(
        ()=>{
            getUser()
        },[]
    )
   
   return {isSaving,close,setClose,deletePicture,user,userInfos,uploadProfil,isLoading,setProfil,setUserInfos}
}