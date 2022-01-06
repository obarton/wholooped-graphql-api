import contentful from 'contentful-management';
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