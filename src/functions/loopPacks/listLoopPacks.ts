
import LoopPack from "../../types/LoopPack"
import Loopmaker from "../../types/Loopmaker"
import { getClient } from "../../contentful/client"

export default async function listLoopPacks(): Promise<LoopPack[] | null> {

    try {
        const client = getClient();

        const loopPackEntriesResponse = await client.getEntries({
            content_type: 'loopPack'
          })

        

        const listLoopPacksResponse = loopPackEntriesResponse.items?.map((loopPack: any): LoopPack => {
            const { id } = loopPack.sys;
            const { title, url, releaseDate, slug, loopmaker } = loopPack.fields;

            console.log(`loopPack.fields ${JSON.stringify(loopPack.fields, null, 2)}`);

            return {
                id,
                title,
                url,
                releaseDate,
                slug,
                loopmaker: loopmaker?.map((loopmaker: any): Loopmaker => {
                    const { id } = loopmaker.sys;
                    const { name } = loopmaker.fields;



                    return {
                        id,
                        name,
                    }
                })
            }
        })
        
        return listLoopPacksResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}