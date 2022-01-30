import contentful from 'contentful-management';
import { mapContentfulUserResponseObjToUserObj } from '../../../helper/user';

async function Connect() {
    const client = await contentful.createClient({
      accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
    })
  
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
    return await space.getEnvironment('master');
  }

  async function GetUserProfile(env: any, userProfileId: string) {
    return await env.getEntry(userProfileId)
  }

export async function main(event: any) {
    try {
        const userProfileId = event.pathParameters.id;
        const env = await Connect();
        const entry = await GetUserProfile(env, userProfileId)

        const profile = mapContentfulUserResponseObjToUserObj(entry)
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}