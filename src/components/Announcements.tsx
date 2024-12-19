import { getCurrentUser } from "@/lib/functs";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const Announcements = async ({lang,userId,role}:{lang:string,userId:string,role:string}) => {
  const currentUser = await getCurrentUser()

  const query: Prisma.AnnouncementWhereInput = {};

  if(role === "Student"){
    query.announcementClass = {
      some: {
        class: {
          currentStudents: {
            some: {
              id:userId
            }
          }
        }
      }
    };
  }
  else if(role === "Parent"){
    query.announcementClass = {
      some:{
        class:{
          currentStudents:{
            some:{
              parentId:userId
            }
          }
        }
      }
    } 
  }
  else if(role === "Teacher"){
    query.announcementClass = {
      some:{
        class:{
           lessons:{
            some:{
              lesson:{
                teacherId:userId
              }
            }
           }
          }
        }
      }
    } 
  const data = await prisma.announcement.findMany({
    take: 4,
    where:query,
    orderBy: { date: "desc" },
  });
 
  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{lang === "Français"?"Annonces":"Announcements"}</h1>
        <span className="text-xs text-gray-400">{lang === "Français"?"Voir tout":"View All"}</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data[0] && (
          <div className="bg-lamaSkyLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[0].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[0].date? data[0].date:new Date())}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[0].description}</p>
          </div>
        )}
        {data[1] && (
          <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[1].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(data[1].date? data[1].date:new Date())}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[1].description}</p>
          </div>
        )}
        {data[2] && (
          <div className="bg-lamaYellowLight rounded-md p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{data[2].title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              {new Intl.DateTimeFormat("en-GB").format(data[2].date? data[2].date:new Date())}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{data[2].description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
