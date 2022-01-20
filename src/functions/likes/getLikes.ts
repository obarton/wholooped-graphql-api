import listLikes from "./listLikes";

export async function main(event: any) {
    try {
        const userId = event.pathParameters.userId;
 
        return await listLikes(userId)
    } catch (error) {
        console.error(error);    

        return null;
    }
}