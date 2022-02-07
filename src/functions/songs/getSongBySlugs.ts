import querySongByArtist from "./querySongByArtist";

export async function main(event: any) {
    try {
        const artistSlug = event.pathParameters.artistSlug;
        const songSlug = event.pathParameters.songSlug;
 
        return await querySongByArtist(artistSlug, songSlug)
    } catch (error) {
        console.error(error);    

        return null;
    }
}