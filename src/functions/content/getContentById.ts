
import { getClient } from "../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image";

export async function main(event: any) {

    try {
        const client = getClient();

        const loopmakerProfile = await client.getEntry("5COxeCZOPmbaXN3znqlIoJ")
        const { id, createdAt } = loopmakerProfile.sys;
        const { 
            name, 
            username, 
            websiteUrl, 
            bio, 
            photo, 
            headerPhoto,
            twitterUrl,
            facebookUrl,
            instagramUrl } = loopmakerProfile.fields as any;

        return { 
            id,
            name,
            username,
            websiteUrl,
            bio,
            photoUrl: convertContentfulFileUrlToImageUrl(photo.fields?.file?.url),
            headerPhotoUrl: convertContentfulFileUrlToImageUrl(headerPhoto.fields?.file?.url),
            dateJoined: createdAt,
            twitterUrl,
            facebookUrl,
            instagramUrl
        }
        
    } catch (error) {
        console.error(error);    

        return null;
    }
}