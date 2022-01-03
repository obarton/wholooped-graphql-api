
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { mapContentfulLoopResponseToLoopObj } from "../../helper/loop";
import getLikesCountById from "../likes/getLikesCountById";
import getLikeById from "../likes/getLikeById";

export default async function getSongById(userId: string, songId: string): Promise<Song | null> {
    try {
        const client = getClient();

        // get song response
        const response = await client.getEntry(songId);

        // get loop response
        const loopId = (response as any).fields.loop[0].sys.id;
        const itemId = `${songId}:${loopId}`;
        const loopResponse = await client.getEntry(loopId);
        const likesCountResponse = await getLikesCountById(itemId)
        const isLikedResponse = await getLikeById(userId, itemId)

        // map to response object
        const songObj = mapContentfulSongResponseObjToSongObj(response);
        songObj.loop = mapContentfulLoopResponseToLoopObj(loopResponse);
        songObj.likesCount = likesCountResponse
        songObj.isLiked = isLikedResponse?.isLiked;
        
        return songObj;
    } catch (error) {
        console.error(error);    
        return null;
    }
}