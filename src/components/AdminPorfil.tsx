"use client"
import { Button } from '@/components/ui/button'
import { CldUploadWidget } from "next-cloudinary";
import { Input } from '@/components/ui/input'
import { useUser } from '@/hooks/user/use-user'
import { ImageUp, PictureInPicture, Save, User } from 'lucide-react'
import React,{useState,useEffect} from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MdPictureAsPdf } from 'react-icons/md'

export default function AdminPorfil() {
  const {user,userInfos,setProfil, deletePicture,isLoading,isSaving,setUserInfos} = useUser()
  const [img,setImg] = useState<any>(null)
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [lang,setLang] = useState("")
  const finalSave = async () =>{
    await setProfil({key:img?.public_id,password,email,username:name,lang,url:img?.secure_url})
  }
  function formatDate(date:Date):string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const year = date.getFullYear();    
    return `${day}/${month}/${year}`;
   }
   const toCancel = () =>{
    window.location.reload()
   }
  let defaultImage = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAAABAUDAgYBB//EADEQAAICAQIDBQcDBQAAAAAAAAECAAMEESESMVEFEyJBcRUyU2GBkqFCcrEjJFJi0f/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD9xhCYZWQuOmp3Y8l6wNLLEqXidgBEbu0SdqV0HVonba9r8TnU/wATiBo+Rc/vWN6A6TMknmYQgdK7r7rsPQzevNvTmeMdDFoQK1GbXbsfA3Q+cann47h5pQhLTqnk3SBThAbjaEDi11rrZ25CRbbWtsLtzP4jnalurLUOQ3MQgEITSiprrAi/U9BAzAJOgGpmq415GoqaVqMeuldEG/mfMzWBCeqyv30ZfUTiXyARoRqJPzcMKDZSNhzWAhCEIFDs7IJ/ouf2/wDJQkBWKMGXmDqJcqcWVq45EawI2S/HkWN/tM4E6kmEAlTs2vho4yN3P4kuWcI64tfpA3hCEAhCECJk191e6DkDt6TKM9on+6b0EWgEpdn3AY/C3k20mztHKjQQPli8LsvQkTmM9oJwZJPk28WgEo9mXbGoncbrJ0+qSpBU6EciIF+ERx89WAF3hPUcjGxdURqLEP1gdzl3VELMdAJlZl0183BPRd5Oyspsg6acKDkIGNrmyxnPMmcwhAIzi45trLfPSLSxhV93jICNzuYHOfT3tWqjxJuPnJM9BJmfi8DG2seA8x0gKIjWNwoCT8o0nZ1hHiZV/MdxKq66h3ZDa7lus3gTvZp+KPth7NPxR9sowgTvZp+KPtgezW8rR9sowgRbsW2kasuq9V3mM9BzkrKxgMgJToS36R+mBliU99cAR4Ru0tTLGoWivhG58z1msAgRrzhCAq1FlLF8YjQ86zy+k7ryq2PC+tb/AOL7TecWVpYNHUMPmIHcIpZjLUpNT2Jp5Btom2Vep0Fh+oECvOHsSsauwUfOI0GzIOj3WD9p0jSYtKHi4eJurHUwOO+tv2x14V+Iw/gTWihaQdNSx5seZmsIBCEIH//Z"
  useEffect(
    ()=>{
        setName(userInfos?.username)
        setEmail(userInfos?.email)
        setPassword(userInfos?.password)
        let l = user?.lang === "Français"? "f":"e"
        setLang(l)
    },[isLoading]
  )
  const deleteImage = async () => {
      await deletePicture()
      window.location.reload()
  }
  return (
    <div className='w-full bg-white rounded-lg p-5 fle flex-col justify-start items-start'>
    <div className='flex justify-between items-ends mb-16'>
        <div className='flex flex-col'>
            <h1 className='font-bold text-md lg:text-lg'>{user?.lang === "Français"? 'Votre Profil':'Your Profil'}</h1>
            <p className='text-sm lg:text-md'><span className='text-gray-400 font-extralight'>{user?.lang === "Français"?"Ajouté le ":"Crated at "}</span> {userInfos?.createAt? formatDate(userInfos.createdAt):"28-01-2024"}</p>
        </div>
        <div className='flex items-center gap-5'>
            <Button disabled = {isLoading || isSaving} onClick={toCancel} className='bg-transparent border transation-all ease-in duration-200  hover:shadow-indigo-400 hover:bg-blue-500 hover:text-white border-blue-500 text-blue-500'> {user?.lang === "Français"? 'Annuler':'Cancel'} </Button> 
            <Button onClick={()=>finalSave()} disabled = {isLoading || isSaving}   className='bg-blue-500 transition-all ease-in duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-indigo-400 gap-1 '>{isLoading ? < div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />: <><Save/>  {user?.lang === "Français"? 'Sauvegarder':'Save'}</>} </Button> 
        </div>

    </div>
    <div className='flex flex-col mt-16 gap-5 items-start justify-start'>
            <h1 className='flex items-center gap-1 font-bold'>
                <ImageUp className='text-blue-500'/>
                {user?.lang === "Français"? 'Photo de profil':'Profil picture'} 
            </h1>
            <div className='flex flex-wrap items-center gap-2 justify-start  '>
                {isLoading? < div className="w-32 h-32 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />:<img className='w-32 h-32 rounded-full object-cover'  src={img?.secure_url? img?.secure_url:userInfos?.picture? userInfos?.picture:defaultImage} alt="profil picture" title ="profil picture"/>}   
                <div className='flex items-center justify-start gap-2'>
                 <CldUploadWidget
                          uploadPreset="school"
                          onSuccess={(result, { widget }) => {
                            setImg(result.info);
                            widget.close();
                          }}
                        >
                          {({ open }) => {
                            return (
                              <label onClick={() => open()} htmlFor='cv' className='cursor-pointer '>
                                  <Button disabled = {isLoading|| isSaving}     className='bg-blue-500 transition-all ease-in duration-200 hover:bg-blue-700 hover:shadow-md hover:shadow-indigo-400 gap-1 '> {user?.lang === "Français"? 'Modifié la photo':'Update the picture'} </Button> 
             
                              </label>
                            );
                          }}
                        </CldUploadWidget>
                        <Button disabled = {isLoading || isSaving}  onClick={()=>deleteImage()}   className='bg-red-200 hover:bg-red-300 hover:text-red-700 text-red-600 transition-all ease-in duration-200 hover:shadow-md hover:shadow-red-500'> {user?.lang === "Français"? 'Supprimer':'Delete'} </Button>

                </div>
            </div>
            <div className='flex w-full flex-col gap-5 mt-16 items-start justify-start'>
                <h1 className='flex items-center gap-1 font-bold'>
                    <User className='text-blue-500'/>
                    {user?.lang === "Français"? "Informations personnelles":"Personnal information"}
                </h1>
                <div className='grid w-full grid-cols-1 lg:grid-cols-2 gap-10'>
                    <div className='flex flex-col items-start justify-start'>
                        <h3 className='font-light mb-1'>{user?.lang === "Français"?"Nom utilisateur":"Username"}</h3>
                        <Input value={name} onChange={(e)=>setName(e.target.value)} className='border !outline-blue-400' placeholder={user?.lang === "Français"?"Nom utilisateur":"Username"}/>
                    </div>
                    <div className='flex flex-col items-start justify-start'>
                        <h3 className='font-light mb-1'>Email</h3>
                        <Input value={email} onChange={(e)=>setEmail(e.target.value)} className='border !outline-blue-400' placeholder='Email'/>
                    </div>
                    <div className='flex flex-col items-start justify-start'>
                        <h3 className='font-light mb-1'>{user?.lang === "Français"?"Mot de passe":"Password"}</h3>
                        <Input value={password} onChange={(e)=>setPassword(e.target.value)} className='border !outline-blue-400' placeholder={user?.lang === "Français"?"Mot de passe":"Password"}/>
                    </div>
                    <div className='flex flex-col items-start justify-start'>
                        <h3 className='font-light mb-1'>{user?.lang === "Français"?"Langue":"Language"}</h3>
                         <Select value={lang} onValueChange={(e)=>setLang(e)}>
                             <SelectTrigger className='!outline-blue-400'>
                                 <SelectValue placeholder={user?.lang === "Français"?"Selectionnez le langage":"Select a language"} />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectGroup>
                                     <SelectItem value="f">{user?.lang === "Français"?"Français":"French"}</SelectItem>
                                     <SelectItem value="e">{user?.lang === "Français"?"Anglais":"English"}</SelectItem>
                                 </SelectGroup>
                             </SelectContent>
                         </Select>
                    </div>
                </div>
            </div>
        </div>
 </div>
  )
}
