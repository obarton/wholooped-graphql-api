import Artist from "../types/Artist";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulArtistResponseObjToArtistObj = (contentfulArtistResponseObj: any): Artist | null=> {
    try {
        const { id } = contentfulArtistResponseObj.sys;
        const { name, viewCount, slug, photo } = contentfulArtistResponseObj.fields;

        return {
            id,
            name,
            viewCount,
            slug,
            photo: {
                id: photo.sys.id,
                title: photo.fields.title,
                url: convertContentfulFileUrlToImageUrl(photo?.fields?.file?.url) || ""
            }
        }
        
    } 
    catch (error) {
        console.log(`error when mapping artist ${JSON.stringify(contentfulArtistResponseObj, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;
    }
}