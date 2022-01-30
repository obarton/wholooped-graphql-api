import contentful from 'contentful-management';
import LoopmakerProfile from '../../../types/LoopmakerProfile';
import { v4 as uuidv4 } from 'uuid';
import urlSlug from "url-slug"
import CreateLoopmakerProfileRequest from '../../../types/CreateLoopmakerProfileRequest';

async function Connect() {
  const client = await contentful.createClient({
    accessToken: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string
  })

  const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
  return await space.getEnvironment('master');
}

async function CreateLoopmakerProfile(env: any, loopmakerProfileData: LoopmakerProfile ) {
  const entryId = uuidv4();

  const name = { 
    'en-US': loopmakerProfileData.name
  };

  const slug = { 
    'en-US': urlSlug(loopmakerProfileData.name.toLowerCase()) 
  };

  const username = { 
    'en-US': loopmakerProfileData.username.toLowerCase()
  };
  
  const bio = {
      'en-US': loopmakerProfileData.bio
  };

  const websiteUrl = {
    'en-US': loopmakerProfileData.websiteUrl
    };

  const twitterUrl = { 
    'en-US': loopmakerProfileData.twitterUrl
  };

  const facebookUrl = { 
    'en-US': loopmakerProfileData.facebookUrl
  };

  const instagramUrl = { 
    'en-US': loopmakerProfileData.instagramUrl
  };

  const loopmakerEntry: any = {
    fields: {
        name,
        slug,
        username,
        bio,
        websiteUrl,
        twitterUrl,
        facebookUrl,
        instagramUrl
    }
}

  if(loopmakerProfileData.profilePhoto) {
    loopmakerEntry.fields.profilePhoto = {
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
    loopmakerEntry.fields.headerPhoto = {
        'en-US': {
          sys: {    
            type: "Link",
            linkType: "Asset",
            id: loopmakerProfileData.headerPhoto?.id
          }
        }
      }
  }
  else {
    loopmakerEntry.fields.headerPhoto = {
        'en-US': {
          sys: {    
            type: "Link",
            linkType: "Asset",
            id: "1rJhbOLoCnIasT3e32TEJW" //default header image id
          }
        }
      }
  }

  const loopmakerProfile = await env.createEntryWithId('loopmaker', entryId, loopmakerEntry)

  await loopmakerProfile.publish();

  return entryId;
}

async function LinkLoopmakerProfileToUser(env: any, userEntryId: string, loopmakerProfileEntryId: string) {
    let userProfile = await env.getEntry(userEntryId)
  
    userProfile.fields.linkedLoopmaker = { 
      'en-US': {
          sys: {
            type: "Link",
            linkType: "Entry",
            id: loopmakerProfileEntryId
          }
      }
    };
  
    await userProfile.update();
    userProfile = await env.getEntry(userEntryId);
    await userProfile.publish();
  }

export async function main(event: any) {
  try 
    {
      const createLoopmakerProfileRequest: CreateLoopmakerProfileRequest = JSON.parse(event.body)
      const env = await Connect();
      
      const loopmakerProfileEntryId = await CreateLoopmakerProfile(env, createLoopmakerProfileRequest.loopmakerProfile);
      await LinkLoopmakerProfileToUser(env, createLoopmakerProfileRequest.userEntryId, loopmakerProfileEntryId)

      return {
        statusCode: 200,
        body: JSON.stringify({ loopmakerId: loopmakerProfileEntryId }),
      };
    }
    catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error:`${error}`}),
      };
    }
}