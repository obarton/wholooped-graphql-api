import contentful from 'contentful-management';
import UserProfile from '../../../types/UserProfile';
import urlSlug from "url-slug"

async function Connect() {
  const client = await contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
  return await space.getEnvironment('master');
}

async function UpdateUserProfile(env: any, userProfileId: string, userProfileData: UserProfile) {
  let userProfile = await env.getEntry(userProfileId)

  userProfile.fields.name = { 
    'en-US': userProfileData.name
  };
  
  userProfile.fields.bio = {
      'en-US': userProfileData.bio
  };

  userProfile.fields.slug = {
    'en-US': urlSlug(userProfileData.name.toLowerCase())
};

  userProfile.fields.displayName = { 
    'en-US': userProfileData.displayName
  };

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

  userProfile.fields.photo = {
    'en-US': {
      sys: {    
        type: "Link",
        linkType: "Asset",
        id: userProfileData.photo?.id
      }
    }
  }

  await userProfile.update();
  userProfile = await env.getEntry(userProfileId);
  await userProfile.publish();
}

export async function main(event: any) {
  try 
    {
      const userProfileData = JSON.parse(event.body)
      const env = await Connect();
      if(userProfileData) {
        userProfileData.slug = urlSlug(userProfileData.name.toLowerCase());
      }
      
      await UpdateUserProfile(env, event.pathParameters.id, userProfileData);

      return {
        statusCode: 200,
        body: JSON.stringify({ profile: userProfileData }),
      };
    }
    catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error:`${error}`}),
      };
    }
}