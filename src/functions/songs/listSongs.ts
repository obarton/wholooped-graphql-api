
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";

export default async function listSongs(): Promise<Song[] | null> {

    try {
        const client = getClient();

        const songEntriesResponse = await client.getEntries({
            content_type: 'song'
          })
        
        console.log(`songEntriesResponse.items[0] ${JSON.stringify(songEntriesResponse.items[0], null, 2)}`);
          
        const listSongsResponse = songEntriesResponse.items.map((song: any): Song => {
            return mapContentfulSongResponseObjToSongObj(song)
        })
        
        return listSongsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}