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

async function GetUserProfileData(client: any, userProfileId: string) {
    return await client.getEntry(userProfileId)
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
                        url: album?.fields?.artwork.fields?.file.url
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
                        url: loopPack.fields.artwork.fields.file.url
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
        const userProfileId = event.pathParameters.id;
        const client = await Connect();
        const contributedByResponse = await GetContributedByData(client, userProfileId)
        const mappedContributionsData = await mapContributedByData(client, contributedByResponse)
        const userProfileResponse = await GetUserProfileData(client, userProfileId);
        const mappedUserProfileData = mapUserProfileData(userProfileResponse)

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