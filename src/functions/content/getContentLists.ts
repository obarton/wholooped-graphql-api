
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import Artist from "../../types/Artist";
import { mapContentfulArtistResponseObjToArtistObj } from "../../helper/artist";
import { mapContentfulLoopPackResponseObjToLoopPackObj } from "../../helper/loopPacks";
import LoopPack from "../../types/LoopPack";
import { Content } from "../../types/Content";
import Genre from "../../types/Genre";
import { mapContentfulGenreResponseObjToGenreObj } from "../../helper/genre";

export async function main(event: any) {

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

        const genreEntriesResponse = await client.getEntries({
            content_type: 'genre'
        })   

        const genreLists = genreEntriesResponse.items.map((genreResponse : any): Genre | null => {
            return mapContentfulGenreResponseObjToGenreObj(genreResponse)
        }).filter(n => n)

        // const loopEntriesResponse = await client.getEntries({
        //     content_type: 'loop'
        // })   

        // const loopLists = mapContentfulLoopResponseToLoopObj(loopEntriesResponse.items).filter(n => n)

        const songContent = songList.map((s: any) : Content => {
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
                subTitle: loopPack.loopmaker.map(l => l.name).join(", "),
                thumbnailUrl: loopPack.imageUrl as string,
                url: `/looppacks/${(loopPack.loopmaker[0].slug as string)}/${loopPack.slug}`,
                type: "looppack"
            }
        })

        const genreContent = genreLists.map((g: any): Content => {
            const genre = g as Genre;

            return {
                id: genre.id,
                title: genre.name,
                subTitle: "",
                thumbnailUrl: genre.coverImage.url as string,
                url: `/genres/${genre.slug}`,
                type: "genre"
            }
        })

        // const loopContent = loopLists.map((l: any): Content => {
        //     const loop = l as Loop;

        //     return {
        //         id: loop.id,
        //         title: loop.title,
        //         subTitle: loop.loopmaker.map(l => l.name).join(", ");
        //         thumbnailUrl: loop.loopPack?.imageUrl as string,
        //         url: `/loops/`
        //     }
        // })
 
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
            },
            {
                id: "4",
                title: "Genres",
                description: "",
                type: "genre",
                items: genreContent
            }
        ]
    } catch (error) {
        console.error(error);    

        return null;
    }
}