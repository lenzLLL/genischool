"use client"
import Image from "next/image";
import dynamic from 'next/dynamic'
const EventCalendar = dynamic(() => import('./EventCalendar'), { ssr: false })
import EventList from "./EventList";
import { AuthSchema } from "@/lib/schemas";

const EventCalendarContainer = async ({
  searchParams,user
}: {
  user:AuthSchema|null, searchParams: { [keys: string]: string | undefined };
}) => {
  const { date } = searchParams;
  return (
    <div className="bg-white p-4 rounded-md">
      <EventCalendar />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">{user?.lang === "Français"?'Evènements' :'Events'}</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        <EventList user = {user} dateParam={date} />
      </div>
    </div>
  );
};

export default EventCalendarContainer;
