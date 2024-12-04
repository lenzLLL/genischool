"use server"
import { getCurrentUser } from '@/lib/functs';
import prisma from '@/lib/prisma';
import React from 'react'

export default async function SelectComponents()  {
    const currentUser = await getCurrentUser()
    const schools = await prisma.class.findMany({where:{schoolId:currentUser?.schoolId}})
    return (
    <select
    multiple
    className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
    // {...register("classes")}
    
  >
         {schools.map(
      (teache: { id: string;name: string }) => (
        <option value={teache.id} key={teache.id}>
          {teache.name}
        </option>
      )
    )}
  </select>
  )
}
