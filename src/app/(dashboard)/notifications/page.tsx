"use client"
import React,{useEffect,useState} from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { useUser } from '@/hooks/user/use-user'
import { BellOff } from 'lucide-react';
export default function Page() {
    const {user,isLoading,getNotifications} = useUser()
    const [notifications,setNotifications] = useState<any[]>([])
    const getNot = async () => {
        const r = await getNotifications()
        setNotifications(r||[])
    }
    useEffect(
        ()=>{
            getNot()
        },[isLoading]
    )
    return (
    <div className='w-full min-h-screen p-3 lg:p-16'>
        <div className='bg-white w-[100%] p-0 lg:p-10 rounded-lg'>
        <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">{user?.lang === "Français"? "Tout":"All"}</TabsTrigger>
        <TabsTrigger value="success">{user?.lang === "Français"? "Succès":"Success"}</TabsTrigger>
        <TabsTrigger value="info">Informations</TabsTrigger>
        <TabsTrigger value="warning">{user?.lang === "Français"? "Avertissement":"Warning"}</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
      <Stack sx={{ width: '100%',marginTop:"20px" }} spacing={1}>
          {
            (notifications.length > 0) && notifications.map(
                (n:any)=>{
                    return (
                        <Alert key={n.id} variant="filled" severity={n.type}>
                             {n.msg}
                        </Alert>
                    )
                }
            )
          }
          {
            (notifications.length === 0) && <div className='flex flex-col items-center justify-center bg-gray-50 w-full rounded-lg p-10'>
                <BellOff />
                <p>
                    {
                        user?.lang === "Français"?"Aucune notification":"No notification"
                    }
                </p>
            </div>
          }  
    </Stack>  
      </TabsContent>
      <TabsContent value="success">
          <Stack sx={{ width: '100%',marginTop:"20px" }} spacing={1}>
          {
            (notifications.filter(n=>n.type === "success").length > 0) && notifications.filter(n=>n.type === "success").map(
                (n:any)=>{
                    return (
                        <Alert key={n.id}  variant="filled" severity={n.type}>
                             {n.msg}
                        </Alert>
                    )
                }
            )
          }
          {
            (notifications.filter(n=>n.type === "success").length === 0) && <div className='flex flex-col items-center justify-center bg-gray-50 w-full rounded-lg p-10'>
                <BellOff />
                <p>
                    {
                        user?.lang === "Français"?"Aucune notification":"No notification"
                    }
                </p>
            </div>
          }  
          </Stack>
      </TabsContent>
      <TabsContent value="info">
      <Stack sx={{ width: '100%',marginTop:"20px" }} spacing={1}>
          {
            (notifications.filter(n=>n.type === "info").length > 0) && notifications.filter(n=>n.type === "info").map(
                (n:any)=>{
                    return (
                        <Alert key={n.id}  variant="filled" severity={n.type}>
                             {n.msg}
                        </Alert>
                    )
                }
            )
          }
          {
            (notifications.filter(n=>n.type === "info").length === 0) && <div className='flex flex-col items-center justify-center bg-gray-50 w-full rounded-lg p-10'>
                <BellOff />
                <p>
                    {
                        user?.lang === "Français"?"Aucune notification":"No notification"
                    }
                </p>
            </div>
          }  
          </Stack>
      </TabsContent>
      <TabsContent value="warning">
      <Stack sx={{ width: '100%',marginTop:"20px" }} spacing={1}>
          {
            (notifications.filter(n=>n.type === "warning").length > 0) && notifications.filter(n=>n.type === "warning").map(
                (n:any)=>{
                    return (
                        <Alert key={n.id}  variant="filled" severity={n.type}>
                             {n.msg}
                        </Alert>
                    )
                }
            )
          }
          {
            (notifications.filter(n=>n.type === "warning").length === 0) && <div className='flex flex-col items-center justify-center bg-gray-50 w-full rounded-lg p-10'>
                <BellOff />
                <p>
                    {
                        user?.lang === "Français"?"Aucune notification":"No notification"
                    }
                </p>
            </div>
          }  
          </Stack>
      </TabsContent>
      </Tabs>
        </div>
    </div>
  )
}
