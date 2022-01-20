import getSongById from "./getSongById";

export async function main(event: any) {
    try {
        const userId = event.pathParameters.userId;
        const songId = event.pathParameters.id;
 
        return await getSongById(userId, songId)
    } catch (error) {
        console.error(error);    

        return null;
    }
}