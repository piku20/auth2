"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcryptjs from 'bcryptjs';
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationEmail } from "@/lib/mail";

const register = async(values: z.infer<typeof RegisterSchema>) => {
    
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success){
        return {
            error: "Invalid fields!",
        }
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password,10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {
            error: "Email already in use!"
        }
    }

    await db.user.create({
        data:{
            name,
            email,
            password: hashedPassword,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );
    
    return {
        success: "Confirmation email sent!",
    }
}

export default register;