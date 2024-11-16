import { Admin, Teacher } from "@prisma/client";

export type AuthSchema = {
    email:String|null
    fullname:String|null
    role:String|null
    id:String
}