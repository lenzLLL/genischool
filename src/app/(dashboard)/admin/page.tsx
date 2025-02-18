import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceChart";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";

const AdminPage = async({
  searchParams,
}: {
  searchParams: { [keys: string]: string | undefined };
}) => {
  const currentUser = await getCurrentUser()
  const school = await prisma.school.findUnique({
    where:{
      id:currentUser.schoolId
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
  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser} type="Admin" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser} type="Teacher" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser} type="Parent" /> 
           <UserCard year = {school?.schoolyears[0].title||""} user = {currentUser} type="Student" /> 
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full  h-[450px]">
             <CountChartContainer schooldId={school?.id||''} lang = {currentUser?.lang} /> 
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
             <AttendanceChartContainer user = {currentUser}/> 
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
           <FinanceChart /> 
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendarContainer user = {currentUser} searchParams={searchParams} /> 
        <Announcements userId={currentUser?.id||""} role = {currentUser?.role||""} lang = {currentUser?.lang||""} schoolId={currentUser?.schoolId||""} />
      </div>
    </div>
  );
};

export default AdminPage;
