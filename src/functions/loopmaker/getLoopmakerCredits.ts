import contentful from "contentful"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song"

async function Connect() {
    return await contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: 'master',
      accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string
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


export async function main(event: any) {
    try {
        let loopmakerCredits: any[] = [];

        const loopmakerId = event.pathParameters.id;
        const client = await Connect()

        const getLoopsByLoopmakerResponse = await GetLoopsByLoopmaker(client, loopmakerId);
        const loopIdsByLoopmaker = getLoopsByLoopmakerResponse?.items?.map((item: any) => item.sys.id)
        const songsFromLoopIds = await GetSongsUsingLoopIds(client, loopIdsByLoopmaker)
        const mappedLoopmakerSongsData = await mapSongResponseDataSongObj(client, songsFromLoopIds)
        loopmakerCredits = mappedLoopmakerSongsData;
        
        return loopmakerCredits;
        
    } catch (error) {
        console.error(error);    

        return null;
    }
}