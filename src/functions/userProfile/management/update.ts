import contentful from 'contentful-management';
import UserProfile from '../../../types/UserProfile';

async function Connect() {
  const client = await contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
  return await space.getEnvironment('master');
}

async function UpdateUserProfile(env: any, userProfileId: string, userProfileData: UserProfile) {
  let userProfile = await env.getEntry(userProfileId)
  // console.log(`${JSON.stringify(userProfile, null, 2)}`)
  // console.log(`${JSON.stringify(userProfileData, null, 2)}`)

  userProfile.fields.name['en-US'] = userProfileData.name;
  userProfile.fields.bio['en-US'] = userProfileData.bio;
  userProfile.fields.attributes = { 
    'en-US': userProfileData.attributes?.map(attribute => {
      return {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: attribute.id
        }
      }
    })
  };

  await userProfile.update();
  userProfile = await env.getEntry(userProfileId);
  await userProfile.publish();
}

export async function main(event: any) {
  try 
    {
      const userProfileData = JSON.parse(event.body)
      const env = await Connect();
      await UpdateUserProfile(env, event.pathParameters.id, userProfileData);

      return {
        statusCode: 200,
        body: JSON.stringify({ status: "successful" }),
      };
    }
    catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error:`${error}`}),
      };
    }
}