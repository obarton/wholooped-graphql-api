
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
            const { name, viewCount, slug, photo } = artist.fields;

            return {
                id,
                name,
                viewCount,
                slug,
                photo: {
                    id: photo.sys.id,
                    title: photo.fields.title,
                    url: photo.fields.file.url ? `https:${photo.fields.file.url}` : ""
                }
            }
        })
        
        return listArtistsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}