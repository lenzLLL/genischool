"use client"

import React,{useState,useEffect} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr,enGB } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
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
import { CalendarIcon, Dice1, MapPin, NotebookPen, School, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"



export function ExamFilter({user,subjects,classes}:{user:AuthSchema|null,subjects:any[],classes:any[]}) {
 
  const router = useRouter()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString()); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const pathname = usePathname(); 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [classId,setClassId] = useState("")
  const [filterDate,setFilterDate] = useState<string|null>("")
  const [bruteDate,setBruteDate] = useState<Date|null>(null)
  const [date,setDate] = useState("")
  const [subjectId,setSubjectId] = useState("")
  const fixQuery = () => {
    // Créer un nouvel objet à partir des paramètres de recherche actuels
    const currentQuery = Object.fromEntries(searchParams.entries());

    // Supprimer le paramètre 'exam' s'il existe
   

    // Ajouter ou modifier les paramètres classId, status et tri
    if (classId) {
        currentQuery.classId = classId;
    }
    if (date) {
        currentQuery.date = date;
    }
    if (subjectId) {
        currentQuery.subjectId = subjectId;
    }
  
    // Ajouter ou modifier 'lesson' et 'time'
   

    // Construire la nouvelle chaîne de requête
    const newSearch = new URLSearchParams(currentQuery).toString();
    const newUrl = `${pathname}?${newSearch}`;

    // Pousser la nouvelle route avec l'URL complète
    router.push(newUrl);
  };
  const resetParams = () =>{
    setSubjectId("")
    setClassId("")
    setDate("") 
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
          setDate(currentQuery.date)
        }
        if(currentQuery.classId){
          setClassId(currentQuery.classId)
        } 
        if(currentQuery.subjectId){
          setSubjectId(currentQuery.tri)
        }  
    },[]
  )
  return (
    <Drawer>
      <DrawerTrigger asChild>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                    <Image src="/filter.png" alt="" width={14} height={14} />
                  </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{user?.lang === "Français"? "Section de filtre":"Filter Section"}</DrawerTitle>
            <DrawerDescription>{user?.lang === "Français"? "Optimisez vos resultats grâce à un système de filtre":"Optimize your results with a filtering system"}</DrawerDescription>
          </DrawerHeader>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-full md:w-1/2">
                    <h2 className="text-base font-semibold mb-3 flex items-center text-gray-800">
                      <Dice1 className="mr-2 h-5 w-5" />
                      {user?.lang === "Français"? "Selectionnez une classe":"Select a class"}
                    </h2>
                    <Select value={classId} onValueChange={(e)=>setClassId(e)}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder={user?.lang === "Français"? "Choisir une classe":"Choose a classe"} />
                      </SelectTrigger>
                      <SelectContent>
                          {
                            classes.map(
                              (c)=>{
                                  return    (<SelectItem value={c.id}>{c.name}</SelectItem>
                                  )
                              }
                            )
                          }  
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-1/2">
                    <h2 className="text-base font-semibold mb-3 flex items-center text-gray-800">
                    <NotebookPen  className="mr-2 h-5 w-5" />
                      {user?.lang === "Français"? "Classe":"Class"}
                    </h2>
                    <div className="flex items-center space-x-4">
                    <Select value={subjectId} onValueChange={(e)=>setSubjectId(e)}>
                      <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder={user?.lang === "Français"? "Choisir une matière":"Choose a subject"} />
                      </SelectTrigger>
                      <SelectContent>
                          {
                            subjects.map(
                                (c,i)=>{
                                    return (
                                        <SelectItem value={c?.id}>{c?.name}</SelectItem>
                                    )
                                }
                            )
                          }
                      </SelectContent>
                    </Select>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 z-[99999999999999999]">
                
                    <div className="relative">
                      <Button
                        onClick={()=>setIsCalendarOpen(!isCalendarOpen)}
                        variant={"outline"}
                        className={cn(
                          "w-full h-12",
                          !filterDate && "text-muted-foreground",
                        )}
                      >
                        {bruteDate ? (
                          format(bruteDate, "d MMMM yyyy", { locale:user?.lang === "Français"? fr:enGB })
                        ) : (
                          <span>{user?.lang === "Français"? 'Sélectionner une date':'Select a date'}</span>
                        )}
                        <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                      </Button>
                    
               
                   { isCalendarOpen && 
                    <Calendar
                      mode="single"
                      className="z-[99999999999999999] cursor-pointer absolute bottom-0 shadow-lg rounded-md bg-white"
                      
                      onSelect={(date) => {
                        if(date){
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois sont indexés à partir de 0
                          const day = String(date.getDate()).padStart(2, '0');
                          const formattedDate = `${year}-${month}-${day}`;
                          setDate(formattedDate)
                          setBruteDate(date)
                        }
                        setIsCalendarOpen(false)
                      }}
                      initialFocus
                      locale={fr}
                    />
                    }
                   </div>
                
                </div>
                {/* <label htmlFor="date" className="col-span-2 w-full border border-gray-400 p-3 py-2.5 rounded-md">
                  <input className="w-full text-gray-400 outline-none" id = "date" type = "date"/>
                </label> */}
              
              </CardContent>
            </Card>

           
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
            <Button onClick={fixQuery} className="bg-blue-700 hover:bg-blue-700">{user?.lang === "Français"? 'Appliquer':'Apply'}</Button>
            </DrawerClose>
            <DrawerClose asChild>
                <Button onClick={resetParams}>{user?.lang === "Français"? 'Réinitialiser':'Reset'}</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">{user?.lang === "Français"? 'Annuler':'Cancel'}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
