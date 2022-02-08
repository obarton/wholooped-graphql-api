import LoopPack from "../../types/LoopPack";
import { mapContentfulLoopPackResponseObjToLoopPackObj } from "../../helper/loopPacks";
import { getClient } from "../../contentful/client";
import Song from "../../types/Song";
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";

export default async function queryLoopPackBySlugs(loopmakerSlug: string, loopPackSlug: string): Promise<any> {
    try {
        const client = getClient();

        const queryLoopPackEntriesResponse = await client.getEntries({
            content_type: 'loopPack',
            'fields.slug': loopPackSlug
          })
        
          
        const loopPackResults = queryLoopPackEntriesResponse.items.map((loopPackDataResponse: any): LoopPack | null => {
            return mapContentfulLoopPackResponseObjToLoopPackObj(loopPackDataResponse)
        })
        
        const loopPack = loopPackResults.filter((loopPack: LoopPack | null) => {
            if (loopPack) {
                return loopPack.loopmaker.map((l: any) => l.slug).includes(loopmakerSlug)
            }
        })[0] || null; 

        const queryLoopsEntriesResponse = await client.getEntries({
            content_type: "loop",
            "fields.loopPack.sys.id": loopPack?.id
        })
        const loopIds = queryLoopsEntriesResponse.items.map((l: any) => l.sys.id)
        console.log(`queryLoopsEntriesResponse.items ${JSON.stringify(queryLoopsEntriesResponse.items, null, 2)}`)
        
        const querySongEntriesResponse = await client.getEntries({
            content_type: "song",
            "fields.loop.sys.id[in]": `${loopIds.join(",")}`
        })

        const songResults = querySongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })


        return {
            loopPack,
            songs: songResults
        };

    } catch (error) {
        console.error(error);    

        return null;
    }
}