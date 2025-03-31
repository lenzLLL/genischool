"use client"
import React,{useState} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {toast} from 'react-toastify';
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'
import { useNavigation } from 'react-day-picker'
import { School } from '@prisma/client'
import { toLogin } from '@/lib/functs';
import { useUser } from '@/hooks/user/use-user';
export default function ForgetForm({school}:{school:School[]}) {
    const [email,setEmail] = useState("")
    const [role,setRole] = useState("")
    const router = useRouter()
    const {isLoading,forgetadmininfos,user} = useUser()
    const submit  = async () =>{
       if(!email || email.length < 13){
          let msg = user?.lang === "Français"? "Veillez entre un numéro téléphonique exemple: +237671434007":"Please enter a phone number, example: +27671434007"
          toast.error(msg)
          return
       }
       await forgetadmininfos({tel:email})
    }
    return (
    <div className='bg-black rounded-md flex items-center justify-center   bg-opacity-[0.35] top-0 bottom-0 right-0 h-screen  lg:w-screen left-0 z-2 absolute'>
    <div className ="lg:w-[50vw] lg:h-auto  w-[90vw] flex flex-col items-start justify-start bg-black bg-opacity-[0.75] p-7 md:p-8 lg:p-14">
        <h2 className='text-white text-xl mx-auto text-center font-bold'>Recupérer vos informations d'authentification</h2>
        <div className='mt-5 w-full flex flex-col gap-3'>
           
               
         
              {/* {
                (role === "Professeur/Enseignant" || role === "Parent"  ) && <><Input value={contact} onChange={e=>setContact(e.target.value)} placeholder='Contact' className='h-14  w-full outline-sky-500 rounded-md'/>
                <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='Mot de passe' className='h-14 w-full outline-sky-500 rounded-md'/>
                </>
            } */}
               <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder='Contact exemple: +237671434007' className='h-14  ws-full outline-sky-500 rounded-md'/>
              
            <Button onClick={()=>submit()} className='bg-sky-500  hover:bg-sky-700 w-[100%] '>{isLoading? < div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />:"Envoyer" }</Button>
            <Button onClick={()=>router.push("/sign-in")} className='bg-transparent hover:bg-sky-700 border transition-all duration-100 ease-in  border-sky-700  '>Se Connecter</Button>
            {/* <h2 className='text-white text-center'>Forget Password? <span className='text-sky-500 cursor-pointer'>click here</span></h2> */}
        </div>
    </div>
</div>
  )
}
