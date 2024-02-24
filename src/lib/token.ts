import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import crypto from "crypto";
import { db } from "./db";
import { v4 as uuidv4} from 'uuid';
import { getVerificationTokenByEmail } from "@/data/verification-token";

const generateTwoFactorToken = async(email:string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes = 300_000 milliseconds

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where:{
                id: existingToken.id,
            }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data:{
            email,
            token,
            expires,
        },
    });

    return  twoFactorToken;
};

const generatePasswordResetToken = async(email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1hr

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await db.twoFactorToken.delete({
            where:{
                id:existingToken.id,
            }
        });
    }

    const twoFactorToken = await db.twoFactorToken.create({
        data:{
            email,
            token,
            expires,
        },
    });

    return twoFactorToken;
};

const generateVerificationToken = async(email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); //1hr

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await db.verificationToken.delete({
            where:{
                id: existingToken.id,
            },
        });
    }

    const verificationToken = await db.verificationToken.create({
        data:{
            email,
            token,
            expires,
        }
    });

    return verificationToken;
};

export {
    generateTwoFactorToken,
    generatePasswordResetToken,
    generateVerificationToken,
};