
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import Artist from "../../types/Artist";
import { mapContentfulArtistResponseObjToArtistObj } from "../../helper/artist";
import { mapContentfulLoopPackResponseObjToLoopPackObj } from "../../helper/loopPacks";
import LoopPack from "../../types/LoopPack";
import ContentList from "../../types/ContentList";
import { Content } from "../../types/Content";

export default async function getContentLists(): Promise<ContentList[] | null> {

    try {
        const client = getClient();

        const songEntriesResponse = await client.getEntries({
            content_type: 'song'
          })
          
        const songList = songEntriesResponse.items.map((song: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(song)
        }).filter(n => n)

        const artistEntriesResponse = await client.getEntries({
            content_type: 'artist'
          })

        const artistLists = artistEntriesResponse.items.map((artistResponse : any): Artist | null => {
            return mapContentfulArtistResponseObjToArtistObj(artistResponse)
        }).filter(n => n)

        const loopPackEntriesResponse = await client.getEntries({
            content_type: 'loopPack'
        })   

        const loopPackLists = loopPackEntriesResponse.items.map((loopPackResponse : any): LoopPack | null => {
            return mapContentfulLoopPackResponseObjToLoopPackObj(loopPackResponse)
        }).filter(n => n)

        const songContent = songList.map((s: any) : Content => {
            const song = s as Song;
            console.log(`songContent song ${JSON.stringify(song, null, 2)}`);
            
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

        const artistContent = artistLists.map((a: any) : Content => {
            const artist = a as Artist;

            return {
                id: artist.id,
                title: artist.name,
                subTitle: "",
                thumbnailUrl: artist.photo?.url as string,
                url: `/artists/${artist.slug}`,
                type: "artist"
            }
        })

        const loopPackContent = loopPackLists.map((l: any) : Content => {
            const loopPack = l as LoopPack;

            return {
                id: loopPack.id,
                title: loopPack.title,
                subTitle: "",
                thumbnailUrl: loopPack.imageUrl as string,
                url: `/looppacks/${(loopPack.loopmaker[0].slug as string)}/${loopPack.slug}`,
                type: "looppack"
            }
        })
 
        return [
            {
                id: "1",
                title: "Recently Added",
                description: "Popular artists on Who Looped",
                type: "song",
                items: songContent
            },
            {
                id: "2",
                title: "Trending Loop Packs",
                description: "Popular loop packs on Who Looped",
                type: "looppack",
                items: loopPackContent
            },
            {
                id: "3",
                title: "Trending Artists",
                description: "Popular artists on Who Looped",
                type: "artist",
                items: artistContent
            }
        ]
    } catch (error) {
        console.error(error);    

        return null;
    }
}