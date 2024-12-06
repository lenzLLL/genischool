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
  const d= await prisma.class.findMany({where:{schoolId:currentUser?.schoolId}})
  const classes = await prisma.class.findMany()
  
  if (type !== "delete") {
    switch (table) {  
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
          where:{schoolId:currentUser?.schoolId}
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "announcement" :
        const classe = await  prisma.class.findMany({
          where:{schoolId:currentUser?.schoolId}

        })
        relatedData = {classes:classe}
        break
      case "class":
        // const classGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
          where:{schoolId:currentUser?.schoolId}
        });
        relatedData = { teachers: classTeachers};
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
          where:{schoolId:currentUser?.schoolId}

        });
        relatedData = { subjects: teacherSubjects? teacherSubjects:[] };
        break;
      case "student":
        // const studentGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { currentStudents: true } } },
          where:{schoolId:currentUser?.schoolId}

        });
        const parents = await prisma.parent.findMany()
        relatedData = { classes: studentClasses,parents };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(currentUser?.role === "Teacher" ? { teacherId: currentUser?.id! } : {}),
            class:{
              schoolId:currentUser?.schoolId
            }
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;
      case "schoolyear":
        const school = await prisma.school.findUnique({where:{id:data}})
        relatedData = {school}
        break
      case "lesson":
        const teachers = await prisma.teacher.findMany({where:{schoolId:currentUser?.schoolId}})
        const classes = await prisma.class.findMany({where:{schoolId:currentUser?.schoolId}})
        const subjects = await prisma.subject.findMany({where:{schoolId:currentUser?.schoolId}})
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
        relatedData={relatedData}
        classes = {classes}
      />
    </div>
  );
};

export default FormContainer;
