import Genre from "../types/Genre";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulGenreResponseObjToGenreObj = (contentfulGenreResponseObj: any): Genre | null=> {
    try {
        const { id } = contentfulGenreResponseObj.sys;
        const { name, slug, coverImage } = contentfulGenreResponseObj.fields;

        return {
            id,
            name,
            slug,
            coverImage: {
                id: coverImage.sys.id,
                title: coverImage.fields.title,
                url: convertContentfulFileUrlToImageUrl(coverImage?.fields?.file?.url) || ""
            }
        }
        
    } 
    catch (error) {
        console.log(`error when mapping genre ${JSON.stringify(contentfulGenreResponseObj, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;
    }
}