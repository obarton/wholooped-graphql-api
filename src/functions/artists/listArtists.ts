
import Artist from "../../types/Artist"
import { getClient } from "../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image";

export default async function listArtists(): Promise<(Artist | null)[] | null> {

    try {
        const client = getClient();

        const artistEntriesResponse = await client.getEntries({
            content_type: 'artist'
          })

        const listArtistsResponse = artistEntriesResponse.items.map((artist: any): Artist | null => {
            try {
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
                        url: convertContentfulFileUrlToImageUrl(photo?.fields?.file?.url) || ""
                    }
                }
                
            } 
            catch (error) {
                console.log(`error when mapping artist ${JSON.stringify(artist, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
                return null;
            }
        }).filter(n => n)
        
        return listArtistsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}