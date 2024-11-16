import { Admin, Teacher } from "@prisma/client";

export type AuthSchema = {
    email:string|null
    fullname:string|null
    role:string|null
    id:string
}