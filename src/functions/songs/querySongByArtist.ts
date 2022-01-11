
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";

export default async function querySongByArtist(artistSlug: string, songSlug: string): Promise<Song | null> {
    try {
        const client = getClient();

        const querySongEntriesResponse = await client.getEntries({
            content_type: 'song',
            'fields.slug': songSlug
          })
        
        console.log(`querySongEntriesResponse.items[0] ${JSON.stringify(querySongEntriesResponse.items[0], null , 2)}`);
        
        const songResults = querySongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })
        
        return songResults.filter((song: Song | null) => {
            if (song) {
                return song.artist[0].slug == artistSlug
            }
        })[0] || null;
    } catch (error) {
        console.error(error);    

        return null;
    }
}