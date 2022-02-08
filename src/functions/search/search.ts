import { getClient } from "../../contentful/client"
import { mapArtistItem, 
    mapSongItem, 
    mapAlbumItem, 
    mapUserItem, 
    mapLoopmakerItem, 
    mapLoopPackItem,
    mapProducerItem
} from "../../helper/search";

export async function main(event: any) {

    try {
        const searchText = event.pathParameters.searchText
        const client = getClient();
        const response = await client.getEntries({'query': searchText,
        'sys.contentType.sys.id[nin]': 'album'
    })

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