import { getClient } from "../../contentful/client";
import Song from "../../types/Song";
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { mapContentfulLoopResponseToLoopObj } from "../../helper/loop";
import Loop from "../../types/Loop";

export default async function queryLoopBySlugs(loopmakerSlug: string, loopSlug: string): Promise<any> {
    try {
        const client = getClient();

        const queryLoopEntriesResponse = await client.getEntries({
            content_type: 'loop',
            'fields.slug': loopSlug
          })
        
          
        const loopResults = queryLoopEntriesResponse.items.map((loopDataResponse: any): Loop | null => {
            return mapContentfulLoopResponseToLoopObj(loopDataResponse)
        })
        
        const loop = loopResults.filter((loop: Loop | null) => {
            if (loop) {
                return loop.loopmaker.map((l: any) => l.slug).includes(loopmakerSlug)
            }
        })[0] || null; 

        const querySongEntriesResponse = await client.getEntries({
            content_type: "song",
            "fields.loop.sys.id": `${loop?.id}`
        })

        const songResults = querySongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })


        return {
            loop,
            songs: songResults
        };

    } catch (error) {
        console.error(error);    

        return null;
    }
}