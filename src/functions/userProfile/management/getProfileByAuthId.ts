import { getClient } from "../../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../../helper/image";
import UserProfile from "../../../types/UserProfile";

export async function main(event: any) {

    try {
        const client = getClient();
        const authId = decodeURIComponent(event.pathParameters.id);

        console.log(`authId ${authId}`);
        
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
            }): []
        }
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}