import React from 'react'

import AttendanceLeft from '@/components/attendance/left'
import AttendanceRight from '@/components/attendance/right'
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/functs';
import { Prisma } from '@prisma/client';
 
export default async function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
})  {
   const query3: Prisma.ClassWhereInput = {};
   const query: Prisma.LessonWhereInput = {};
   const query2: Prisma.ExamWhereInput = {};
   const query4:Prisma.StudentWhereInput = {}
   
   const {...queryParams } = searchParams;
   if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "classId":
            query2.classes = {some:{id:value}};
            query.classes = {some:{classId:value}};
            query4.currentClassId = value
            break;
          case "start":
            query.startTime = {gte:new Date(value)} 
            query2.startTime = {gte:new Date(value)}
            console.log(value) 
            break
          case "end":
               query.endTime = {lte:new Date(value)} 
               query2.endTime = {lte:new Date(value)} 
               break
          case "search":
                query4.username = { contains: value, mode: "insensitive" };
                break;
          default:
            break;
        }
      }
    }
  }

  const currentUser = await getCurrentUser()
  query.schoolId = currentUser?.schoolId
  query4.schoolId = currentUser?.schoolId
  query2.classes = {some:{schoolId:currentUser?.schoolId}}
  const [data1, count1] = await prisma.$transaction([
    prisma.lesson.findMany({
        where:query,
        include:{
          teacher:true,
          subject:true,
        }
    }),
    prisma.class.count(),
  ]);
  const [data2, count2] = await prisma.$transaction([
    prisma.exam.findMany({
        where:query2,
        include:{
          teacher:true,
          subject:true,
        }
    }),
    prisma.exam.count(),
  ]);

  const studentsWithAttendanceSum = await prisma.student.findMany({
    where: query4,
    include: {
      attendances:true
    },
  });
  
  // Calculer la somme des temps d'attendance pour chaque étudiant
  const students = await Promise.all(studentsWithAttendanceSum.map(async (student) => {
    const totalTime = await prisma.attendance.aggregate({
      _sum: {
        time: true,
      },
      where: {
        studentId: student.id, // Assurez-vous d'adapter cela à votre schéma
      },
    });
  
    return {
      ...student,
      totalTime: totalTime._sum.time  || 0 as number, // Ajoute la somme au résultat
    };
  }));
  query3.schoolId = currentUser?.schoolId
  const classes = await prisma.class.findMany({
    where:query3,
    orderBy:{
      name:"asc"
    }
  })
  return (
    <div className='grid grid-cols-10 gap-5 p-5'>
        <AttendanceLeft classes = {classes} data1 = {data1} data2 = {data2}/>
        <AttendanceRight students={students} data1 = {data1} data2 = {data2}/>
    </div>
  )
}
