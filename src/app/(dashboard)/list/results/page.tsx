import React from 'react'
import AttendanceLeft from '@/components/attendance/left'
import AttendanceRight from '@/components/attendance/right'
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/functs';
import { Prisma } from '@prisma/client';
import ResultComponent from '@/components/resultats/result';
 
export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
})  {
  const currentUser = await getCurrentUser()
  const query3: Prisma.ClassWhereInput = {};
  query3.schoolId =currentUser?.schoolId
  const classes = await prisma.class.findMany({
    where:query3,
    orderBy:{
      name:"asc"
    }
  })
  const subjects = await prisma.subject.findMany({
    where:{
      schoolId:currentUser?.schoolId||"",
    }
  })
  const currentYear = await prisma.schoolyear.findUnique({
    include:{
        semestres:{
          include:{
            session:{
              include:{
                sessions:true
              }
            }
          }
        }  
    },
    where:{id:currentUser?.currentSchoolYear? currentUser.currentSchoolYear:""}})
  const school = await prisma.school.findUnique({
    where:{ 
        id:currentUser?.schoolId
    },
    include:{
      schoolyears:true,  
    }
  })
  return (
    <div className='gap-5 p-5'>
        <ResultComponent current = {currentYear} school = {school} user = {currentUser||null} subjects = {subjects} classes={classes}/>
    </div>
  )
}
