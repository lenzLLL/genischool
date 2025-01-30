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
export default function AuthForm({school}:{school:School[]}) {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [contact,setContact] = useState("")
    const [matricule,setMatricule] = useState("")
    const [schoolId,setSchoolId]=useState("")
    const [institut,setInstitut] = useState("Choisir un établissement")
    const [role,setRole] = useState("Rôle")
    const router = useRouter()
 
    const submit  = async () =>{
        const r = await toLogin({data:{
            email, password, matricule, role, schoolId: institut, fullname: null,
            currentSchoolYear: null,
            id: null,
            lang: null
        }}) 
        if(r.error){
            toast(r.error)    
        }else if(r.route){
            router.push(r?.route)
        }
    }
    return (
    <div className='bg-black rounded-md flex items-center justify-center   bg-opacity-[0.35] top-0 bottom-0 right-0 h-screen  lg:w-screen left-0 z-2 absolute'>
    <div className ="lg:w-[50vw] lg:h-auto  w-[90vw] flex flex-col items-start justify-start bg-black bg-opacity-[0.75] p-7 md:p-8 lg:p-14">
        <h2 className='text-white text-3xl font-bold'>Se Connecter</h2>
        <div className='mt-5 w-full flex flex-col gap-3'>
            <div className='w-full'>
                <select value={institut} onChange={(e)=>setInstitut(e.target.value)} className='flex h-10 w-[100%] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                    <option>Choisir un établissement</option>
                    {
                        school.map((s)=>{
                            return <option value={s.id} key = {s.id}>
                                {s.name}
                            </option>
                        })
                    }
                </select>
            </div>
            { institut !== "Choisir un établissement" &&            <div className='w-full'>
                <select value={role} onChange={(e)=>setRole(e.target.value)} className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'>
                    <option>Rôle</option>
                    {
                        ["Etudiant/Elève","Professeur/Enseignant","Parent","Administrateur","Comptable","Caissier"].map((s)=>{
                            return <option value={s} key = {s}>
                                {s}
                            </option>
                        })
                    }
                </select>
            </div>}
            {
                role === "Etudiant/Elève" && <><Input value={email} onChange={e=>setMatricule(e.target.value)} placeholder='matricule' className='h-14  w-full outline-sky-500 rounded-md'/>
                <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='Mot de passe' className='h-14 w-full outline-sky-500 rounded-md'/>
                </>
            }
              {
                (role === "Professeur/Enseignant" || role === "Parent"  ) && <><Input value={contact} onChange={e=>setContact(e.target.value)} placeholder='Contact' className='h-14  w-full outline-sky-500 rounded-md'/>
                <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='Mot de passe' className='h-14 w-full outline-sky-500 rounded-md'/>
                </>
            }
              {
                role === "Administrateur" && <><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='h-14  ws-full outline-sky-500 rounded-md'/>
                <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='Mot de passe' className='h-14 w-full outline-sky-500 rounded-md'/>
                </>
            }
            <Button onClick={()=>submit()} className='bg-sky-500  hover:bg-sky-700 w-[100%] '>Connexion</Button>
            {/* <h2 className='text-white text-center'>Forget Password? <span className='text-sky-500 cursor-pointer'>click here</span></h2> */}
        </div>
    </div>
</div>
  )
}
