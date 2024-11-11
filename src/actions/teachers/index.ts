import prisma from "@/lib/prisma";


export const getAllTeachers = async () => {
    const teachers = await prisma.teacher.findMany({})
    return {
        teachers
    }
}