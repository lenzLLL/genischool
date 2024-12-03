"use server";
import cloudinary from "cloudinary"
import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
  ClassSchema,
  ExamSchema,
  SchoolSchema,
  SchoolYearchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { connect } from "http2";
import { getCurrentUser } from "./functs";

type CurrentState = { success: boolean; error: boolean };
type CurrentStateUpdate = { success: boolean; error: boolean,newImage:Boolean };

cloudinary.v2.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUDINARY_API_KEY,
  api_secret:process.env.CLOUDINARY_API_SECRET

})




export const createSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    const currentUser = await getCurrentUser()
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: {
          connect: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
        school:{
          connect :{id:currentUser?.schoolId}
        }
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {
    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers: {
          set: data.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteSubject = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.subject.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createClass = async (
  currentState: CurrentState,
  data: ClassSchema
) => {
  try {
    const currentUser = await getCurrentUser()
 
    const c = await prisma.class.create({
      data : {
        schoolId:currentUser?.schoolId? currentUser.schoolId:"",
        supervisorId:data.supervisorId,
        name:data.name
      },
    });
   
    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateClass = async (
  currentState: CurrentState,
  data: any
) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data,
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteClass = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    await prisma.class.delete({
      where: {
        id: id,
      },
    });

    // revalidatePath("/list/class");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const currentUser = await getCurrentUser()
    const isExistAuth = await prisma.auth.findFirst({
      where:{
        email:data.email,
      }
    })
    let r:any = null
    if(!isExistAuth){
      r = await prisma.auth.create({
      data:{
        password:data.password? data.password:"",
        email:data.email? data.email:"",
      }
      })
    }
    if(!r && !isExistAuth){
        return { success: false, error: true };    
    }
    let res:any  = null

    const t = await prisma.teacher.create({
      data: {
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        imgKey:data.key || null,
        sex: data.sex,
        subjects: {
          connect: data.subjects?.map((subjectId: string) => ({
            id: subjectId,
          })),
        },
        school:{
          connect:{id:currentUser?.schoolId}
        }
      
      },
    });

    if (t){
        const id = isExistAuth? isExistAuth.id:r?.id
        await prisma.authSchool.create({
          data:{
            role:"t",
            school:{
              connect:{id:currentUser?.schoolId}
            },
            user:{
              connect:{id}
            }
          }
        })  
    }

    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    // const user = await clerkClient.users.updateUser(data.id, {
    //   username: data.username,
    //   ...(data.password !== "" && { password: data.password }),
    //   firstName: data.name,
    //   lastName: data.surname,
    // });
    const t = await prisma.teacher.findUnique({
        where:{
          id:data.id
        }  
    })
    if(data.newImage && t?.imgKey){
      await cloudinary.v2.uploader.destroy(t?.imgKey? t.imgKey:"")
    }

     const user = await prisma.auth.findFirst({
      where:{
        email:t?.email? t.email:data.email
      }
     })

     const r = await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        // ...(data.password !== "" && { password: data.password }),
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img ,
        imgKey:data.key,
        sex: data.sex,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: subjectId,
          })),
        },
          
      },
    });
    await prisma.auth.update({
      where:{
        id:user?.id
      },
      data:{
        email:data.email,
        ...(data.password !== "" && { password: data.password }),
      }
    })
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
      const t = await prisma.teacher.findUnique({
        where:{
          id
        }
      })
      const a = await prisma.auth.findFirst({
        where:{
          email:t?.email? t.email:""
        }
      })
      await prisma.teacher.update({
        where:{
          id
        },
        data:{
          deleted:true
        }
      })
      await prisma.authSchool.deleteMany({
        where:{
          userId:a?.id,
          schoolId:t?.schoolId? t.schoolId:""
        }
      })
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {

    const currentUser = await getCurrentUser()
    const isExistAuth = await prisma.auth.findFirst({
      where:{
        email:data.email,
      }
    })
    let r:any = null
    if(!isExistAuth){
      r = await prisma.auth.create({
      data:{
        password:data.password? data.password:"",
        email:data.email? data.email:"",
      }
      })
    }
    if(!r && !isExistAuth){
        return { success: false, error: true };    
    }


    const user = await prisma.student.create({
      data: {
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        img: data.img || null,
        sex: data.sex,
        imgKey:data.key,
        schoolId:currentUser?.schoolId? currentUser?.schoolId:"",
        currentClassId: data.classId,
        ...(data.parentId !== "" && { parentId: data.parentId }),
        
      },
    });

    if (user){
        const id = isExistAuth? isExistAuth.id:r.id
        await prisma.authSchool.create({
          data:{
            role:"s",
            school:{
              connect:{id:currentUser?.schoolId}
            },
            user:{
              connect:{id}
            }
          }
        })  
    }
    const sy = await prisma.schoolyear.findFirst({
      where:{
        current:true,
        schoolId:currentUser?.schoolId
      }
    })
    await prisma.classYear.create({
        data : {
            schoolYearId:sy?.id? sy.id:"",
            classId:data?.classId,
            studentId:user?.id
        }      
    })
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    const s = await prisma.student.findUnique({
      where:{
        id:data.id
      }
    })
    if(data.newImage && s?.imgKey){
      await cloudinary.v2.uploader.destroy(s?.imgKey? s.imgKey:"")
    }
    const user = await prisma.auth.findFirst({
      where:{
        email:s?.email? s.email:data.email
      }
     })
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        ...(data.img && { img: data.img }),
        ...(data.key && {  imgKey:data.key}),
        sex: data.sex,
        currentClassId: data.classId,
        ...(data.parentId && {parentId: data.parentId})
      },
    });

    await prisma.auth.update({
      where:{
        id:user?.id
      },
      data:{
        email:data.email,
        ...(data.password !== "" && { password: data.password }),
      }
    })
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
      const s = await prisma.student.findUnique({
        where:{
          id
        },
        include:{
          currentClass:{
            include:{
              
            }
          } 
        },
      })
      const a = await prisma.auth.findFirst({
        where:{
          email:s?.email? s.email:""
        }
      })
      await prisma.student.update({
        where:{
          id
        },
       
        data:{
          deleted:true
        }
      })
      await prisma.authSchool.deleteMany({
        where:{
          userId:a?.id,
          schoolId:s?.currentClass?.schoolId
        }
      })
    // revalidatePath("/list/teachers");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.create({
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    // if (role === "teacher") {
    //   const teacherLesson = await prisma.lesson.findFirst({
    //     where: {
    //       teacherId: userId!,
    //       id: data.lessonId,
    //     },
    //   });

    //   if (!teacherLesson) {
    //     return { success: false, error: true };
    //   }
    // }

    await prisma.exam.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const deleteExam = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;

  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  try {
    await prisma.exam.delete({
      where: {
        id: parseInt(id),
        // ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {}),
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createSchool = async (
  currentState: CurrentState,
  data: SchoolSchema
) => {
  try {
    const currentUser = await getCurrentUser()
    await prisma.school.create({
      data: {
        name: data.name,
        email:data.email,
        logo:data.img || null,
        key:data.key || null,
        address:data?.address,
        type:data.type
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};
export const createSchoolYear = async (  
  data: any) =>{
  
    try{
    
    await prisma.schoolyear.updateMany({
      data:{
          current:false  
      },
      where:{
        schoolId:data.schoolId
      }
    })
    const sy = await prisma.schoolyear.create({
      data:{
           school:{
            connect:{
              id:data.schoolId
            }
           } ,
           title:data.title,
          
      }
    })
    if(data.type === "Université"){
        for(let i =0;i<2;i++){
            const r = await prisma.mestre.create({
                data:{
                    type:"Semestre",
                    order:i+1,
                    schoolYear:{
                      connect:{
                        id:sy.id
                      }
                    }  
                }  
            })
            
            await prisma.sessionSequence.create({
                data:{
                    type:"sn",
                    order:1,
                    mestre:{
                      connect:{
                        id:r.id
                      }
                    }       
                }
            })  
            
        }         
    }else{
        for(let i =0;i<3;i++){
          const r = await prisma.mestre.create({
            data:{
                type:"Trimestre",
                order:i+1,
                schoolYear:{
                  connect:{
                    id:sy.id
                  }
                }  
            }  
          })
         for(let i = 0;i<2;i++){
               
          await prisma.sessionSequence.create({
            data:{
                type:"sq",
                order:i+1,
                mestre:{
                  connect:{
                    id:r.id
                  }
                }       
            }
        })  
        }
        }
    }  
    return { success: true, error: false };

  }
  catch(error:any){
    console.log(error)   
    return { success: false, error: true };
  }
}
export const createAnnouncement = async ( 
  currentState: CurrentState,
  data: AnnouncementSchema,
  ) => {
  try{
    if(data.classes.length === 0 ){
       return { success: false, error: true };
    }
    const a = await prisma.announcement.create({
      data:{
          title:data.title,
          description:data.description,
          ...(data.date && {date:data.date}),
      }
    })
    if(!a){return { success: false, error: true }}
    for(let i = 0;i<data.classes.length;i++){
        await prisma.announcementClass.create({
          data:{
            announcementId:a.id,
            classId:data.classes[i]
          }
        })  
    }
    return { success: true, error: false };
     
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true };
    
  }
}
export const deleteAnnouncement = async (  currentState: CurrentState,
  data: FormData,) => {
  const id = data.get("id") as string;
  try{
      await prisma.announcementClass.deleteMany({
        where:{
          announcementId:id
        }
      })        
      await prisma.announcement.delete({
        where:{
          id
        }
      })
    return { success: true, error: false };

  }
  catch(error:any){
    return { success: false, error: true };
  }
}
export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  if (!data.id) {
    return { success: false, error: true };
  }
  try {
    await prisma.announcement.update({
      where:{
        id:data.id
      },
      data:{
        title:data.title,
        description:data.description,
        ...(data.date && {date:data.date})
      }
      
    })
    // revalidatePath("/list/students");
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};