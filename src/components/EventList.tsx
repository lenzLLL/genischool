import prisma from "@/lib/prisma";
import { AuthSchema } from "@/lib/schemas";
import EventComponent from "./eventComponent";
import Link from "next/link";
import { MdArrowForward } from "react-icons/md";
const EventList = async ({ dateParam,user }: {user:AuthSchema|null, dateParam: string | undefined }) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      }
      
    },
    take:10,
    orderBy:[
      {
        startTime:"desc"
      },
      
    ]
  });
  
  return(<> {data.map((event) => (
     <EventComponent event={event}/>
  ))
  
}
{ data.length > 10 && <Link className="flex items-center gap-1 text-blue-400 font-bold text-lg" href={"/list/events"}>{user?.lang === "Français"? "Voir plus ":"See more "}<MdArrowForward/></Link>
}</>
  )}
export default EventList
