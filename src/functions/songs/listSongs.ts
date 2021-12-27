
import Song from "../../types/Song"
import Artist from "../../types/Artist"
import { getClient } from "../../contentful/client"

export default async function listSongs(): Promise<Song[] | null> {

    try {
        const client = getClient();

        const songEntriesResponse = await client.getEntries({
            content_type: 'song'
          })

        const listSongsResponse = songEntriesResponse.items.map((song: any): Song => {
            const { id } = song.sys;
            const { 
                title,
                url,
                loopStartTimeSeconds,
                isActive,
                slug,
                isFeatured,
                artist
            } = song.fields;
            
            return {
                id,
                title,
                url,
                loopStartTimeSeconds,
                isActive,
                slug,
                isFeatured,
                artist: artist.map((artist: any): Artist => {
                    const { id } = artist.sys;
                    const { name, viewCount, slug } = artist.fields;

                    return {
                        id,
                        name,
                        viewCount,
                        slug
                    }
                })
            }
        })

        console.log(`listSongsResponse ${JSON.stringify(listSongsResponse, null, 2)}`);
        
        return listSongsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}