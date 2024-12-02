import { z } from "zod";

export const schoolSchema = z.object({
  id: z.coerce.string().optional(),
  key:z.string().optional(),
  newImage:z.boolean().optional(),
  img:z.string().optional(),
  name: z.string().min(1, { message: "School name is required!" }),
  email: z.string().optional(),
  address: z.string(),
  type: z.string()
})

export type SchoolSchema = z.infer<typeof schoolSchema>;

export const subjectSchema = z.object({
  id: z.coerce.string().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  teachers: z.array(z.string()), //teacher ids
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
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  subjects: z.array(z.string()).optional(), // subject ids
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
  key: z.string().optional(),
  newImage: z.boolean().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  classId: z.coerce.string().min(1, { message: "Class is required!" }),
  parentId: z.string().optional(),

});

export type StudentSchema = z.infer<typeof studentSchema>;

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: "Title name is required!" }),
  startTime: z.coerce.date({ message: "Start time is required!" }),
  endTime: z.coerce.date({ message: "End time is required!" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
});

export type ExamSchema = z.infer<typeof examSchema>;

export const schoolYearSchema = z.object({
  id: z.coerce.number().optional(),
  schoolId: z.string(),
  title:z.string().min(1, { message: "Title is required!" }),
  type: z.string()
});

export type SchoolYearchema = z.infer<typeof schoolYearSchema>;
