"use client"
import React,{useState} from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { toLogin } from '@/lib/functs'
import toast, { Toaster } from 'react-hot-toast';
import { redirect } from 'next/dist/server/api-utils'
import { useRouter } from 'next/navigation'
import { useNavigation } from 'react-day-picker'
export default function AuthForm() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const router = useRouter()
    const signIn = async () => {
        if(!email || !password){
        alert("Error, empty fields!")

        }    
        const r = await toLogin({email,password})
        if(r){
            if(r.role === "a") {
                router.push("/admin")            
            }           
        }
        else{
            alert("Error")
        }
    }
    return (
    <div className='bg-black rounded-md flex items-center justify-center   bg-opacity-[0.35] top-0 bottom-0 right-0 h-screen w-screen left-0 z-2 absolute'>
    <div className ="w-screen h-screen lg:h-auto  lg:w-auto flex flex-col items-start justify-start bg-black bg-opacity-[0.75] p-14">
        <h2 className='text-white text-3xl font-bold'>Sign In</h2>
        <div className='mt-5 flex flex-col gap-3'>
            <Input value={email} onChange={e=>setEmail(e.target.value)} placeholder='email' className='h-14 max-w-[90vh] w-[500px] outline-sky-500 rounded-md'/>
            <Input value={password} onChange={e=>setPassword(e.target.value)}  placeholder='password' className='h-14 max-w-[90vh]  w-[500px] outline-sky-500 rounded-md'/>
            <Button onClick={()=>signIn()} className='bg-sky-500  hover:bg-sky-700 max-w-[90vh] '>Sign In</Button>
            <h2 className='text-white text-center'>Forget Password? <span className='text-sky-500 cursor-pointer'>click here</span></h2>
        </div>
    </div>
</div>
  )
}
