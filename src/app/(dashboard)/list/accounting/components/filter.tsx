"use client"
import { format } from "date-fns"
import React,{useState,useEffect} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import Image from "next/image"
import { AuthSchema } from "@/lib/schemas"
import { CalendarIcon, Dice1, MapPin, School, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MdClass } from "react-icons/md"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { fr } from "date-fns/locale"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"


export function AccountingFilter({user}:{user:AuthSchema}) {
 
  const router = useRouter()
  const [isCalendarOpen,setIsCalendarOpen]  = useState(false)
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString()); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const pathname = usePathname(); 
  const [classId,setClassId] = useState("")
  const [tri,setTri] = useState("")
  const [status,setStatus] = useState("")
  const fixQuery = () => {
    // Créer un nouvel objet à partir des paramètres de recherche actuels
    const currentQuery = Object.fromEntries(searchParams.entries());
    let date = form.getValues("date")
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    currentQuery.date = formattedDate
    const newSearch = new URLSearchParams(currentQuery).toString();
    const newUrl = `${pathname}?${newSearch}`;
    router.push(newUrl);
  };
  const formSchema = z.object({
    date: z.date({
      required_error: "Veuillez sélectionner une date.",
    }),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
    },
  })
  function onSubmit(data: z.infer<typeof formSchema>) {
    
  }

  const resetParams = () =>{
    setStatus("")
    setClassId("")
    setTri("") 
    let newUrl = pathname
    const currentQuery = Object.fromEntries(searchParams.entries());
    
    // Conserver uniquement le paramètre 'page'
    if(currentQuery.page){
      const newQuery = { page: currentQuery.page };
      const newSearch = new URLSearchParams(newQuery).toString();
      newUrl = `${pathname}?${newSearch}`;
    }

    // Pousser la nouvelle route avec l'URL mise à jour
    router.push(newUrl);  
  }
  useEffect(
    ()=>{
        const currentQuery = Object.fromEntries(searchParams.entries());
        if(currentQuery.date){
          setTri(currentQuery.tri)
        }  
    },[]
  )
  return (
    <div className="relative">
     
                  <button onClick={()=>setIsCalendarOpen(!isCalendarOpen)} className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                    <Image src="/filter.png" alt="" width={14} height={14} />
                  </button>
      
      
              { isCalendarOpen &&   <div className="fixed z-[99999999999999999] shadow-md top-0 right-0 bg-white">
     
        
        
                    <Calendar
                      mode="single"
                      onSelect={(date) => {
                        setIsCalendarOpen(false)
                      }}
                      initialFocus
                      locale={fr}
                    />
             

          
   

   
     
   </div> 
    }
              
    </div>
  )
}
