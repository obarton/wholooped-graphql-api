import { getClient } from "../../../contentful/client"

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
        
        return usersEntriesResponse.items[0];
    } catch (error) {
        console.error(error);    

        return null;
    }
}