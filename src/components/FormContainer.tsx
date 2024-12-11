import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getCurrentUser } from "@/lib/functs";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "school"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement"
     |"schoolyear"
    ;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const currentUser = await getCurrentUser()
  const classes = await prisma.class.findMany()
  
  if (type !== "delete") {
    switch (table) {  
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
          where:{schoolId:currentUser?.schoolId},
          orderBy:[{username:"asc"}]
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "announcement" :
        const classe = await  prisma.class.findMany({
          where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]
        })
        relatedData = {classes:classe}
        break
      case "class":
        // const classGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
          where:{schoolId:currentUser?.schoolId},
          orderBy:[{username:"asc"}]
        });
        relatedData = { teachers: classTeachers};
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
          where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]

        });
        relatedData = { subjects: teacherSubjects? teacherSubjects:[] };
        break;
      case "student":
        // const studentGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { currentStudents: true } } },
          where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]
        });
        const parents = await prisma.parent.findMany({where:{students:{some:{schoolId:currentUser?.schoolId}}},
          orderBy:[{username:"asc"}]
        
        })
        relatedData = { classes: studentClasses,parents };
        break;
      case "exam":
        const ts = await prisma.teacher.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{username:"asc"}]
        })
        const cls = await prisma.class.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]
        })
        const sb = await prisma.subject.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]
        })
        const ss = await prisma.sessionSequence.findMany({where:{mestre:{schoolYear:{schoolId:currentUser?.schoolId}}},orderBy:[{order:"asc"}]})
        const m = await prisma.mestre.findMany({where:{schoolYear:{schoolId:currentUser?.schoolId}},orderBy:[{order:"asc"}]})
        relatedData = { teachers:ts,classes:cls,subjects:sb,sessions:ss,mestres:m };
        break;
      case "schoolyear":
        const school = await prisma.school.findUnique({where:{id:data}})
        relatedData = {school}
        break
      case "lesson":
        const teachers = await prisma.teacher.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{username:"asc"}]
        })
        const classes = await prisma.class.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}] 
        })
        const subjects = await prisma.subject.findMany({where:{schoolId:currentUser?.schoolId},
          orderBy:[{name:"asc"}]
        })
        relatedData = {teachers,classes,subjects}
        break
      default:  
        break;
    }
  }
  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        user = {currentUser}
        relatedData={relatedData}
        classes = {classes}
      />
    </div>
  );
};

export default FormContainer;
