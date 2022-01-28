import contentful from 'contentful-management';
import LoopmakerProfile from '../../../types/LoopmakerProfile';

async function Connect() {
  const client = await contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
  return await space.getEnvironment('master');
}

async function UpdateLoopmakerProfile(env: any, loopmakerProfileId: string, loopmakerProfileData: LoopmakerProfile) {
    // console.log(`loopmakerProfileData ${JSON.stringify(loopmakerProfileData, null, 2)}`)
  let loopmakerProfile = await env.getEntry(loopmakerProfileId)

  loopmakerProfile.fields.name = { 
    'en-US': loopmakerProfileData.name
  };

  loopmakerProfile.fields.username = { 
    'en-US': loopmakerProfileData.username.toLowerCase()
  };
  
  loopmakerProfile.fields.bio = {
      'en-US': loopmakerProfileData.bio
  };

  loopmakerProfile.fields.websiteUrl = {
    'en-US': loopmakerProfileData.websiteUrl
    };

  loopmakerProfile.fields.twitterUrl = { 
    'en-US': loopmakerProfileData.twitterUrl
  };

  loopmakerProfile.fields.facebookUrl = { 
    'en-US': loopmakerProfileData.facebookUrl
  };

  if(loopmakerProfileData.profilePhoto) {
    loopmakerProfile.fields.photo = {
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