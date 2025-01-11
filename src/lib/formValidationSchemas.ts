import { z } from "zod";
const arraySchema = z.object({
  id: z.coerce.string(), // Identifiant de l'enseignant
  name: z.coerce.string() // Sujet enseigné
});
const ArraySchema = z.array(arraySchema)
const arraySchema2 = z.object({
  id: z.coerce.string(), // Identifiant de l'enseignant
  username: z.coerce.string() // Sujet enseigné
});
const ArraySchema2 = z.array(arraySchema2)
export const schoolSchema = z.object({
  id: z.coerce.string().optional(),
  key:z.string().optional(),
  newImage:z.boolean().optional(),
  img:z.string().optional(),
  name: z.string().min(1, { message: "School name is required!" }),
  email: z.string().optional(),
  address: z.string(),
  type: z.string(),
  inscription: z.string(),
  lang:z.string()
})
export type SchoolSchema = z.infer<typeof schoolSchema>;
export const subjectSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: ArraySchema2.optional(), //teacher ids
});
export type SubjectSchema = z.infer<typeof subjectSchema>;
export const classSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  supervisorId: z.coerce.string().optional(),
});
export type ClassSchema = z.infer<typeof classSchema>;
export const teacherSchema = z.object({
  id: z.string().optional(),
  key:z.string().optional(),
  newImage:z.boolean().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string(),
  img: z.string().optional(),
  subjects: ArraySchema.optional(), // subject ids
});
export type TeacherSchema = z.infer<typeof teacherSchema>;
export const studentSchema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" })
    .or(z.literal("")),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  img: z.string().optional(),
  key: z.string().optional(),
  newImage: z.boolean().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  classId: z.coerce.string().optional(),
  parentId: z.string().optional(),
  matricule:z.string()

});
export type StudentSchema = z.infer<typeof studentSchema>;
export const schoolYearSchema = z.object({
  id: z.coerce.number().optional(),
  schoolId: z.string(),
  title:z.string().min(1, { message: "Title is required!" }),
  type: z.string()
});
export type SchoolYearchema = z.infer<typeof schoolYearSchema>;
export const announcementSchema = z.object({
  id: z.coerce.string().optional(),
  description: z.string().min(1, { message: "Description is required!" }),
  title:z.string().min(1, { message: "Title is required!" }),
  date: z.coerce.date().optional(),
  classes: ArraySchema.optional(), //teacher ids
});
export type AnnouncementSchema = z.infer<typeof announcementSchema>;
export const eventSchema = z.object({
  id: z.coerce.string().optional(),
  description: z.string().min(1, { message: "Description is required!" }),
  title:z.string().min(1, { message: "Title is required!" }),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});
export type EventSchema = z.infer<typeof eventSchema>;
export const lessonSchema = z.object({
  id: z.coerce.string().optional(),
  subjectId: z.string().optional(),
  teacherId:z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  classes: ArraySchema.optional(), //teacher ids
});
export type LessonSchema = z.infer<typeof lessonSchema>;
export const examSchema = z.object({
  id: z.coerce.string().optional(),
  subjectId: z.string().optional(),
  teacherId:z.string().optional(),
  classes:ArraySchema.optional(),
  sessionId:z.string().optional(),
  credit:z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
   //teacher ids
});
export type ExamSchema = z.infer<typeof examSchema>;
export const parentSchema = z.object({
  id: z.coerce.string().optional(),
  username: z.string(),
  email:z.string(),
  phone:z.string().optional(),
  password:z.string(),
  address:z.string().optional(),
   //teacher ids
});
export type ParentSchema = z.infer<typeof parentSchema>;



