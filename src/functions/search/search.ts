import { getClient } from "../../contentful/client"

const mapArtistItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/artists/${(item.fields as any)?.slug}`
    }
}

const mapSongItem = (item: any) => {
    console.log(`(item.fields as any)?.artist[0]?.fields.slug ${(item.fields as any)?.artist[0]?.fields.slug}`);  

    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        slug: `/artists/${(item.fields as any)?.artist[0]?.fields.slug}/${(item.fields as any)?.slug}`
    }
}

const mapAlbumItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title
    }
}

const mapUserItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/users/${(item.fields as any)?.slug}`
    }
}

const mapLoopmakerItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        // slug: "/", //`/loopmakers/${(item.fields as any)?.slug}`
    }
}

const mapLoopPackItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        slug: `/looppacks/${(item.fields as any)?.loopmaker[0]?.fields.slug}/${(item.fields as any)?.slug}`
    }
}

const mapProducerItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
    }
}

export async function main(event: any) {

    try {
        const searchText = event.pathParameters.searchText
        const client = getClient();

        const response = await client.getEntries({'query': searchText})

        //console.log(`response ${JSON.stringify(response, null, 2)}`);
        
        
        const searchResponse = {
            totalCount: response.total,
            skip: response.skip,
            limit: response.limit,
            items: response.items.map(item => {
                const type = item.sys.contentType.sys.id
                switch (type) {
                    case "artist":
                        return mapArtistItem(item)   
                    case "song":
                        return mapSongItem(item)
                    case "album":
                        return mapAlbumItem(item)
                    case "user":
                        return mapUserItem(item)   
                    case "loopmaker":
                        return mapLoopmakerItem(item)
                    case "loopPack":
                        return mapLoopPackItem(item)   
                    case "producer":
                        return mapProducerItem(item)            
                    default:
                        break;
                }

            })
        }
        
        return searchResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}