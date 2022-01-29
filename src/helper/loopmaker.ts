import Loopmaker from "../types/Loopmaker";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulLoopmakerResponseObjToLoopmakerObj = (contentfulLoopmakerResponseObj: any): Loopmaker | null=> {
    try {
        const { id } = contentfulLoopmakerResponseObj.sys;
        const { 
            name, 
            username,
            slug,
            websiteUrl,
            profilePhoto,
            headerPhoto,
            bio,
            twitterUrl,
            facebookUrl,
            instagramUrl
         } = contentfulLoopmakerResponseObj.fields;

        return {
            id,
            name,
            slug,
            username,
            websiteUrl,
            profilePhoto: {
                id: profilePhoto.sys.id,
                title: profilePhoto.fields.title,
                url: convertContentfulFileUrlToImageUrl(profilePhoto.fields.file.url),
            },
            headerPhoto: {
                id: headerPhoto.sys.id,
                title: headerPhoto.fields.title,
                url: convertContentfulFileUrlToImageUrl(headerPhoto.fields.file.url),
            },
            bio,
            twitterUrl,
            facebookUrl,
            instagramUrl
        }   
    } 
    catch (error) {
        console.log(`error when mapping loopmaker ${JSON.stringify(contentfulLoopmakerResponseObj, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;
    }
}