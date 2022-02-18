
import Song from "../../types/Song"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { mapContentfulLoopsResponseToLoopObj } from "../../helper/loop";
import getLikesCountById from "../likes/getLikesCountById";

export default async function querySongByArtist(artistSlug: string, songSlug: string): Promise<any | null> {
    try {
        const client = getClient();
        const querySongEntriesResponse = await client.getEntries({
            content_type: 'song',
            'fields.slug': songSlug
        })

        const title = (querySongEntriesResponse.items[0].fields as any).title;
        const nextSongEntriesResponse = await client.getEntries({
            content_type: 'song',
            order: "fields.title",
            'fields.title[gt]': title,
            limit: "1"
        })

        const lastSongEntriesResponse = await client.getEntries({
            content_type: 'song',
            order: "-fields.title",
            'fields.title[lt]': title,
            limit: "1"
        })

        // nextSongEntriesResponse.items.map((i: any, index: number) => {
        //     console.log(`next song created at ${index} ${i.sys.createdAt}`)
        //     console.log(`next song title ${index} ${i.fields.title}`)  
        // })

        // lastSongEntriesResponse.items.map((i: any, index: number) => {
        //     console.log(`last song created at ${index} ${i.sys.createdAt}`)
        //     console.log(`last song title ${index} ${i.fields.title}`)  
        // })
        
        const lastSong = lastSongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })[0]

        const nextSong = nextSongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })[0]

        const songResults = querySongEntriesResponse.items.map((songDataResponse: any): Song | null => {
            return mapContentfulSongResponseObjToSongObj(songDataResponse)
        })
        
        const song = songResults.filter((song: Song | null) => {
            if (song) {
                return song.artist[0].slug == artistSlug
            }
        })[0] || null; 

        if (song == null) {
            return song;
        }

        const loopId = song.loop[0].id as string;
        
        if (loopId) {
            const loopResponse = await client.getEntry(loopId);
            song.loop = mapContentfulLoopsResponseToLoopObj(loopResponse);
        }

        const itemId = `${song?.id}:${loopId}`;
        const likesCountResponse = await getLikesCountById(itemId)
        song.likesCount = likesCountResponse;

        return {
            song,
            nextSong,
            lastSong
        }

    } catch (error) {
        console.error(error);    

        return null;
    }
}