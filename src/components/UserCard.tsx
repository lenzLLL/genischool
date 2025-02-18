import prisma from "@/lib/prisma";
import { AuthSchema } from "@/lib/schemas";
import Image from "next/image";

const UserCard =  async ({ type,user,year }: {user:AuthSchema|null,year:string|null, type: "Student"|"Admin" | "Teacher" | "Parent" }) => {


 
  const getLabel = () => {
      if(user?.lang === "Français"){
          if(type === "Student"){
              return "Etudiant"   
          }
          else if(type === "Admin"){
            return "Administrateur"   
          } 
          else if(type === "Teacher"){
            return "Enseignants"   
          }
          else{
            return type
          } 
      }
      return type  
  }  
  const getCount = async () => {
    if(type === "Student"){
      const d = await prisma.student.findMany({
        where:{
          schoolId:user?.schoolId,
          currentClassId:{
            not:null
          }
        }
      })

      return  d.length
    }
    else if(type === "Admin"){
      const d = await prisma.admin.findMany({
        where:{
          schoolId:user?.schoolId
        }
      })
      return d.length
    }
    else if(type === "Teacher"){
      const d = await prisma.teacher.findMany({
        where:{
          schoolId:user?.schoolId
        }
      })
      return d.length
    }
    else{
      const d = await prisma.parent.findMany({
        where:{
          schoolId:user?.schoolId
        }
      })
      return d.length
    }
  }
 
  return (
    <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          {year}
        </span>
        <Image src="/more.png" alt="" width={20} height={20} />
      </div>
      <h1 className="text-2xl font-semibold my-4">{getCount()}</h1>
      <h2 className="capitalize text-sm font-medium text-gray-500">{getLabel()}s</h2>
    </div>
  );
};

export default UserCard;
