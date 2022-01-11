
import LoopPack from "../../types/LoopPack"
import Loopmaker from "../../types/Loopmaker"
import { getClient } from "../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image";

export default async function listLoopPacks(): Promise<(LoopPack | null)[] | null> {

    try {
        const client = getClient();

        const loopPackEntriesResponse = await client.getEntries({
            content_type: 'loopPack'
        })   

        const listLoopPacksResponse = loopPackEntriesResponse.items?.map((loopPack: any): LoopPack | null=> {
        try {
            const { id } = loopPack.sys;
            const { title, url, releaseDate, slug, loopmaker, artwork } = loopPack.fields;
            const imageUrl = convertContentfulFileUrlToImageUrl(artwork.fields?.file?.url)

            return {
                id,
                title,
                url,
                releaseDate,
                slug,
                imageUrl,
                loopmaker: loopmaker?.map((loopmaker: any): Loopmaker => {
                    const { id } = loopmaker.sys;
                    const { name, slug } = loopmaker.fields;

                    return {
                        id,
                        name,
                        slug,
                    }
                })
            }
        } catch (error) {
            console.log(`error when mapping loopPack ${JSON.stringify(loopPack, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
            return null;  
        }
        
        }).filter(n => n);
        
        return listLoopPacksResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}