import contentful from "contentful"
import { mapContentfulLoopmakerResponseObjToLoopmakerObj } from "../../helper/loopmaker"
import Loopmaker from "../../types/Loopmaker"

async function Connect() {
    return await contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: 'master',
      accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string
    })
  }

async function GetLoopmakerData(client: any, username: string) {
    return await client.getEntries({
        content_type: "loopmaker",
        "fields.username": username
    })
}

const mapLoopmakerData = (loopmakerResponse: any) => {
    return mapContentfulLoopmakerResponseObjToLoopmakerObj(loopmakerResponse);
}

export async function main(event: any): Promise<Loopmaker | null> {
    try {

        const username = event.pathParameters.username;
        console.log(`getLoopmakerByUsername username ${username}`);
        
        const client = await Connect();
        const loopmakerResponse = await GetLoopmakerData(client, username);
        
        const loopmakerResponseItem = loopmakerResponse.items[0];
        const mappedLoopmakerData = mapLoopmakerData(loopmakerResponseItem)

        const responseObj = mappedLoopmakerData;
        console.log(`loopmakerResponse ${JSON.stringify(responseObj, null, 2)}`)
        return responseObj
        
    } catch (error) {
        console.error(error);    

        return null;
    }
}