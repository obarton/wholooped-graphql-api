import contentful from 'contentful-management';
import { convertContentfulFileUrlToImageUrl } from '../../../helper/image';
import UserProfile from "../../../types/UserProfile"

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
        
        const profile : UserProfile = {
            id: entry.sys.id,
            authId: (entry.fields as any).id['en-US'],
            name: (entry.fields as any).name['en-US'],
            slug: (entry.fields as any).slug,
            photo: null,
            bio: (entry.fields as any).bio['en-US'],
            attributes: (entry.fields as any).attributes['en-US'].map((attribute: any) => {
                return {
                    id: attribute.sys.id,
                }
            })
        }
        
        return profile;
    } catch (error) {
        console.error(error);    

        return null;
    }
}