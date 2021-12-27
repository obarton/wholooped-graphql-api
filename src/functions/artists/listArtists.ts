
import Artist from "../../types/Artist"
import { getClient } from "../../contentful/client"

export default async function listArtists(): Promise<Artist[] | null> {

    try {
        const client = getClient();

        const artistEntriesResponse = await client.getEntries({
            content_type: 'artist'
          })

        const listArtistsResponse = artistEntriesResponse.items.map((artist: any): Artist => {
            const { id } = artist.sys;
            const { name, viewCount, slug } = artist.fields;

            return {
                id,
                name,
                viewCount,
                slug
            }
        })

        console.log(`listArtistsResponse ${JSON.stringify(listArtistsResponse, null, 2)}`);
        
        return listArtistsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}