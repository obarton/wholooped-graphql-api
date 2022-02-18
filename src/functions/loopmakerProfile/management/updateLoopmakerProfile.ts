import contentful from 'contentful-management';
import LoopmakerProfile from '../../../types/LoopmakerProfile';
import urlSlug from "url-slug"

async function Connect() {
  const client = await contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
  return await space.getEnvironment('master');
}

async function UpdateLoopmakerProfile(env: any, loopmakerProfileId: string, loopmakerProfileData: LoopmakerProfile) {
  let loopmakerProfile = await env.getEntry(loopmakerProfileId)

  loopmakerProfile.fields.name = { 
    'en-US': loopmakerProfileData.name?.trim()
  };

  loopmakerProfile.fields.username = { 
    'en-US': loopmakerProfileData.username.toLowerCase()
  };

  loopmakerProfile.fields.slug = { 
    'en-US': urlSlug(loopmakerProfileData.username.toLowerCase()) 
  };
  
  loopmakerProfile.fields.bio = {
      'en-US': loopmakerProfileData.bio?.trim()
  };

  loopmakerProfile.fields.websiteUrl = {
    'en-US': loopmakerProfileData.websiteUrl?.toLowerCase()
    };

  loopmakerProfile.fields.twitterUrl = { 
    'en-US': loopmakerProfileData.twitterUrl
  };

  loopmakerProfile.fields.facebookUrl = { 
    'en-US': loopmakerProfileData.facebookUrl
  };

  loopmakerProfile.fields.instagramUrl = { 
    'en-US': loopmakerProfileData.instagramUrl
  };

  if(loopmakerProfileData.profilePhoto) {
    loopmakerProfile.fields.profilePhoto = {
        'en-US': {
          sys: {    
            type: "Link",
            linkType: "Asset",
            id: loopmakerProfileData.profilePhoto?.id
          }
        }
      }
  }

  if (loopmakerProfileData.headerPhoto) {
    loopmakerProfile.fields.headerPhoto = {
        'en-US': {
          sys: {    
            type: "Link",
            linkType: "Asset",
            id: loopmakerProfileData.headerPhoto?.id
          }
        }
      }
  }

  await loopmakerProfile.update();
  loopmakerProfile = await env.getEntry(loopmakerProfileId);
  await loopmakerProfile.publish();
}

export async function main(event: any) {
  try 
    {
      const loopmakerProfileData = JSON.parse(event.body)
      const env = await Connect();
      if(loopmakerProfileData) {
        loopmakerProfileData.slug = urlSlug(loopmakerProfileData.username.toLowerCase())
      }

      await UpdateLoopmakerProfile(env, event.pathParameters.id, loopmakerProfileData);

      return {
        statusCode: 200,
        body: JSON.stringify({ loopmakerProfileData: loopmakerProfileData }),
      };
    }
    catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error:`${error}`}),
      };
    }
}