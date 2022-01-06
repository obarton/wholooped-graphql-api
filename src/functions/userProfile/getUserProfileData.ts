import contentful from "contentful"

async function Connect() {
    return await contentful.createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: 'master',
      accessToken: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string
    })
  }

async function QueryEntries(client: any, userProfileId: string) {
    return await client.getEntries({
        content_type: "song",
        "fields.contributedBy.sys.id": userProfileId
    })
}

export async function main(event: any) {
    try {
        const userProfileId = event.pathParameters.id;
        const client = await Connect();
        const entries = await QueryEntries(client, userProfileId)
        const responseObj = { 
            "contributions": entries.items?.map((item: any) => {
                const { id } = item.sys;
                const { title, slug, loop, artist, album } = item.fields;

                return { 
                    id,
                    title,
                    slug,
                    album: {
                        title: album?.fields?.title,
                        artworkUrl: album?.fields?.artwork.fields?.file.url
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
                    loops: loop.map((l: any) => {
                        const { id } = l.sys;

                        return {
                            id
                        }
                    })
                }
            })
        }
        
        const loopItems: any = [];
        responseObj?.contributions.forEach((contribution: any) => {
            const loopIds = contribution?.loops?.map((l: any) => l.id)
            loopItems.push(...loopIds)
        });
        
        // fetch loop data
        const loopData = await client.getEntries({
            content_type: "loop",
            "sys.id[in]": loopItems.join(",")
        })

        // add loop data to contribution data
        responseObj?.contributions?.forEach((c: any) => {
            c.loops = loopData?.items.map((item: any)=> {
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
        
        return responseObj
    } catch (error) {
        console.error(error);    

        return null;
    }
}