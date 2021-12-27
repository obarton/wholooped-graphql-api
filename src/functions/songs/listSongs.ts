
import Song from "../../types/Song"
import Artist from "../../types/Artist"
import { getClient } from "../../contentful/client"

export default async function listSongs(): Promise<Song[] | null> {

    try {
        const client = getClient();

        const songEntriesResponse = await client.getEntries({
            content_type: 'song'
          })

        const listSongsResponse = songEntriesResponse.items.map((song: any): Song => {
            const { id } = song.sys;
            const { 
                title,
                url,
                loopStartTimeSeconds,
                isActive,
                slug,
                isFeatured,
                artist,
                album
            } = song.fields;
            
            return {
                id,
                title,
                url,
                loopStartTimeSeconds,
                isActive,
                slug,
                isFeatured,
                artist: artist.map((artist: any): Artist => {
                    const { id } = artist.sys;
                    const { name, viewCount, slug } = artist.fields;

                    return {
                        id,
                        name,
                        viewCount,
                        slug
                    }
                }),
                album: {
                    id: album?.sys.id,
                    title: album.fields.title,
                    url: "",
                    artwork: {
                        id: album.fields.artwork.sys.id,
                        url: album.fields.artwork.fields.file.url ? `https:${album.fields.artwork.fields.file.url}` : "",
                        title: album.fields.artwork.fields.title
                    }
                }
            }
        })
        
        return listSongsResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}