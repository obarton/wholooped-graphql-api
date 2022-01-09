import { getClient } from "../../contentful/client"

export async function main(event: any) {

    try {
        const client = getClient();
        const username = event.pathParameters.username;

        const usersEntriesResponse = await client.getEntries({
            content_type: 'user',
            'fields.name': username?.toLowerCase()
          })
        
        return usersEntriesResponse.total > 0;
    } catch (error) {
        console.error(error);    

        return false;
    }
}