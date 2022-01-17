import jwt from "jsonwebtoken"

export async function main(event: any) {
    try {
        const data = JSON.parse(event.body)
        const { sub, email, displayName, picture } = data;

        const secretKey = process.env.NODEBB_SESSION_SHARE_SECRET_KEY as string;
        const payload = {
            id: sub,
            username: displayName,
            email,
            picture
        };

        const jwtvalue = jwt.sign( payload, secretKey );
 
        return jwtvalue;
    } catch (error) {
        console.error(error);    

        return null;
    }
}