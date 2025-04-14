"use client"
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { File, JoystickIcon, Languages, Mail, Paperclip, SaveAll, UserRoundSearch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyComponent from '@/components/emptyComponent'
import { useFees } from '@/hooks/fees/use-fees'
import Image from 'next/image'
import { Student } from '@prisma/client'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'
import Secondpagination from '@/components/pagination2'
import { ProgressBar } from '@/components/progress-bar'
import { MdWhatsapp } from 'react-icons/md'
import { FeesFilter } from './components/filter'
import { toast } from 'react-toastify'
export default function Page() {
  type StudentList = Student
  const [currentTranche,setCurrentTranche] = useState("")
  const [newAmount,setNewAmount] = useState<number|null>(null)
  const {settingFees, addAmount,studentBymatricule, currentStudent,isSettingStudent,matricule,setMatricule, selectedUser,setSelectedUser, totalAmount,status,setStatus,tranche,setTranche, students,currentUser,setClassId,classId,classes,isLoading,allstudents,name,setName,getUserByName} = useFees()
  const onCurrentTranche = (v:string) => {
    if(v === '0'){
       setTranche(0)
       setCurrentTranche(v)
       return
    }
    const cs =  classes.find((c)=>c?.id === classId)?.fees?.tranches
    console.log(cs)
    console.log(v)
    const f = cs.find((c:any)=>c.id === v)?.order
    console.log(f)
    setTranche(f)
    setCurrentTranche(v)
  }
  let url = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAwQFAgEGB//EADIQAAICAQICCQMDBAMAAAAAAAABAgMEESESMQUTIjJBUVJhcRRCkYGhsTRicqIjU8H/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/cQAAAI7bYVRcpvRfyBIQXZVVW0pay8kUMjNst2hrCHtzZVAu2dIzb/44qPzuV5ZN8+9bL9NiIAeuTlzbb92ebgAdxtsjyskvhk0M66PN8XyVgBp1dIQltZFwftui3CcZxUotNPxRgnVdk6pcUJNMDeBTxs2NjUbOzN/hlwAAAAAAAHF1kaoOcnokBxk5EKK+KXN8o+ZkXWzulxTe/7IXWytsc5c/wCDgAAAAAAAAAAAAAAF7DzHFqu56x8JPw+SiAPoAZ+Bk8qZvf7WaAAAADJ6Qv623gi+zD92X8y3qaJSXeeyMYAAAAAAElVFlvcjqvPwLWHh8a47o9nwj5mikktEtEgM2HRs335xXxudvo1/9v8AqaAAyLMG6HJKa9is009GtH5H0BBkY1d8e0tJeElzAxgd3VSpnwT5+HucAAAATa5PR+Zs4l3XVKX3LZmMWcC3q70vtls//ANcHh6BmdJz1sjD0rUpEuVLjybH/dp+CIAAABYwaOut1fcju/f2K5rdH18GNF+MtwLKPQAAAAAACvmUddU9F21vFmOfQGNmw6vImlstdUBAAAATaeq5gAbtM+OqM/NanhX6OsX0+jfKTQAzJPik34ttngAAAADbxv6ev/FGIbODLixYey0AnAAAAAAAAMrpP+oX+JqmR0hNSyZafbsBWAAAAAT0W8EGvcEUYtrYAe3R4brF5SOCz0hDhyW/VuVgAAAF3o27hm65PaW6+SkE2mmtmgPoAVMPKVqUZvSz+S2AAAAA5nOMIuU2kkBzfYqqnN+HIxG3JuT5smy8h3z22guSIAAAAAAC9g08dLl/cC3hQ4MaC5arUAQ9J18VcZrnF6foZhvTipwcZLVNaMw7a3VNwlzTA5AAAAlhj22d2uXy1oBEW6c+yGimuNfO5z9DkehflD6HI9K/KAuRz6X3tYv3R087H9f+rKP0OR6F+UPocj0r8oCxZ0jHlXBv3lsUrrrLpa2S18kvAl+hyPSvyh9DkelflAVgTyw8iO7hqvZ6kMk4vSSafk1oB4AAB3RW7bYw9TODR6Mp0TufN7IC8uW2wPQAKfSFHWQ44Ltx8PNFwAfPnVdcrZqEFq3+xczsVxbtrXZfeS8Pcm6OVSp1i9Z/cB3j4ldSTfal5vw+CyAAAAAAAAAAOLK4WR0nFSXudgDJy8N0vjhvX+6KpvySaaa203MeVKnkuvH7S128kBzjUu+xRXd8WbUYqKSjslyRHj0RorUY7vxfmSgAAAAAAo34sq59bi7S8Yl4AVMfMjN8FnYs5aPxLZBfjV395aS9S5lfhy8buvrYLwAvgpw6Qrb4bE4SLMLa592cX8MDsAAAeNpc2l8kNmXRDnYn7LcCc4sshXHWbSRU+rtu2xqn/kxXhOcuPJm5y8lyA5lbbmvgpTjX9zLdFEKIaQW/i/MkilFaJJJeR6AAAAAAAAAAAAAAcTqrmu3BS+UVrMCjTWPFH4YAFO2DqekJzX6kanOXOcvyeAC3RiV26Obk/wBS1DDor5Vp/O56AJktNvI9AAAAAAAAAA//2Q=="
  const getClasses = (value:number) =>{
    if(value<30){
      return "linear-gradient(to top,#c0392b, #e74c3c)"
    }
    else if(value<70){
        return "linear-gradient(to top, #f1c40f, #f39c12)"
    }
    else if(value<100){
        return "linear-gradient(to top, #f39c12, #e67e22)"
    }
    return "linear-gradient(to top, #1abc9c,#2ecc71)"

  }
  const changeNewAmount = (r:number) =>{
    if(!r){
     setNewAmount(null)
    }else{
     setNewAmount(r)
    }
}
const FixNewAmount = () =>{
  let msg = currentUser?.lang === "Français"?"Êtes-vous sûr de vouloir procéder à cette action ?":"Are you sure you want to proceed with this action?"
  const confirmation = confirm(msg);
  addAmount(newAmount||0)
  setNewAmount(null)
}
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 p-5'>
        <div className='bg-white rounded-lg p-3 min-h-screen'>
     
            <div className='grid grid-cols-2 gap-3'>
               <div className="col-span-2">
                 <Select  value = {classId} onValueChange={(e)=>setClassId(e)} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selectionnez une classe" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                           {
                               classes.map(
                                    (c)=><SelectItem value={c?.id}>{c?.name}</SelectItem>
                                )
                            }
                        </SelectGroup>
                    </SelectContent>
                 </Select>
               </div> 
                <Select value = {currentTranche} onValueChange={(e)=>onCurrentTranche(e)} >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tranche" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem   value={'0'}><button >Aucune</button></SelectItem>
                        <SelectGroup>
                           {
                               classes.find((c)=>c?.id === classId)?.fees?.tranches.map(
                                    (c:any)=><SelectItem  value={c?.id}>Tranche {c?.order}</SelectItem>
                                )
                            }
                     
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select value = {status} onValueChange={(e)=>setStatus(e)}  >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                           {
                               [{key:"1",fr:"Soldé"},{key:"2",fr:"Non Soldé"}].map(
                                    (c)=><SelectItem key={c.key} value={c.key}>{c.fr}</SelectItem>
                                )
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className='flex mt-3 justify-between items-center'>
                <div className='flex items-center justify-start gap-2'>
                <Input placeholder={currentUser?.lang !== "Français"? 'student name':'Nom étudiant'} value={name} onChange={(e)=>setName(e.target.value)}/>
                <Button onClick={()=>getUserByName()} className='bg-blue-500 hover:bg-blue-600'>{currentUser?.lang === "Français"? 'Rechercher':'Search'}</Button>
                </div>
                <div>
                    {students.length !== 0 && <FeesFilter user = {currentUser} students={students||[]}/>    }
                    {students.length === 0 && <Button onClick={()=>toast.error(currentUser?.lang === "Français"?"Veillez selectionner des étudiants":"You have to select students")} style={{background:"linear-gradient(to top, #25C371, #25D366)"}}><MdWhatsapp  size={30}/></Button>}

                </div>
            </div> 
            <div>
             {(students.length !== 0 && !isLoading) && <>
                <Table className='mt-5 overflow-hidden'>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/3">{currentUser?.lang === "Français"? "Etudiant":"Student"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Paiement":"Payment"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Reste":"Remaining"}</TableHead>
          <TableHead  className="w-1/3">{currentUser?.lang === "Français"? "Action":"Action"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((s,index) => {
          let a = s?.studentFees[0]?.amount
          return (
          <TableRow key={s?.id}>
            <TableCell className="font-medium">
                   
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{s.username}</h3>
                        </div>
            </TableCell>
            <TableCell>{a.toString()}</TableCell>
            <TableCell>{totalAmount-parseInt(a.toString())}</TableCell>
            <TableCell>
             {selectedUser !== s.id && <Checkbox onClick={()=>setSelectedUser(s.id)} value = {s?.id} checked = {false}/>}
              {selectedUser === s.id &&<Checkbox onClick={()=>setSelectedUser("")} value = {s?.id} checked = {true}/>}
              </TableCell>
          </TableRow>
        )
        }
      )}
      </TableBody>
      
    </Table> 
    <Secondpagination itemsPerPage={10} itemsCount={allstudents.length}/>

                      {/* PAGINATION */}
           </>}
            {
                    ( students.length === 0 && !isLoading) &&  
                     <EmptyComponent msg = {currentUser?.lang === "Français"?'Aucunes données':'No Data'} />
            }
            {
            isLoading && < div className="w-6 mt-24 mx-auto h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            
            }
            </div>       
        </div>

        <div className='bg-white rounded-lg p-3'>
            <div className='flex mt-3 justify-between items-center'>
                <div className='flex items-center justify-start gap-2'>
                <Input value = {matricule} placeholder={currentUser?.lang === "Français"?'Matricule':'Registration Number' } onChange={(e)=>setMatricule(e.target.value)}/>
                <Button onClick={()=>getUserByName()} className='bg-blue-500 hover:bg-blue-600'>{currentUser?.lang === "Français"? 'Rechercher':'Search'}</Button>
            </div>
                <div>
                    {currentStudent && <FeesFilter user = {currentUser} students={[currentStudent]}/>}
                    {!currentStudent && <Button onClick={()=>toast.error(currentUser?.lang === "Français"?"Veillez selectionner un étudiant":"You have to select any student")} style={{background:"linear-gradient(to top, #25C371, #25D366)"}}><MdWhatsapp  size={30}/></Button>}
                    
                </div>
            </div>

            {
             ( currentStudent && !isSettingStudent) && (<>
                   <div className='border  w-full flex justify-start items-center gap-5 rounded-lg mt-10 border-dashed p-4'>
                   
                   <div className='flex flex-col items-center'>
                   <Image
                          src={currentStudent?.img??url}
                          alt=""
                          width={170}
                          height={170}
                          className=" rounded-full object-cover"
                        />
                       <div>
                       <h1 className='text-[#555] font-bold'>{currentStudent?.username}</h1>
                       <h3 className='text-center font-medium tracking-wider text-gray-500'>{currentStudent?.currentClass?.name}</h3>
                       </div>

                   </div>
                   <div className='flex-1 w-full justify-center flex-col gap-3 flex items-center'>
                       {
                              ["1"].map(
                                ()=>{
                                  let i = currentStudent?.school?.inscription
                                  let sum = currentStudent?.studentFees[0]?.fees?.tranches?.reduce(
                                    (acc:number,t:any)=>{
                                        return acc += parseInt(t?.amount.toString())
                                    }
                                    ,0
                                  )+parseInt(i.toString())
                                  let current =0
                                  return (
                                    currentStudent?.studentFees[0]?.fees?.tranches?.map(
                                      (t:any)=>{
                                        let order = t?.order
                                        let amount = parseInt(currentStudent?.studentFees[0]?.amount.toString()) - parseInt(currentStudent?.school?.inscription.toString())
                                        let cp = amount-current
                                        cp = cp>0? cp:0
                                        cp = cp>parseInt(t?.amount.toString())? parseInt(t?.amount.toString()):cp
                                        current += parseInt(t?.amount.toString())
                                        // let finalPay = current-amount
                                        // finalPay = amount-finalPay
                                        // finalPay = finalPay>0? finalPay:0
                                        return (
                                                <ProgressBar key = {t.id} title={currentUser?.lang === "Français"?`tranche ${order}`:`Bracket ${order}`} fixed={parseInt(t.amount.toString())} current={cp}/>
                                        )
                                      
                                      }
                                  )
                                  )
                                }
                              )
                       }
                       {
                         currentStudent.studentFees.amount
                       }
                      {/* <ProgressBar title={'tranche 1'} fixed={5000} current={5000}/>
                      <ProgressBar title={'tranche 2'} fixed={3000} current={2000}/>
                      <ProgressBar title={'tranche 3'} fixed={1000} current={0}/> */}
                   </div>
            </div> 
            {
              ["1"].map(
                (t:any)=>{
                  let amount = parseInt(currentStudent?.studentFees[0]?.amount.toString()) 
                  let i = currentStudent?.school?.inscription

                  let sum = currentStudent?.studentFees[0]?.fees?.tranches?.reduce(
                    (acc:number,t:any)=>{
                        return acc += parseInt(t?.amount.toString())
                    }
                    ,0
                  )+parseInt(i.toString())
                  let s = sum===amount?  (currentUser?.lang === "Français"?"Statut: Soldé":"Status: Paid"):currentUser?.lang === "Français"?"Statut: Non Soldé":"Status: Unpaid"
                  return (
                    <div className='mt-5 bg-gray-50 p-5  gap-3 grid grid-cols-2 rounded-lg '>
                    <div style={{background:"linear-gradient(to top,  #0ea5e9, #4f46e5)"}} className='w-auto  p-3  text-white rounded-lg flex items-start justify-center'>
                       { currentStudent?.lang === "Français"?'Montant attendu: ':'Expected amount: '} {sum} fcfa
                    </div>
                    <div style={{background:`${getClasses((amount/sum)*100)}` }} className='w-auto p-3 bg-green-500 text-white rounded-lg flex items-start justify-center'>
                    { currentStudent?.lang === "Français"?'Montant payé: ':'Amount paid: '}  {amount} fcfa
                    </div>
                    <div style={{background:"linear-gradient(to top,  #0ea5e9, #4f46e5)"}} className='w-auto p-3 bg-green-500 text-white rounded-lg flex items-center justify-center'>
                    { currentStudent?.lang === "Français"?'Montant restant: ':'Remaining amount: '} {sum - amount} fcfa 
                    </div>
                    <div style={{background:`${getClasses((amount/sum)*100)}` }}  className='w-auto p-3 bg-green-500 text-white rounded-lg flex items-center justify-center'>
                       {s}
                    </div>  
                </div>
                  )
                }
              )
            }
            <div className='border w-full rounded-lg mt-5 border-dashed p-4 flex flex-col justify-start items-start'>
              <div className='flex w-full gap-1 justify-between items-center'>
                <Input  value={newAmount?.toString()} onChange={(e)=>changeNewAmount(parseInt(e.target.value))}className='flex-1 mr-2' placeholder= { currentStudent?.lang === "Français"?"Nouveau montant":"New amount"}/>
                <Button disabled={settingFees} className='bg-blue-600 hover:bg-blue-700'onClick={()=>FixNewAmount()}>
                    {!settingFees && <span> { currentStudent?.lang === "Français"? "Sauvegarder":"Save"}</span>}  
                    {settingFees &&  < div className="w-6 my-24 mx-auto h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />}
                </Button>                
                     
              </div> 
            </div>
              </>)}
              
              { (!isSettingStudent && !currentStudent) && <div className='w-full my-36 flex items-center justify-center'>
                      <UserRoundSearch size={50} />  
               
              </div>
            }
               {
            isSettingStudent && < div className="w-6 my-24 mx-auto h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            
            }

        </div>
      
    </div>
  )
}
