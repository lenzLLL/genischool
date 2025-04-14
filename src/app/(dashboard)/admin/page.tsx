import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const AdminPage = async({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  if(!currentUser){
      redirect("sign-in")  
  }
  const school = await prisma.school.findUnique({
    where:{
      id:currentUser?.schoolId||""
    },
    include:{
      schoolyears:{
        orderBy:{
          createdAt:"desc",
        },
        take:1
      }
    }
  })
  function getMonthName(monthNumber:number) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    if (monthNumber < 1 || monthNumber > 12) {
      return "Mois invalide"; // Gestion des erreurs
    }
    return months[monthNumber - 1]; // Retourne le nom du mois
  }

  const r = await prisma.historiqueFees.groupBy({
    by:["month"],
    _sum:{
      amount:true
    },
    
    where:{
       fees:{
        student:{
          schoolId:school?.id,
        },
        schoolYearId:currentUser?.currentSchoolYear||""
       },
         
    }
  }    )
  const e = await prisma.accounting.groupBy({
    by:["month"],
    _sum:{
      amount:true
    },
    where:{
        schoolId:currentUser?.schoolId||"",
        schoolYearId:currentUser?.currentSchoolYear||"" 
    }
  }    )
  let fr = []
  console.log(r)
  // for(let i = 0;i<12;i++){
  //   fr.push({
  //     name:getMonthName(i+1),
  //     income:parseInt(r.find(d=>d.month === (i+1).toString())?._sum.amount?.toString()||"")||0,
  //     expense:parseInt(e.find(d=>d.month === (i+1))?._sum.amount?.toString()||"")||0
  //     })
  // }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser||null} type="Admin" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser||null} type="Teacher" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser||null} type="Parent" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser||null} type="Student" /> 
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full  h-[450px]">
             <CountChartContainer schooldId={school?.id||''} lang = {currentUser?.lang||''} /> 
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
             <AttendanceChartContainer user = {currentUser||null}/> 
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
           <FinanceChart statsF={[]} /> 
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer user = {currentUser||null} searchParams={searchParams} /> 
        <Announcements userId={currentUser?.id||""} role = {currentUser?.role||""} lang = {currentUser?.lang||""}  />
      </div>
    </div>
  );
};

export default AdminPage;
