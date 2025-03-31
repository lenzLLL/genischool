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
import { MdClass, MdWhatsapp } from "react-icons/md"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/hooks/user/use-user"
import { Parent, Student } from "@prisma/client"
import { toast } from "react-toastify"

export function FeesFilter({user,students}:{user:AuthSchema|null,students:(Student&{parent:Parent})[]}) {
 
  const router = useRouter()
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString()); 
  const currentQuery = Object.fromEntries(searchParams.entries());
  const pathname = usePathname(); 
  const [message,setMessage] = useState("")
  const {sendwhatsapp} = useUser()
  const saveAllMessages = async () => {
    if(!message){
      let msg = user?.lang === "Français"?"veillez entrer un message!":"You have to type a message!"
      toast.error(msg)
      return
    }
    for(let i =0;i<students.length;i++){
      await sendwhatsapp({s:{s:students[i].phone||"",p:students[i].parent.phone},msg:message})
    }
    let msg = user?.lang === "Français"?"Message(s) envoyé(s) avec succès !":"Message(s) sent successfully!"
    toast.success(msg)
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
                               <Button style={{background:"linear-gradient(to top, #25C371, #25D366)"}}><MdWhatsapp  size={30}/></Button>
               
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>{user?.lang === "Français"? "Envoyez un message sur whatsapp":"Send a message on WhatsApp"}</DrawerTitle>
            <DrawerDescription>{user?.lang === "Français"? "Vous avez la possibilité de communiquez avec les élèves et leurs parents via whatsapp.":"You have the possibility to communicate with students and their parents via WhatsApp."}</DrawerDescription>
          </DrawerHeader>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-6 space-y-4">
                  <Textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder={user?.lang === "Français"?"Entrez votre message ici":"Type your message here."} />
              </CardContent>
            </Card>
          </div>
          <DrawerFooter>
            <Button style={{background:"linear-gradient(to top, #25C371, #25D366)"}} onClick={saveAllMessages} className="bg-blue-700 hover:bg-blue-700 flex justify-center items-center gap-1"> {user?.lang === "Français"? 'Envoyer':'Send'}</Button>
                        <DrawerClose asChild>
              <Button variant="outline">{user?.lang === "Français"? 'Annuler':'Cancel'}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
