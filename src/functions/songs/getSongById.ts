
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";

export default async function getSongById(songId: string): Promise<Song | null> {
    try {
        const client = getClient();
        const response = await client.getEntry(songId)

        return mapContentfulSongResponseObjToSongObj(response) || null;
    } catch (error) {
        console.error(error);    
        return null;
    }
}