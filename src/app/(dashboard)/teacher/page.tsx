import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import EventCalendar from "@/components/EventCalendar";

const TeacherPage = () => {
  return (
    <div className="p-4 flex gap-4 flex-col">
      {/* LEFT */}
      <div className="w-full">
        <div className="h-full bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Schedule (Alex Ronald)</h1>
           <BigCalendar/> 
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full flex-col lg:flex-row  flex gap-8">
          <div className="h-auto w-full">
          <Announcements /> 
          </div>
       
         <>
        
         </>
       
      </div>
    </div>
  );
};

export default TeacherPage;
