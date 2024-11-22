import prisma from "@/lib/prisma";
import FormModal from "./FormModal";
import { getCurrentUser } from "@/lib/functs";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};
  const currentUser = await getCurrentUser()
  
  if (type !== "delete") {
    switch (table) {
      case "subject":
        const subjectTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
        });
        relatedData = { teachers: subjectTeachers };
        break;
      case "class":
        // const classGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const classTeachers = await prisma.teacher.findMany({
          select: { id: true, username: true },
        });
        relatedData = { teachers: classTeachers};
        break;
      case "teacher":
        const teacherSubjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        relatedData = { subjects: teacherSubjects? teacherSubjects:[] };
        break;
      case "student":
        // const studentGrades = await prisma.grade.findMany({
        //   select: { id: true, level: true },
        // });
        const studentClasses = await prisma.class.findMany({
          include: { _count: { select: { currentStudents: true } } },
        });
        relatedData = { classes: studentClasses };
        break;
      case "exam":
        const examLessons = await prisma.lesson.findMany({
          where: {
            ...(currentUser?.role === "Teacher" ? { teacherId: currentUser?.id! } : {}),
          },
          select: { id: true, name: true },
        });
        relatedData = { lessons: examLessons };
        break;

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
      />
    </div>
  );
};

export default FormContainer;
