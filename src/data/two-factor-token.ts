import { db } from "@/lib/db";

const getTwoFactorTokenByToken = async(token:string) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where:{token}
        });

        return twoFactorToken;
    }catch{
        return null;
    }
};

const getTwoFactorTokenByEmail = async(email:string) => {
    try{
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where:{email},
        });
    }catch{
        return null;
    }
};

export {
    getTwoFactorTokenByEmail,
    getTwoFactorTokenByToken
}