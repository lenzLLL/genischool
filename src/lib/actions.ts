"use server";
import cloudinary from "cloudinary"
import { revalidatePath } from "next/cache";
import {
  AnnouncementSchema,
  AttendanceSchema,
  ClassSchema,
  EventSchema,
  ExamSchema,
  LessonSchema,
  ParentSchema,
  SchoolSchema,
  SchoolYearchema,
  StudentSchema,
  SubjectSchema,
  TeacherSchema,
} from "./formValidationSchemas";
import prisma from "./prisma";
import { connect } from "http2";
import { getCurrentUser } from "./functs";
import { id } from "date-fns/locale";
import { Prisma } from "@prisma/client";
type CurrentState = { success: boolean; error: boolean,eng:String,fr:String};
type FinalCurrentState = { success: boolean; error: boolean;msg:String };
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
        teachers:{
          connect: data?.teachers?.map((d:{id:string,username:string}) => ({
            id: d.id,
          })),
        },
        school:{
          connect :{id:currentUser?.schoolId}
        }
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false,fr:"",eng:""};
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const updateSubject = async (
  currentState: CurrentState,
  data: SubjectSchema
) => {
  try {

    const existingSubject = await prisma.subject.findUnique({
      where: { id: data.id },
      include: { teachers: true }, // Inclure les enseignants actuels
    });

    const currentTeacherIds = existingSubject?.teachers.map(teacher => teacher.id)||[];
    const newTeacherIds = data.teachers?.map(teacher => teacher.id) || [];
    const teachersToDisconnect = currentTeacherIds.filter(id => !newTeacherIds.includes(id));

    await prisma.subject.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        teachers:{
          connect: newTeacherIds.map(id => ({ id })), // Connecter les nouveaux enseignants
          disconnect: teachersToDisconnect.map(id => ({ id })), // Déconnecter les enseignant
        },
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false,eng:"",fr:""};
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
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
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
    
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
        name:data.name,
        feesId:"a65a6cbf-fe75-4c15-b08c-f9178fd0bd55"
      },
    });
   
    // revalidatePath("/list/class");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
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
    return { success: true, error: false,eng:"",fr:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
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
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
  }
};
export const createTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  try {
    const currentUser = await getCurrentUser()
    const isExistPassword = await prisma.teacher.findFirst({
      where:{
        password:data.password,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPassword){
        return { success: false, error: true,fr:"L'enseignant de mot de passe "+data.password+" exsite déjà dans la base de données",eng:"The teacher with the password " + data.password + " already exists in the database." };
    }
    const isExistEmail = await prisma.teacher.findFirst({
      where:{
        email:data.email,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistEmail){
        return { success: false, error: true,fr:"L'enseignant d'email "+data.email+" exsite déjà dans la base de données",eng:"The teacher with email " + data.email + " already exists in the database." };
    }
    const isExistPhone = await prisma.teacher.findFirst({
      where:{
        phone:data.phone,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPhone){
        return { success: false, error: true,fr:"L'enseignant avec le contact "+data.phone+" exsite déjà dans la base de données",eng:"The teacher with phone number " + data.phone + " already exists in the database." };
    }
    
    await prisma.teacher.create({
      data: {
        username: data.username,
        email: data.email? data.email:"",
        phone: data.phone? data.phone:"",
        address: data.address,
        img: data.img || null,
        imgKey:data.key || null,
        password:data.password? data?.password:"",
        subjects: {
          connect: data.subjects?.map((d:{id:string,name:string}) => ({
            id: d.id,
          })),
        },
        school:{
          connect:{id:currentUser?.schoolId}
        },
        
      },
    });
    // revalidatePath("/list/teachers");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const updateTeacher = async (
  currentState: CurrentState,
  data: TeacherSchema
) => {
  if (!data.id) {
    return { success: false, error: true,fr:"",eng:"" };
  }
  try {
 
    const currentUser = await getCurrentUser()
    const isExistPassword = await prisma.teacher.findFirst({
      where:{
        password:data.password,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPassword){
        return { success: false, error: true,fr:"L'enseignant de mot de passe "+data.password+" exsite déjà dans la base de données",eng:"The teacher with the password " + data.password + " already exists in the database." };
    }
    const isExistEmail = await prisma.teacher.findFirst({
      where:{
        email:data.email,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistEmail){
        return { success: false, error: true,fr:"L'enseignant d'email "+data.email+" exsite déjà dans la base de données",eng:"The teacher with email " + data.email + " already exists in the database." };
    }
    const isExistPhone = await prisma.teacher.findFirst({
      where:{
        phone:data.phone,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPhone){
        return { success: false, error: true,fr:"L'enseignant avec le contact "+data.phone+" exsite déjà dans la base de données",eng:"The teacher with phone number " + data.phone + " already exists in the database." };
    }
    
    const t = await prisma.teacher.findUnique({
      where:{
        id:data.id
      }
    })
    if(data.newImage && t?.imgKey){
      await cloudinary.v2.uploader.destroy(t?.imgKey? t.imgKey:"")
    }
    const existingSubject = await prisma.teacher.findUnique({
      where: { id: data.id },
      include: { subjects: true }, // Inclure les enseignants actuels
    });
    const currentSubjectsIds = existingSubject?.subjects.map(s => s.id)||[];
    const newSubjectIds = data.subjects?.map(s => s.id) || [];
    const subjectsToDisconnect = currentSubjectsIds.filter(id => !newSubjectIds.includes(id));


     const r = await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        // ...(data.password !== "" && { password: data.password }),
        username: data.username,
        password:data.password,
        email: data.email? data.email:"",
        phone: data.phone || null,
        address: data.address,
        img: data.img ,
        imgKey:data.key,
        subjects:{
          connect: newSubjectIds.map(id => ({ id })), // Connecter les nouveaux enseignants
          disconnect: subjectsToDisconnect.map(id => ({ id })), // Déconnecter les enseignant
        },
          
      },
    });

    // revalidatePath("/list/teachers");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
    
  }
};
export const deleteTeacher = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
      
      await prisma.teacher.update({
        where:{
          id
        },
        data:{
          deleted:true
        }
      })
    // revalidatePath("/list/teachers");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const createStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  console.log(data);
  try {

    const currentUser = await getCurrentUser()
    const isExistEmail = await prisma.student.findFirst({
      where:{
        email:data.email,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistEmail){
        return { success: false, error: true,fr:"L'étudiant d'email "+data.email+" exsite déjà dans la base de données",eng:"The student with email " + data.email + " already exists in the database." };
    }
    const isExistMatricule = await prisma.student.findFirst({
      where:{
        matricule:data.matricule,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistMatricule){
        return { success: false, error: true,fr:"L'étudiant de matricule "+data.matricule+" exsite déjà dans la base de données",eng:"The student with matricule " + data.matricule + " already exists in the database." };
    }
    const isExistPhone = await prisma.student.findFirst({
      where:{
        phone:data.phone,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPhone){
        return { success: false, error: true,fr:"L'étudiant de contact "+data.phone+" exsite déjà dans la base de données",eng:"The student with contact " + data.phone + " already exists in the database." };
    }
    const isExistPassword = await prisma.student.findFirst({
      where:{
        password:data.password,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPassword){
        return { success: false, error: true,fr:"L'étudiant de mot de passe "+data.password+" exsite déjà dans la base de données",eng:"The student with pzassword " + data.password + " already exists in the database." };
    }
    const user = await prisma.student.create({
      data: {
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address,
        password:data.password,
        matricule:data.matricule,
        img: data.img || null,
        sex: data.sex,
        imgKey:data.key,
        schoolId:currentUser?.schoolId? currentUser?.schoolId:"",
        currentClassId: data.classId,
        ...(data.parentId !== "" && { parentId: data.parentId }),
        
      },
      include:{
        currentClass:true
      }
    });

    const sy = await prisma.schoolyear.findFirst({
      where:{
        current:true,
        schoolId:currentUser?.schoolId
      },
      include:{
        school:true
      }
    })
    await prisma.classYear.create({
        data : {
            schoolYearId:sy?.id? sy.id:"",
            classId:data?.classId? data.classId:"",
            studentId:user?.id,
            Inscription:sy?.school.inscription? sy?.school?.inscription:0
        }      
    })
    const cu = await getCurrentUser()
    const school = await prisma.school.findUnique({
      where:{
        id:cu.schoolId
      }
    })
    const studentFeesRecord = await prisma.studentFees.create({
      data:{
        amount:school?.inscription||0,
        student:{
          connect:{
            id:user.id
          }
        },
        schoolYear:{
          connect:{
            id:cu.currentSchoolYear||""
          }
        },
        fees:{
          connect:{
            id:user.currentClass?.feesId
          }
        }

      }
    })
    if (!studentFeesRecord) {
      await prisma.classYear.deleteMany({
        where:{
          studentId:user.id
        }
      })
      await prisma.student.delete({
        where:{
          id:user.id
        }
      })
      return { success: false, error: true, fr: "Erreur lors de la création des frais étudiants.", eng: "Error creating student fees." };
    }
    
    await prisma.historiqueFees.create({
      data:{
        amount:school?.inscription||0,
        fees:{
          connect:{
            id:studentFeesRecord.id
          }
        },
        fr:"Paiement de l'inscription",
        eng:"Payment of the registration"
      }
    })
    // fonction inachevé lorsqu'une personne est enregistrée dans la base de données, nous considérons qu'elle est obligatoirement
    //inscripte dans une classe le classYear est alors créer ce qui servira de mémoire dans l'historique et une historique de
    // de paiement devrait ainsi être crée
    // revalidatePath("/list/students");

    return { success: true, error: false,fr:"",eng:""};
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const updateStudent = async (
  currentState: CurrentState,
  data: StudentSchema
) => {
  if (!data.id) {
    return { success: false, error: true,fr:"",eng:"" };
  }
  try {
    const s = await prisma.student.findUnique({
      where:{id:data.id}
    })
    const currentUser = await getCurrentUser()
    const isExistEmail = await prisma.student.findFirst({
      where:{
        email:data.email,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistEmail){
        return { success: false, error: true,fr:"L'étudiant d'email "+data.email+" exsite déjà dans la base de données",eng:"The student with email " + data.email + " already exists in the database." };
    }
    const isExistMatricule = await prisma.student.findFirst({
      where:{
        matricule:data.matricule,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistMatricule){
        return { success: false, error: true,fr:"L'étudiant de matricule "+data.matricule+" exsite déjà dans la base de données",eng:"The student with matricule " + data.matricule + " already exists in the database." };
    }
    const isExistPhone = await prisma.student.findFirst({
      where:{
        phone:data.phone,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPhone){
        return { success: false, error: true,fr:"L'étudiant de contact "+data.phone+" exsite déjà dans la base de données",eng:"The student with contact " + data.phone + " already exists in the database." };
    }
    const isExistPassword = await prisma.student.findFirst({
      where:{
        password:data.password,
        schoolId:currentUser?.schoolId,
        id:{
          not:data.id
        }
      }
    })
    if(isExistPassword){
        return { success: false, error: true,fr:"L'étudiant de mot de passe "+data.password+" exsite déjà dans la base de données",eng:"The student with pzassword " + data.password + " already exists in the database." };
    }
    if(data.newImage && s?.imgKey){
      await cloudinary.v2.uploader.destroy(s?.imgKey? s.imgKey:"")
    }
    
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username: data.username,
        email: data.email || null,
        phone: data.phone || null,
        password:data.password,
        matricule:data.matricule,
        address: data.address,
        ...(data.img && { img: data.img }),
        ...(data.key && {  imgKey:data.key}),
        sex: data.sex,
        currentClassId: data.classId,
        ...(data.parentId && {parentId: data.parentId})
      },
    });
    // revalidatePath("/list/students");
    return { success: true, error: false,eng:"",fr:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const deleteStudent = async (
  currentState: CurrentState,
  data: FormData
) => {
  const id = data.get("id") as string;
  try {
    
      await prisma.student.update({
        where:{
          id
        },
        data:{
          deleted:true
        }
      })
      
    // revalidatePath("/list/teachers");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const createSchool = async (
  currentState: FinalCurrentState,
  data: SchoolSchema
) => {
  try {
    // const currentUser = await getCurrentUser()
    await prisma.school.create({
      data: {
        name: data.name,
        email:data.email,
        logo:data.img || null,
        key:data.key || null,
        address:data?.address,
        type:data.type,
        lang:data.lang,
        inscription:parseInt(data.inscription)
      },
    });

    // revalidatePath("/list/subjects");
    return { success: true, error: false,msg:"Success" };
  } catch (err:any) {
    console.log(err);
    return { success: false, error: true,msg:err.message };
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
    const sessions = await prisma.defaultSession.findMany({
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
           current:true
          
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
            
            const ss = await prisma.sessionSequence.create({
                data:{
                    type:"Session Normale",
                    order:i+1,
                    mestre:{
                      connect:{
                        id:r.id
                      }
                    }       
                }
            })  


            let total = 0
            for(let i = 0;i<sessions.length;i++){
               total += sessions[i].precentage
              await prisma.session.create({
                data:{
                  percentage:sessions[i].precentage,
                  sessionSequence:{
                    connect:{
                      id:ss.id
                    }
                  
                  },
                  title:sessions[i].title
                }
              })
            }
            await prisma.session.create({
              data:{
                percentage:100-total,
                sessionSequence:{
                  connect:{
                    id:ss.id
                  }
                
                },
                title:"Session Normale"
              }
            })
            
        }         
    }else{
        let current = 0;
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
          current++    
          const ss = await prisma.sessionSequence.create({
            data:{
                type:"Séquence",
                order:current,
                mestre:{
                  connect:{
                    id:r.id
                  }
                }       
            }
        })
        
        let total = 0
        for(let i = 0;i<sessions.length;i++){
           total += sessions[i].precentage
          await prisma.session.create({
            data:{
              percentage:sessions[i].precentage,
              sessionSequence:{
                connect:{
                  id:ss.id
                }
              
              },
              title:sessions[i].title
            }
          })
        }
        await prisma.session.create({
          data:{
            percentage:100-total,
            sessionSequence:{
              connect:{
                id:ss.id
              }
            
            },
            title:"Session Normale"
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
  data: AnnouncementSchema
  ) => {
  try{
    if(data?.classes?.length === 0 || !data?.classes ){
       return { success: false, error: true,fr:"Veillez choisir au moins une classe!",eng:"Please choose at least one class!" };
    }
    const a = await prisma.announcement.create({
      data:{
          title:data.title,
          description:data.description,
          ...(data.date && {date:data.date}),
      }
    })
    if(!a){return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }}
    for(let i = 0;i<data?.classes?.length;i++){
        await prisma.announcementClass.create({
          data:{
            announcementId:a.id,
            classId:data.classes[i].id
          }
        })  
    }
    return { success: true, error: false,fr:"",eng:"" };
     
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
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
    return { success: true, error: false,fr:"",eng:"" };

  }
  catch(error:any){
    return { success: false, error: true,fr:"",eng:"" };
  }
}
export const updateAnnouncement = async (
  currentState: CurrentState,
  data: AnnouncementSchema
) => {
  if (!data.id) {
    return { success: false, error: true ,fr:"",eng:""};
  }
  if(!data.classes)
  {
      return { success: false, error: true,fr:"Veillez choisir au moins une classe!",eng:"Please choose at least one class!" };
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
    await prisma.announcementClass.deleteMany({
        where:{
          announcementId:data.id
        }
    })
    for(let i = 0;i<data.classes.length;i++){
      await prisma.announcementClass.create({
        data:{
          announcementId:data.id,
          classId:data.classes[i].id
        }
      })  
  }
    // revalidatePath("/list/students");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
  }
};
export const createEvent = async ( 
  currentState: CurrentState,
  data: EventSchema,
  ) => {
  try{

    const currentUser = await getCurrentUser()
    const a = await prisma.event.create({
      data:{
          title:data.title,
          description:data.description,
          startTime:data.startTime,
          endTime:data.endTime,
          school:{
            connect:{
              id:currentUser?.schoolId
            }
          }
      }
    })

    return { success: true, error: false, eng:"",fr:"" };
     
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
}
export const deleteEvent = async (  currentState: CurrentState,
  data: FormData,) => {
  const id = data.get("id") as string;
  try{

      await prisma.event.delete({
        where:{
          id
        }
      })
    return { success: true, error: false,fr:"",eng:"" };

  }
  catch(error:any){
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
  }
}
export const updateEvent = async (
  currentState: CurrentState,
  data: EventSchema
) => {
  if (!data.id) {
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
  try {
    await prisma.event.update({
      where:{
        id:data.id
      },
      data:{
        title:data.title,
        description:data.description,
        startTime:data.startTime,
        endTime:data.endTime,
      }
      
    })
    // revalidatePath("/list/students");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err) {
    console.log(err);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
    
  }
};
export const createLessons = async ( 
  currentState: CurrentState,
  data: LessonSchema,
  ) => {
  try{
    if(data.classes?.length === 0 || !data.classes){
    return { success: false, error: true,fr:"Veillez selectionner au moins une classe!",eng:"Please select at least one class!" }  
    }
    const currentUser = await getCurrentUser()
    const a = await prisma.lesson.create({
      data:{
          teacherId:data.teacherId? data.teacherId:"",
          subjectId:data.subjectId? data.subjectId:"",
          startTime:data.startTime,
          schoolId:currentUser?.schoolId,
          endTime:data.endTime
      }
    })
    for(let i = 0;i<data?.classes.length;i++){
        await prisma.lessonClass.create({
          data:{
            classId:data.classes[i].id,
            lessonId:a.id
          }
        })  
    }
    return { success: true, error: false,fr:"",eng:"" };
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }  
  }
}
export const deleteLesson = async (  currentState: CurrentState,
  data: FormData,) => {
  const id = data.get("id") as string;
  try{
      await prisma.lessonClass.deleteMany( {
        where:{
          lessonId:id
        }
      })
      await prisma.lesson.delete({
        where:{
          id
        }
      })
    return { success: true, error: false,fr:"",eng:"" };

  }
  catch(error:any){
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
}
export const updateLesson = async (
  currentState: CurrentState,
  data: LessonSchema
) => {
  if (!data.id) {
    return { success: false, error: true,fr:"",eng:"" };
  }
  try {
    if(data.classes?.length === 0 || !data.classes){
      return { success: false, error: true,fr:"Veillez selectionner au moins une classe!",eng:"Please select at least one class!" }  
      }
    const a = await prisma.lesson.update({
      data:{
          ...(data.teacherId && {teacherId:data.teacherId}),
          ...(data.subjectId &&  {subjectId:data.subjectId}),
          ...( data.startTime && {startTime:data.startTime}),
          ...(data.endTime && {endTime:data.endTime})
      },
      where:{
          id:data.id
      }
    })
    await prisma.lessonClass.deleteMany({
      where:{
        lessonId:data.id
      }
    })
    for(let i = 0;i<data.classes.length;i++){
      await prisma.lessonClass.create({
        data:{
          classId:data.classes[i].id,
          lessonId:a.id
        }
      })  
  }  
    // revalidatePath("/list/students");
    return { success: true, error: false,fr:"",eng:""};
  } catch (err:any) {
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
};
export const createExam = async ( 
  currentState: CurrentState,
  data: ExamSchema,
  ) => {
  try{
    console.log("start begining")
    const currentUser = await getCurrentUser()
    if(!data.teacherId || !data.subjectId || !data.sessionId){
      return { success: false, error: true,fr:"Une erreur s'est produite, veillez remplir tous les champs s'il vous plaît!",eng:"An error has occurred, please fill in all fields!" }
    }

    
    console.log("second begining")

    const a = await prisma.exam.create({
      data:{
          teacherId:data.teacherId? data.teacherId:"",
          subjectId:data.subjectId? data.subjectId:"",
          startTime:data.startTime,
          endTime:data.endTime,
          classes:{
            connect: data.classes?.map((d:{id:string,name:string}) => ({
              id: d.id,
            })),
          },
          credit:parseInt(data.credit),
          sessionId:data.sessionId? data.sessionId:"",
          type:""
      }
    })   
    return { success: true, error: false,eng:"",fr:""};
     
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
}
export const deleteExam = async (  currentState: CurrentState,
  data: FormData,) => {
  const id = data.get("id") as string;
  try{
      await prisma.result.deleteMany({
        where:{
          examId:id
        }
      })
      await prisma.exam.delete( {
        where:{
          id
        }
      })
      
    return { success: true, error: false,eng:"",fr:""};

  }
  catch(error:any){
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
}
export const updateExam = async (
  currentState: CurrentState,
  data: ExamSchema
) => {
  if (!data.id) {
    return { success: false, error: true,fr:"",eng:"" };
  }
  try {
    const a = await prisma.exam.update({
      data:{
        teacherId:data.teacherId,
        subjectId:data.subjectId,
        startTime:data.startTime,
        endTime:data.endTime,
        classes:{
          connect: data.classes?.map((d:{id:string,name:string}) => ({
            id: d.id,
          })),
        },
        credit:parseInt(data.credit),
        sessionId:data.sessionId,
      },
      where:{
          id:data.id
      }
    })
  
    
    // revalidatePath("/list/students");
    return { success: true, error: false,eng:"",fr:"" };
  } catch (err:any) {
    // console.log(err.message);
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }
  }
};
export const createParent = async ( 
  currentState: CurrentState,
  data: ParentSchema,
  ) => {
  try{

    const currentUser = await getCurrentUser()
    const a = await prisma.parent.create({
      data:{
          username:data.username,
          email:data.email,
          phone:data.phone,
          password:data.password,
          address:data.address,
          school:{
            connect:{
              id:currentUser?.schoolId
            }
          }
          
      }
    })

    
    return { success: true, error: false,fr:"",eng:"" };
     
  }
  catch(error:any){
    console.log(error)
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
}
export const deleteParent = async (  currentState: CurrentState,
  data: FormData,) => {
  const id = data.get("id") as string;
  try{
      await prisma.parent.delete( {
        where:{
          id
        }
      })
      
    return { success: true, error: false,fr:"",eng:"" };

  }
  catch(error:any){
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
}
export const updateParent = async (
  currentState: CurrentState,
  data: ParentSchema
) => {
  if (!data.id) {
    return { success: false, error: true ,fr:"",eng:""};
  }
  try {
    const a = await prisma.parent.update({
      data:{
        username:data.username,
        phone:data.phone,
        email:data.email,
        password:data.password,
        address:data.address
      },
      where:{
          id:data.id
      }
    })
  
    
    // revalidatePath("/list/students");
    return { success: true, error: false,fr:"",eng:"" };
  } catch (err:any) {
    return { success: false, error: true,fr:"Une erreur s'est produite, s'il vous plaît veillez recommencer!",eng:"An error occurred, please try again!" }    
  }
};
export const createAttendance =  async (
  data: AttendanceSchema
) => {
    try{
        if(data.type){
            if(data.examenId){
                const verify = await prisma.attendance.findFirst({
                  where:{
                    studentId:data.studentId,
                    examenId:data.examenId
                  }
                })
                if(verify){return}
                await prisma.attendance.create({
                  data:{
                    time:parseInt(data.time),
                    studentId:data.studentId,
                    examenId:data.examenId
                  }
                })
            }
            else{
              const verify = await prisma.attendance.findFirst({
                where:{
                  studentId:data.studentId,
                  lessonId:data.lessonId
                }
              })
              if(verify){return}
              await prisma.attendance.create({
                data:{
                  time:parseInt(data.time),
                  studentId:data.studentId,
                  lessonId:data.lessonId
                }
              })
            }
        }
        else{
          if(data.examenId){
            await prisma.attendance.deleteMany({
              where:{
                studentId:data.studentId,
                examenId:data.examenId
              }
            })
          }
          else{
            await prisma.attendance.deleteMany({
              where:{
                studentId:data.studentId,
                lessonId:data.lessonId
              }
            })
          }
        }
    }
    catch(error:any){
           
    }
}
export const getAllAttendances = async () => {
  try{
      const user = await getCurrentUser()
      const attendances = await prisma.attendance.findMany({
          where:{
            student:{
              schoolId: user.schoolId
            }
          }
      })
      return attendances 
  }
  catch(error:any){
       
  }
}
export const getResultStudent = async ({classId}:{classId:string})=> {
  try{
      const r = await prisma.student.findMany({
        where:{
          currentClass:{
            id:classId
          }
        }
      })
      return {status:200,data:r} 
  }
  catch(error:any){
    return {status:500,data:null} 
      
  }
}
export const getResult = async ({classId,subjectId,sessionId}:{classId:string,subjectId:string,sessionId:string}) => {
  try{
      const result = await prisma.result.findMany({
        where:{
          student:{
            currentClassId:classId,
          },
          exam:{
            session:{
              sessionSequenceId:sessionId
            },
            subjectId:subjectId
          }           
        },
        include:{
          student:true,
          exam:{
            include:{
              session:true
            }
          }
        }
      })
      return {status:200,data:result} 

  }
  catch(error:any){
    return {status:500,data:null} 
      
  }
}
export const addResult = async ({session,classe,student,rating}:{rating:number, session:string,classe:string,student:string}) => {
  try{
      const isExistExam = await prisma.exam.findFirst({
        where:{
          sessionId:session,
          classes:{
            some:{
              id:classe
            }
          }
        }
      })
      if (!isExistExam) {
        return {
            status: 403,
            fr: "L'examen correspondant à cette session n'a pas encore été programmé. Vous n'êtes pas en mesure d'ajouter une moyenne à cet(te) étudiant(e).",
            eng: "The exam corresponding to this session has not yet been scheduled. You are not able to add an average for this student"
        };
    }
    
    let date = Date.now();
    let currentDate = new Date(date);
    let examDate = new Date(isExistExam.endTime);
    
    // Format JJ/MM/YY
    let formattedCurrentDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear().toString().slice(-2)}`;
    let formattedExamDate = `${String(examDate.getDate()).padStart(2, '0')}/${String(examDate.getMonth() + 1).padStart(2, '0')}/${examDate.getFullYear().toString().slice(-2)}`;
    
    if (isExistExam.endTime.getTime() > date) {
        return {
            status: 403,
            fr: `Cet examen a été programmé pour le ${formattedExamDate} et nous sommes le ${formattedCurrentDate}.`,
            eng: "This exam is scheduled for " + formattedExamDate + " and today is " + formattedCurrentDate + "."
        };
    }
   const isResultExist = await prisma.result.findFirst({
       where:{
           studentId:student,
           exam:{
            sessionId:session
           }
       } 
   })
   if(isResultExist){
       await prisma.result.update({
        where:{
          id:isResultExist.id
        },
        data:{
          rating
        }
       })
       return {status:200,fr:"Enregistrement terminé",eng:"Saved"}

   }
   else{
    const user = await prisma.student.findUnique({
      where:{
        id:student
      },
      include:{
        classYears:{
        orderBy: {
          createdAt: 'desc', // Tri par date de création en ordre décroissant
        },
        take: 1
      }
      }
    })
    await prisma.result.create({
        data:{
          rating,
          exam:{connect:{id:isExistExam.id}},
          student:{connect:{id:student}},
          classYear:{connect:{id:user?.classYears[0].id}}
        }
       })
       return {status:200,fr:"Enregistrement terminé",eng:"Saved"}
   } 
  }
  catch(error:any){
    return {status:500,fr:error.message,eng:error.message}
      
  }

}
export const getCurrentStudents = async ({classId}:{classId:string}) => {
  try{
      const r = await prisma.student.findMany({
        where:{
          currentClassId:classId
        },
        include:{
          studentFees:{
            where:{
              schoolYear:{
                current:true
              }
          },
            include:{
              fees:{
                include:{
                  tranches:{
                    select:{
                      amount:true
                    }
                  }
                }
              }
            }
          }
        }
      })
      return r
  }
  catch(error:any){

  }
}
export const getClasses = async ({schoolId}:{schoolId:string}) => {
  try{
      const r = await prisma.class.findMany({
        where:{
          schoolId:schoolId
        },
        include:{
          fees:{
            include:{
              tranches:{
                orderBy:{
                  order:"asc"
                }
              },
            }
          },
          school:true
        }
      })
      return r
  }
  catch(error:any){

  }
}
export const getCurrentStudentsWithStatus = async ({classId,status,tranche}:{classId:string,status:string,tranche:number}) => {
  try{
      const currentUser = await getCurrentUser()
      const currentSchool = await prisma.school.findUnique({
        where:{
          id:currentUser?.schoolId
        }
      })
      const currentClass = await prisma.class.findUnique({
        where: {
            id: classId
        },
        include: {
            fees: {
                include: {
                    tranches: {
                        where: {
                            order: {
                                lte: tranche // lte signifie "less than or equal"
                            }
                        },
                        select: {
                            amount: true // ne sélectionne que le champ amount
                        }
                    }
                }
            }
        }
     });
     if(!currentClass || !currentSchool ){
      return
     }
     let totalamount = parseInt(currentSchool?.inscription.toString()) ||0

     for(let i = 0;i<currentClass.fees.tranches.length;i++){
         totalamount +=  parseInt(currentClass.fees.tranches[i].amount.toString())
     }
      let query:Prisma.StudentWhereInput = {}
      if(status === "1"){
          query.studentFees= {
              some:{
                amount:{
                  gte:totalamount
                }
              }
          }
      }
      else{
        query.studentFees= {
          some:{
            amount:{
              lt:totalamount
            }
          }
        }
      }
      query.currentClassId = classId
      const r = await prisma.student.findMany({
        where:query,
        include:{
          studentFees:{
            where:{
                schoolYear:{
                  current:true
                }
            },
            include:{
              fees:{
                include:{
                  tranches:{
                    select:{
                      amount:true
                    }
                  }
                }
              }
            }
          }
        }
      })
      return r
  }
  catch(error:any){
   
  }
}
export const getStudentById = async ({id}:{id:string}) =>{
  try{
      const user = await prisma.student.findUnique({
        where:{
          id
        },
        include:{
          studentFees:{
            include:{
              fees:{
                include:{
                  tranches:true
                }
              }
            }
          },
          currentClass:true,
          school:true

        }
      }) 
      return {status:200,data:user}
  }
  catch(error:any){
    return {status:500,data:null}
  }
}
export const getStudentByMatricule = async ({m}:{m:string}) =>{
  try{
      const user = await prisma.student.findFirst({
        where:{
          matricule:m
        },
        include:{
          studentFees:{
            include:{
              fees:{
                include:{
                  tranches:true
                }
              }
            }
          },
          currentClass:true,
          school:true
        },
      
      }) 
   
      return {status:200,data:user}
  }
  catch(error:any){
    return {status:500,data:null}
      
  }
}
export const addFees = async ({m,id,amount}:{m?:string,id?:string,amount:number}) =>{
  try{
    const date = new Date();
    const month = date.getMonth() + 1
      const currentUser = await getCurrentUser()
      if(id){
          const s = await prisma.student.findUnique({
            where:{
              id
            },
            include:{
              studentFees:{
                where:{
                  schoolYearId:currentUser?.currentSchoolYear||''
                },
                take:1,
                include:{
                  fees:{
                    include:{
                      tranches:true
                    }
                  }
                }
              },
              school:true
            }
          })
          let sum = s?.studentFees[0]?.fees.tranches.reduce(
            (s:number,t:any)=>{
                return s += parseInt(t.amount.toString())
            },0
          )||0
          sum += parseInt(s?.school.inscription.toString()||"")
          if(sum===parseInt(s?.studentFees[0]?.amount.toString()||"")+amount){
            return {status:200,fr:`L'étudiant a réglé la pension en totalité`,eng:`The student has fully paid the tuition`} 
          }
          else if(sum<parseInt(s?.studentFees[0]?.amount.toString()||"")+amount){
              return {status:200,fr:`Vous ne pouvez pas entrer plus de ${sum-parseInt(s?.studentFees[0]?.amount.toString()||"")} fcfa`,eng:`You can't enter more than ${sum-parseInt(s?.studentFees[0]?.amount.toString()||"")} fcfa`}  
          }
          await prisma.studentFees.update({
            where:{
              id:s?.studentFees[0]?.id
            },
            data:{
                amount:amount+parseInt(s?.studentFees[0]?.amount.toString()||"")
            }
          })
          let rest = sum- amount+parseInt(s?.studentFees[0]?.amount.toString()||"")
          await prisma.historiqueFees.create({
            data:{
            amount:amount,
            eng:"Payment of " + amount + " Fcfa, remaining to pay: " + rest + " Fcfa",

            fr:"Paiement de "+amount+" Fcfa, reste à payer: "+rest+' Fcfa',
             month:month.toString(),
             fees:{
              connect:{
                id:s?.studentFees[0].id
              }
             } 
            }
          })
         return {status:200,fr:"  Enregistré",eng:"Saved"}

      }
      else if(m){
        const s = await prisma.student.findFirst({
          where:{
            matricule:m
          },
          include:{
            studentFees:{
              where:{
                schoolYearId:currentUser?.currentSchoolYear||''
              },
              take:1,
              include:{
                fees:{
                  include:{
                    tranches:true
                  }
                }
              }
            },
            school:true
          }
        })
        let sum = s?.studentFees[0]?.fees.tranches.reduce(
          (s:number,t:any)=>{
              return s += parseInt(t.amount.toString())
          },0
        )||0
        sum += parseInt(s?.school.inscription.toString()||"")
        if(sum===parseInt(s?.studentFees[0]?.amount.toString()||"")+amount){
          return {status:200,fr:`L'étudiant a réglé la pension en totalité`,eng:`The student has fully paid the tuition`} 
        }
        else if(sum<parseInt(s?.studentFees[0]?.amount.toString()||"")+amount){
            return {status:200,fr:`Vous ne pouvez pas entrer plus de ${sum-parseInt(s?.studentFees[0]?.amount.toString()||"")} fcfa`,eng:`You can't enter more than ${sum-parseInt(s?.studentFees[0]?.amount.toString()||"")} fcfa`}  
        }
        await prisma.studentFees.update({
          where:{
            id:s?.studentFees[0]?.id
          },
          data:{
              amount:amount+parseInt(s?.studentFees[0]?.amount.toString()||"")
          }
        })
        let rest = sum- amount+parseInt(s?.studentFees[0]?.amount.toString()||"")
        await prisma.historiqueFees.create({
          data:{
          amount:amount,
          eng:"Payment of " + amount + " Fcfa, remaining to pay: " + rest + " Fcfa",
          month:month.toString(),
          fr:"Paiement de "+amount+" Fcfa, reste à payer: "+rest+' Fcfa',
           fees:{
            connect:{
              id:s?.studentFees[0].id
            }
           } 
          }
        })
       return {status:200,fr:"Enregistré",eng:"Saved"}
      } 
      else{
        return {status:404,fr:"Veillez fournir l'id ou le matricule",eng:"Please provide the ID or the registration number"}
      }   
  }
  catch(error:any){
    return {status:500,fr:error.message,eng:error.message}
  }
}
export const getFinanceFess = async () => {
  try{
    const schoolYearId = (await getCurrentUser()).schoolId; // Remplacez par l'ID de l'année scolaire
    const r = await prisma.historiqueFees.groupBy({
      by:["month"],
      _sum:{
        amount:true
      }
    }    )
    
    // Afficher le résultat
     return r
  }
  catch(error:any){

  }
}