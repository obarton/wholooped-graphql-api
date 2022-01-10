import { getClient } from "../../../contentful/client"
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
            authId: fields.id ? fields.id['en-US'] : "",
            name: fields.name ? fields.name['en-US']: "",
            slug: fields.slug,
            photo: null,
            bio: fields.bio ? fields.bio['en-US'] : "",
            attributes: fields.attributes ? fields.attributes['en-US'].map((attribute: any) => {
                return {
                    id: attribute.sys.id,
                }
            }): []
        }
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}