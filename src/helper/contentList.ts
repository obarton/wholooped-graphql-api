import { getClient } from "../contentful/client"
import Song from "../types/Song";
import { mapContentfulSongResponseObjToSongObj } from "./song";
import { Content } from "../types/Content";

export async function  getSongContentItems(): Promise<Content[]> {
    const client = getClient();

    const songEntriesResponse = await client.getEntries({
        content_type: 'song',
        limit: 15
      })
      
    const songList = songEntriesResponse.items.map((song: any): Song | null => {
        return mapContentfulSongResponseObjToSongObj(song)
    }).filter(n => n)

    return songList.map((s: any) : Content => {
        const song = s as Song;
        
        return {
            id: song.id,
            title: song.title,
            subTitle: song.artist.map(a => a.name).join(", "),
            thumbnailUrl: song.album.artwork.url as string,
            userIcon: song.primaryContributor.photo?.url as string,
            username: song.primaryContributor.name,
            userDisplayName: song.primaryContributor.displayName,
            userUrl: `/users/${song.primaryContributor.name}`,
            url: `/artists/${song?.artist[0].slug}/${song.slug}`,
            type: "song"
        }
    })
}