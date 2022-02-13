import queryLoopBySlugs from "./queryLoopBySlugs";

export async function main(event: any) {
    try {
        const loopmakerSlug = event.pathParameters.loopmakerSlug;
        const loopSlug = event.pathParameters.loopSlug;
 
        return await queryLoopBySlugs(loopmakerSlug, loopSlug)
    } catch (error) {
        console.error(error);    
        return null;
    }
}