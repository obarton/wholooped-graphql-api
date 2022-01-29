import UserProfile from "../types/UserProfile";
import { convertContentfulFileUrlToImageUrl } from "./image";
import { mapContentfulLoopmakerResponseObjToLoopmakerObj } from "./loopmaker";

export const mapContentfulUserResponseObjToUserObj = (contentfulUserResponseObj: any): UserProfile | null=> {
    try {
        const { id } = contentfulUserResponseObj.sys;
        const { 
            name,
            authId,
            displayName,
            slug,
            photo,
            bio,
            attributes,
            isLoopmaker,
            linkedLoopmaker
        } = contentfulUserResponseObj.fields;

        return {
            id,
            authId,
            name,
            displayName,
            slug,
            photo: {
                id: photo?.sys.id,
                title: photo?.fields.title,
                url: convertContentfulFileUrlToImageUrl(photo?.fields.file.url)
            },
            bio,
            attributes: attributes ? attributes.map((attribute: any) => {
                return {
                    id: attribute.sys.id,
                    name: attribute.fields.name
                }
            }): [],
            isLoopmaker,
            linkedLoopmaker: linkedLoopmaker ? mapContentfulLoopmakerResponseObjToLoopmakerObj(linkedLoopmaker):  null 
        }
    } 
    catch (error) {
        console.log(`error when mapping user ${JSON.stringify(contentfulUserResponseObj, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;
    }
}