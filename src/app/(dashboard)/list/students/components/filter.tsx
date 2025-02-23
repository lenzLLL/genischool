"use client"

import React,{useState,useEffect} from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
import { Dice1, MapPin, School, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MdClass } from "react-icons/md"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

export function StudentFilter({user,classes}:{user:AuthSchema,classes:any[]}) {
 
  const router = useRouter()
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

    // Supprimer le paramètre 'exam' s'il existe
    if (currentQuery.exam) {
        delete currentQuery.exam;
    }

    // Ajouter ou modifier les paramètres classId, status et tri
    if (classId) {
        currentQuery.classId = classId;
    }
    if (status) {
        currentQuery.status = status;
    }
    if (tri) {
        currentQuery.tri = tri;
    }
    if(status === "t"){
      delete currentQuery.status
    }
    // Ajouter ou modifier 'lesson' et 'time'
   

    // Construire la nouvelle chaîne de requête
    const newSearch = new URLSearchParams(currentQuery).toString();
    const newUrl = `${pathname}?${newSearch}`;

    // Pousser la nouvelle route avec l'URL complète
    router.push(newUrl);
};
  
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
        if(currentQuery.status){
          setStatus(currentQuery.status)
        }
        if(currentQuery.classId){
          setClassId(currentQuery.classId)
        } 
        if(currentQuery.tri){
          setTri(currentQuery.tri)
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
                  <div className="w-full md:w-1/3">
                    <h2 className="text-base font-semibold mb-3 flex items-center text-gray-800">
                      <SlidersHorizontal className="mr-2 h-5 w-5" />
                      {user?.lang === "Français"? "Tri par":"Filter by"}
                    </h2>
                    <Select value={tri} onValueChange={(e)=>setTri(e)}>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder={user?.lang === "Français"? "Choisir un tri":"Choose a sort"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">{user?.lang === "Français"? "Nom Croissant":"Name Ascending"}</SelectItem>
                        <SelectItem value="name-desc">{user?.lang === "Français"? "Nom Décroissant":"Name Descending"}</SelectItem>
                        <SelectItem value="price-asc">{user?.lang === "Français"? "Pension Scolaire Croisssante":"School Fees Ascending"}</SelectItem>
                        <SelectItem value="price-desc">{user?.lang === "Français"? "Pension Scolaire Décroisssante":"School Fees Descending"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full md:w-1/2">
                    <h2 className="text-base font-semibold mb-3 flex items-center text-gray-800">
                    <Dice1  className="mr-2 h-5 w-5" />
                      {user?.lang === "Français"? "Classe":"Class"}
                    </h2>
                    <div className="flex items-center space-x-4">
                    <Select value={classId} onValueChange={(e)=>setClassId(e)}>
                      <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder={user?.lang === "Français"? "Choisir une classe":"Choose a class"} />
                      </SelectTrigger>
                      <SelectContent>
                          {
                            classes.map(
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

                <div className="flex justify-center pt-6">
                  <Tabs  onValueChange={(e)=>setStatus(e)} defaultValue={status||"t"} className="w-full" >
                    <TabsList className="w-full sm:w-auto mx-auto grid grid-cols-3 h-10">
                      <TabsTrigger value="t" className="text-sm px-2">
                        {user?.lang === "Français"? "Tous":"All"}
                      </TabsTrigger>
                      <TabsTrigger value="s" className="text-sm px-2">
                      {user?.lang === "Français"? "Soldé":"Discounted"}

                      </TabsTrigger>
                      <TabsTrigger value="n" className="text-sm px-2">
                      {user?.lang === "Français"? "Non Soldé":"Not Discounted"}

                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
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
