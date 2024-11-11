"use client"
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import React,{ useEffect,useState } from "react";

export const useTeacher = async () => {
  const [data,setData] = useState<any>([])
  const [count,setCount] = useState(0)
  const [message,setMessage] =  useState("look")
  const [isExecuted,setIsExecuted] = useState(false)
  const [isLoading,setIsLoading] = useState(false)
  const getAllTeachers = async () => {
    const [data, count] = await prisma.$transaction([
        prisma.teacher.findMany({

          include: {
            subjects: true,
            classes: true,
          },
          take: ITEM_PER_PAGE,
          skip: ITEM_PER_PAGE * (1 - 1),
        }),
        prisma.teacher.count({  }),
      ]); 

      setCount(count)
      setData(data)
  }
  useEffect(
    ()=>{
        if(isExecuted)
        {
            return
        }
        getAllTeachers()
        setIsExecuted(true)
    },[]
  )   
 

  return {data,count,message}
}