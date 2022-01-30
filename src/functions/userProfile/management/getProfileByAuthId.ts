import { getClient } from "../../../contentful/client"
import { mapContentfulUserResponseObjToUserObj } from "../../../helper/user";

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
        const profile = mapContentfulUserResponseObjToUserObj(entry)
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}