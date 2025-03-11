import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";
import { AuthSchema } from "@/lib/schemas";
import { NavigationOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const AttendanceChartContainer = async ({user}:{user:AuthSchema}) => {
 

  // const resData = await prisma.attendance.findMany({
  //   where: {
  //     date: {
  //       gte: lastMonday,
  //     },
  //   },
  //   select: {
  //     date: true,
  //     present: true,
  //   },
  // });
 

  // console.log(data)





  const data = await prisma.historiqueFees.findMany({
    where:{
      fees:{
        student:{
          schoolId:user?.schoolId
        }
      }
    },
    include:{
        fees:{
          include:{
            student:{
              include:{
                currentClass:true
              }
            }
          }
        }
    },
    take:20,
    orderBy:{
      createdAt:"desc"
    }
  })
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-lg font-semibold">{user?.lang === "Français"? "Dernières transactions":"Last transactions"}</h1>
        <span className="text-xs text-gray-400">{user?.lang === "Français"? "Voir tout":"View all"}</span>
      </div>
      <ScrollArea>
       {
        data.length >0 && data.map(
          (d,i)=>{
            let style =  "linear-gradient(to top, #1abc9c,#1abc9c)"
            let c1 =  '#1abc9c'
            let c2 = '#1abc9c'
            if(i%2 === 0 ){
              style =  "linear-gradient(to top, #1abc9c,#1abc9c)"
              c1 =  '#1abc9c'
              c2 = '#1abc9c'
            }
            else{
              style = "linear-gradient(to top, #f1c40f, #f39c12)"
              c1 = '#f1c40f'
              c2 =  '#f39c12'
            }
            c1 = c1? c1:"#f39c12"
          
            return <div style = {{background:style}} className="flex items-start text-md justify-start flex-col p-2 rounded-lg my-1 text-white">
              {
                user?.lang === "Français"? d.fr:d.eng
              }
            <div className="flex flex-wrap gap-1 items-center justify-start mt-1">
                <span style={{color:c1}} className={`bg-white p-1 px-2 text-sm  rounded-full`}>{d.fees.student.username}</span>
                <span style={{color:c2}} className={`bg-white p-1 px-2 text-sm  rounded-full`}>{d.amount.toString()} fcfa</span>
                <span style={{color:c2}} className={`bg-white p-1 px-2 text-sm  rounded-full`}>{d.fees.student.currentClass?.name}</span>

            </div>
            </div>
          }
        )
       } 
       </ScrollArea>
       {
        data.length === 0 && <div className="flex mt-28 items-center justify-center flex-col w-full"><NavigationOff size={30} color="gray" />{<h1 className="mt-5 text-gray-300">{user?.lang === "Français"? "Aucun paiement":" No payment"}</h1>}</div>
       }
    </div>
  );
};

export default AttendanceChartContainer;
