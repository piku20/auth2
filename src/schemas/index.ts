import { UserRole } from "@prisma/client";
import * as z from "zod";

const SettingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(1)),
    newPassword: z.optional(z.string().min(1)),    
})
.refine((data) => {
    if(data.password && !data.newPassword){
        return false;
    }

    return true;
},{
    message: "New password is required!",
    path: ["newPassword"]   
})
.refine((data)=>{
    if(data.newPassword && !data.password){
        return false;
    }
    
    return true;
},{
    message: "Password is required!",
    path: ["password"]
});



const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required",
    }),
});

const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

const LoginSchema = z.object({
    email:z.string().email({
        message:"Email is required",
    }),
    password: z.string().min(1,{
        message: "Password is required",
    }),
    code:z.optional(z.string()),
});

const RegisterSchema = z.object({
    email: z.string().email({
        message:"Email is required",
    }),
    password: z.string().min(1, {   // change to 6
        message:"Minimum 6 characters required",
    }),
    name: z.string().min(1, {
        message: "Name is required"
    })
});

export {
    SettingsSchema,
    NewPasswordSchema,
    ResetSchema,
    LoginSchema,
    RegisterSchema,
};