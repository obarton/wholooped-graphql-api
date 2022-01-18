import Loopmaker from "../types/Loopmaker";
import LoopPack from "../types/LoopPack";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulLoopPackResponseObjToLoopPackObj = (loopPack: any): LoopPack | null=> {
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
}