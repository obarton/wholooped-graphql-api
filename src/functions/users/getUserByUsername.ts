import contentful from "contentful"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image"
import UserProfile from "../../types/UserProfile"

async function Connect() {
    return await contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: 'master',
      accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string
    })
  }

async function GetContributedByData(client: any, userProfileId: string) {    
    return await client.getEntries({
        content_type: "song",
        "fields.contributedBy.sys.id": userProfileId
    })
}

async function GetUserProfileData(client: any, username: string) {
    return await client.getEntries({
        content_type: "user",
        "fields.name": username
    })
}

async function mapContributedByData(client: any, contributedByResponse: any) {
    const contributedByData = contributedByResponse.items?.map((item: any) => {
            const { id } = item.sys;
            const { title, slug, loop, artist, album } = item.fields;

            return { 
                id,
                title,
                slug,
                album: {
                    title: album?.fields?.title,
                    artwork: {
                        url: convertContentfulFileUrlToImageUrl(album?.fields?.artwork.fields?.file.url)
                    }
                },
                artist: artist.map((a: any) => {
                    const { id } = a.sys;
                    const { name, slug } = a.fields;

                    return {
                        id,
                        name,
                        slug
                    }
                }),
                loop: loop.map((l: any) => {
                    const { id } = l.sys;

                    return {
                        id
                    }
                })
            }
        })
    
    const loopItems: any = [];
    contributedByData?.forEach((contribution: any) => {
        const loopIds = contribution?.loop?.map((l: any) => l.id)
        loopItems.push(...loopIds)
    });
    
    // fetch loop data
    const loopData = await client.getEntries({
        content_type: "loop",
        "sys.id[in]": loopItems.join(",")
    })

    // add loop data to contribution data
    contributedByData?.forEach((c: any) => {
        c.loop = loopData?.items.map((item: any)=> {
            const { id } = item.sys;
            const { title, loopmaker, loopPack } = item.fields;

            return {
                id,
                title,
                loopmaker: loopmaker.map((l: any) => {
                    const { id } = l.sys;
                    const { name, slug } = l.fields;

                    return {
                        id,
                        name,
                        slug,
                    }
                }),
                loopPack: {
                    id: loopPack.sys.id,
                    title: loopPack.fields.title,
                    artwork: {
                        url: convertContentfulFileUrlToImageUrl(loopPack.fields.artwork.fields.file.url)
                    }
                }
            }
            
        });
    }) 

    return contributedByData;
}

const mapUserProfileData = (userProfileResponse: any) => {
    const entry = userProfileResponse;
    const fields = entry.fields;

    const profile : UserProfile = {
        id: entry.sys.id,
        authId: fields.id ? fields.id : "",
        name: fields.name ? fields.name: "",
        displayName: fields.displayName ?? "",
        slug: fields.slug,
        photo: {
            id: fields.photo?.sys.id,
            title: fields.photo?.fields.title,
            url: convertContentfulFileUrlToImageUrl(fields.photo?.fields.file.url)
        },
        bio: fields.bio ? fields.bio: "",
        attributes: fields.attributes ? fields.attributes.map((attribute: any) => {
            return {
                id: attribute.sys.id,
                name: attribute.fields.name
            }
        }): []
    }

    return profile;
}

export async function main(event: any) {
    try {
        const username = event.pathParameters.username;
        const client = await Connect();
        const userProfileResponse = await GetUserProfileData(client, username);
        const userProfile = userProfileResponse.items[0];
        const mappedUserProfileData = mapUserProfileData(userProfile)
        const contributedByResponse = await GetContributedByData(client, mappedUserProfileData.id)
        const mappedContributionsData = await mapContributedByData(client, contributedByResponse)

        const responseObj = { 
            "profile": mappedUserProfileData,
            "contributions": mappedContributionsData
        }
        
        return responseObj
        
    } catch (error) {
        console.error(error);    

        return null;
    }
}