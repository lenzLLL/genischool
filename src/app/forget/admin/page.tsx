"use server"
import React from 'react'
import AuthForm from '@/components/forms/authForm'
import prisma from '@/lib/prisma'
import ForgetForm from '@/components/forms/forgetForm'

type Props = {}

const SignUp = async (props: Props) => {
 
    const school = await  prisma.school.findMany({orderBy:[]})
    return (
    <div className="h-full w-full relative">
        <div className='z-1 absolute'>
            <img src='/bg.jpg' className='w-screen h-screen' alt =''/>
        </div>  
      <ForgetForm school = {school}/>
    </div>
  )
}

export default SignUp