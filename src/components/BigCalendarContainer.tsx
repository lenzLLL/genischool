import prisma from "@/lib/prisma";
import { adjustScheduleToCurrentWeek } from "@/lib/utils";
import BigCalendar from "./BigCalender";

const BigCalendarContainer = async ({
  type,
  id,
}: {
  type: "teacherId" | "classId";
  id: string | number;
}) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId"
        ? { teacherId: id as string }
        : { classes:{some:{classId:id as string}} }),
        
    },
    include:{
      subject:true
    }
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.subject.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <div className="h-auto">
      <BigCalendar data = {data}/>
    </div>
  );
};

export default BigCalendarContainer;
