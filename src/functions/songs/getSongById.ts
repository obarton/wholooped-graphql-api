
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { mapContentfulLoopResponseToLoopObj } from "../../helper/loop";

export default async function getSongById(songId: string): Promise<Song | null> {
    try {
        const client = getClient();

        // get song response
        const response = await client.getEntry(songId);

        // get loop response
        const loopId = (response as any).fields.loop[0].sys.id;
        const loopResponse = await client.getEntry(loopId);

        // map to response object
        const songObj = mapContentfulSongResponseObjToSongObj(response);
        songObj.loop = mapContentfulLoopResponseToLoopObj(loopResponse)
        
        return songObj;
    } catch (error) {
        console.error(error);    
        return null;
    }
}