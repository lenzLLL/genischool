import { Admin, Teacher } from "@prisma/client";

export type AuthSchema = {
    email:string|null
    matricule:string|null
    role:string|null
    password:string|null
    schoolId:string
    currentSchoolYear:string|null,
    fullname:string|null
    id:string|null
    lang:string|null
}