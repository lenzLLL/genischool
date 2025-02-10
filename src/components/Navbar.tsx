// import { getCurrentUser } from "@/lib/functs"
import { getCurrentUser } from "@/lib/functs"
import { Menu } from "lucide-react"
import Image from "next/image"
import { MobileSidebar } from "./sidebar/mobile-sidebar"
import React,{useState} from "react"
import { AuthSchema } from "@/lib/schemas"
import { useUser } from "@/hooks/user/use-user"
import NavComponent from "./NavComponent"
const Navbar = async ({currentUser}:{currentUser:AuthSchema}) => {
  
  return (
    <NavComponent currentUser = {currentUser}/>
  )
  
}

export default Navbar