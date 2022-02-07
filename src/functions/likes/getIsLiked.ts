import getLikeById from "./getLikeById";

export async function main(event: any) {
    try {
        const userId = event.pathParameters.userId;
        const itemId = event.pathParameters.itemId;
        if (!userId) {
            return false;
        }

 
        return await getLikeById(userId, itemId)
    } catch (error) {
        console.error(error);    

        return null;
    }
}