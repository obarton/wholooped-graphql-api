import { getClient } from "../../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../../helper/image";
import Loopmaker from "../../../types/Loopmaker";
import LoopmakerProfile from "../../../types/LoopmakerProfile";
import UserProfile from "../../../types/UserProfile";

export async function main(event: any) {

    try {
        const client = getClient();
        const authId = decodeURIComponent(event.pathParameters.id);
        
        const usersEntriesResponse = await client.getEntries({
            content_type: 'user',
            'fields.id': authId
          })
        
        if (usersEntriesResponse.total == 0) {
            return null;
        }

        const entry = usersEntriesResponse.items[0];
        const fields = (entry.fields as any);

        const profile : UserProfile = {
            id: entry.sys.id,
            authId: fields.id ? fields.id : "",
            name: fields.name ? fields.name: "",
            displayName: fields.displayName ?? "",
            slug: fields.slug,
            photo: {
                id: fields.photo?.sys.id,
                title: fields.photo?.fields.title,
                url: convertContentfulFileUrlToImageUrl(fields.photo?.fields.file.url)
            },
            bio: fields.bio ? fields.bio: "",
            attributes: fields.attributes ? fields.attributes.map((attribute: any) => {
                return {
                    id: attribute.sys.id,
                    name: attribute.fields.name
                }
            }): [],
            isLoopmaker: fields.isLoopmaker ?? false,
            linkedLoopmaker: fields.linkedLoopmaker ? ({
                id: fields.linkedLoopmaker.sys.id,
                name: fields.linkedLoopmaker.fields.name,
                username: fields.linkedLoopmaker.fields.username,
                websiteUrl: fields.linkedLoopmaker.fields.websiteUrl,
                profilePhoto: {
                    id: fields.linkedLoopmaker.fields.profilePhoto.sys.id,
                    title: fields.linkedLoopmaker.fields.profilePhoto.fields.title,
                    url: convertContentfulFileUrlToImageUrl(fields.linkedLoopmaker.fields.profilePhoto.fields.file.url),
                },
                headerPhoto: {
                    id: fields.linkedLoopmaker.fields.headerPhoto.sys.id,
                    title: fields.linkedLoopmaker.fields.headerPhoto.fields.title,
                    url: convertContentfulFileUrlToImageUrl(fields.linkedLoopmaker.fields.headerPhoto.fields.file.url),
                },
                bio: fields.linkedLoopmaker.fields.bio,
                twitterUrl: fields.linkedLoopmaker.fields.twitterUrl,
                facebookUrl: fields.linkedLoopmaker.fields.facebookUrl,
                instagramUrl: fields.linkedLoopmaker.fields.instagramUrl,
            } as Loopmaker
            ):  null
        }
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}