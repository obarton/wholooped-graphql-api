import contentful from "contentful"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song"
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
        "fields.primaryContributor.sys.id": userProfileId
    })
}

async function GetUserProfileData(client: any, username: string) {
    return await client.getEntries({
        content_type: "user",
        "fields.name": username
    })
}

async function GetLoopmakerReference(client: any, userProfileId: string) {
    return await client.getEntries({
        content_type: "loopmaker",
        "fields.user.sys.id": userProfileId
    })
}

async function GetLoopsByLoopmaker(client: any, loopmakerId: string) {    
    return await client.getEntries({
        content_type: "loop",
        "fields.loopmaker.sys.id": loopmakerId
    })
}

async function GetSongsUsingLoopIds(client: any, loopIds: string[]) {    
    return await client.getEntries({
        content_type: "song",
        "fields.loop.sys.id[in]": `${loopIds.join(",")}`
    })
}

async function mapSongResponseDataSongObj(client: any, songResponseData: any) {

    const songObjData = songResponseData?.items?.map((songResponse: any) => mapContentfulSongResponseObjToSongObj(songResponse))
    
    const loopItems: any = [];
    songObjData?.forEach((songItem: any) => {
        const loopIds = songItem?.loop?.map((l: any) => l.id)
        loopItems.push(...loopIds)
    });
    
    // fetch loop data
    const loopData = await client.getEntries({
        content_type: "loop",
        "sys.id[in]": loopItems.join(",")
    })

    // add loop data to contribution data
    songObjData?.forEach((c: any) => {
        c.loop =  loopData?.items?.filter((loopDataItem: any) => loopDataItem.sys.id == c.loop[0].id).map((item: any)=> {
            const { id } = item.sys;
            const { title, loopmaker, loopPack } = item?.fields;

            return {
                id,
                title,
                loopmaker: loopmaker.map((l: any) => {
                    const { id } = l.sys;
                    const { name, slug } = l?.fields;

                    return {
                        id,
                        name,
                        slug,
                    }
                }),
                loopPack: {
                    id: loopPack?.sys.id,
                    title: loopPack?.fields?.title,
                    artwork: {
                        url: convertContentfulFileUrlToImageUrl(loopPack?.fields?.artwork?.fields?.file.url)
                    }
                }
            }
            
        });
    }) 

    return songObjData;
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
        }): [],
        isVerified: fields.isVerified ? fields.isVerified : false
    }

    return profile;
}

export async function main(event: any) {
    try {
        let songsLinkedToUser: any[] = [];
        let songsContributedByUser: any[] = [];

        const username = event.pathParameters.username;
        const client = await Connect();
        const userProfileResponse = await GetUserProfileData(client, username);
        const userProfile = userProfileResponse.items[0];
        const mappedUserProfileData = mapUserProfileData(userProfile)
        const contributedByResponse = await GetContributedByData(client, mappedUserProfileData.id)
        const mappedContributionsData = await mapSongResponseDataSongObj(client, contributedByResponse)
        songsContributedByUser = mappedContributionsData;

        if (mappedUserProfileData.attributes?.map(a => a.name.toLocaleLowerCase()).includes("loopmaker")) {
            const loopmakerProfileResponse = await GetLoopmakerReference(client, mappedUserProfileData.id)
            const loopmakerId = loopmakerProfileResponse?.items[0].sys.id;
            const getLoopsByLoopmakerResponse = await GetLoopsByLoopmaker(client, loopmakerId);
            const loopIdsByLoopmaker = getLoopsByLoopmakerResponse?.items?.map((item: any) => item.sys.id)
            const songsFromLoopIds = await GetSongsUsingLoopIds(client, loopIdsByLoopmaker)
            const mappedLoopmakerSongsData = await mapSongResponseDataSongObj(client, songsFromLoopIds)
            songsLinkedToUser = mappedLoopmakerSongsData;
        }


        const responseObj = { 
            "profile": mappedUserProfileData,
            "contributions": songsContributedByUser,
            "songs": songsLinkedToUser
        }
        
        return responseObj
        
    } catch (error) {
        console.error(error);    

        return null;
    }
}