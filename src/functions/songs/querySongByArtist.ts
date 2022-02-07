
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { mapContentfulLoopResponseToLoopObj } from "../../helper/loop";
import getLikesCountById from "../likes/getLikesCountById";

export default async function querySongByArtist(artistSlug: string, songSlug: string): Promise<Song | null> {
    try {
        const client = getClient();

        const querySongEntriesResponse = await client.getEntries({
            content_type: 'song',
            'fields.slug': songSlug
          })
        
        const songResults = querySongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })
        
        const song = songResults.filter((song: Song | null) => {
            if (song) {
                return song.artist[0].slug == artistSlug
            }
        })[0] || null; 

        if (song == null) {
            return song;
        }

        const loopId = song.loop[0].id as string;
        
        if (loopId) {
            const loopResponse = await client.getEntry(loopId);
            song.loop = mapContentfulLoopResponseToLoopObj(loopResponse);
        }

        const itemId = `${song?.id}:${loopId}`;
        const likesCountResponse = await getLikesCountById(itemId)
        song.likesCount = likesCountResponse;

        return song;

    } catch (error) {
        console.error(error);    

        return null;
    }
}