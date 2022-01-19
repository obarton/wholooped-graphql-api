import { getClient } from "../../contentful/client"
import { convertContentfulFileUrlToImageUrl } from "../../helper/image";

const mapArtistItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/artists/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.photo?.fields?.file?.url)
    }
}

const mapSongItem = (item: any) => {
    console.log(`(item.fields as any)?.artist[0]?.fields.slug ${(item.fields as any)?.artist[0]?.fields.slug}`);  

    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        slug: `/artists/${(item.fields as any)?.artist[0]?.fields.slug}/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.album?.fields.artwork.fields.file.url),
    }
}

const mapAlbumItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        thumbnailUrl: convertContentfulFileUrlToImageUrl(item?.fields.artwork.fields.file.url),
    }
}

const mapUserItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/users/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.photo?.fields.file.url)
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
        slug: `/looppacks/${(item.fields as any)?.loopmaker[0]?.fields.slug}/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.artwork.fields?.file?.url)
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
        const client = getClient();
        const response = await client.getEntries({
                "sys.contentType.sys.id[in]": "artist,song,album,loopPack,loopmaker",
                limit: 20})
        
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