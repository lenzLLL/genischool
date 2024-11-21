import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";

const StudentPage = async () => {
  const currentUser = await getCurrentUser()
  const classItem = await prisma.class.findMany({
    where: {
      currentStudents: { some: { id: currentUser?.id } },
    },
  });

  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* LEFT */}
      <div className="w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (4A)</h1>
            <BigCalendarContainer type="classId" id = {classItem[0]?.id}/>  
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full flex-col lg:flex-row  flex gap-8">
          <div className="h-auto">
          <Announcements /> 
          </div>
       
         <>
         <div className="h-auto">
         <EventCalendar /> 
         </div>
         </>
       
      </div>
    </div>
  );
};

export default StudentPage;
