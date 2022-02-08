import queryLoopPackBySlugs from "./queryLoopPackBySlugs";

export async function main(event: any) {
    try {
        const loopmakerSlug = event.pathParameters.loopmakerSlug;
        const loopPackSlug = event.pathParameters.loopPackSlug;
 
        return await queryLoopPackBySlugs(loopmakerSlug, loopPackSlug)
    } catch (error) {
        console.error(error);    
        return null;
    }
}