"use client"
import React,{useState} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toLogin } from '@/lib/functs'
import toast, { Toaster } from 'react-hot-toast';
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'
import { useNavigation } from 'react-day-picker'
import { School } from '@prisma/client'
export default function AuthForm({school}:{school:School[]}) {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [institut,setInstitut] = useState("Choisir une institution")
    const [role,setRole] = useState("Rôle")
    const router = useRouter()
    // const signIn = async () => {
    //     if(!email || !password){
    //     alert("Error, empty fields!")

    //     }    
    //     const r = await toLogin({email,password})
        
    //     if(r){
    //        if(r.email ="owner@gmail.com"){
    //            router.push("/owner")
    //        }
    //        else if(r.schools[0]?.role === "a") {
    //             router.push("/admin")            
    //         }           
    //     }
    //     else{
    //         alert("Error")
    //     }
    // }
    return (
    <div className='bg-black rounded-md flex items-center justify-center   bg-opacity-[0.35] top-0 bottom-0 right-0 h-screen  lg:w-screen left-0 z-2 absolute'>
    <div className ="lg:w-[50vw] lg:h-auto  w-[90vw] flex flex-col items-start justify-start bg-black bg-opacity-[0.75] p-7 md:p-8 lg:p-14">
        <h2 className='text-white text-3xl font-bold'>Se Connecter</h2>
        <div className='mt-5 w-full flex flex-col gap-3'>
            <div className='w-full'>
                <select value={institut} onChange={(e)=>setInstitut(e.target.value)} className='flex h-10 w-[100%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                    <option>Choisir une institution</option>
                    {
                        school.map((s)=>{
                            return <option value={s.id} key = {s.id}>
                                {s.name}
                            </option>
                        })
                    }
                </select>
            </div>
            { institut !== "Choisir une institution" &&            <div className='w-full'>
                <select value={role} onChange={(e)=>setRole(e.target.value)} className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                    <option>Rôle</option>
                    {
                        ["Etudiant/Elève","Professeur/Enseignant","Parent","Administrateur"].map((s)=>{
                            return <option value={s} key = {s}>
                                {s}
                            </option>
                        })
                    }
                </select>
            </div>}
            {
                role === "Etudiant/Elève" && <><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='h-14  w-full outline-sky-500 rounded-md'/>
                <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='password' className='h-14 w-full outline-sky-500 rounded-md'/>
                </>
            }
            <Button className='bg-sky-500  hover:bg-sky-700 w-[100%] '>Connexion</Button>
            {/* <h2 className='text-white text-center'>Forget Password? <span className='text-sky-500 cursor-pointer'>click here</span></h2> */}
        </div>
    </div>
</div>
  )
}
