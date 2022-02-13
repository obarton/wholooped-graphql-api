import Loopmaker from "../types/Loopmaker";
import LoopPack from "../types/LoopPack";
import { convertContentfulFileUrlToImageUrl, DEFAULT_IMG_URL } from "./image";

export const mapContentfulLoopPackResponseObjToLoopPackObj = (loopPack: any): LoopPack | null=> {
    try {
        const { id } = loopPack.sys;
        const { title, url, releaseDate, slug, loopmaker, artwork } = loopPack.fields;
        const imageUrl = artwork ? convertContentfulFileUrlToImageUrl(artwork.fields?.file?.url) : DEFAULT_IMG_URL

        const loopPackObj: LoopPack = {
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

        return loopPackObj;
    } catch (error) {
        console.log(`error when mapping loopPack ${JSON.stringify(loopPack.fields.title, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;  
    }
}