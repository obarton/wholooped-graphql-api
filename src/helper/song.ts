import Artist from "../types/Artist";
import Loop from "../types/Loop";
import Loopmaker from "../types/Loopmaker";
import Song from "../types/Song";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulSongResponseObjToSongObj = (contentfulSongResponseObj: any): Song => {
    const { id } = contentfulSongResponseObj.sys;
    const {
        platformTrackId,
        platform, 
        title,
        url,
        loopStartTimeSeconds,
        isActive,
        slug,
        isFeatured,
        artist,
        album,
        loop
    } = contentfulSongResponseObj.fields;
        
    const songObj: Song = {
        id,
        title,
        url,
        loopStartTimeSeconds: 0,
        isActive,
        slug,
        isFeatured: false,
        platform: {
            id: platform?.sys.id,
            name: platform?.fields?.name,
            trackId: platformTrackId
        },
        artist: artist?.map((artist: any): Artist => {
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
            title: album?.fields.title,
            url: "",
            artwork: {
                id: album?.fields.artwork.sys.id,
                url: convertContentfulFileUrlToImageUrl(album?.fields.artwork.fields.file.url),
                title: album?.fields.artwork.fields.title
            }
        },
        loop: loop?.map((loop: any): Loop => {
            const { id } = loop.sys;
            const { title, url, releaseDate, isActive, loopmaker, slug, platform} = loop.fields;
    

            return {
                id,
                title,
                url,
                releaseDate,
                isActive,
                slug,
                loopmaker: loopmaker?.map((loopmaker: any): Loopmaker => {
                    return {
                        id: loopmaker?.sys.id,
                        name: loopmaker?.fields?.name
                    }
                }),
                platform: {
                    id: platform?.sys.id,
                    name: platform?.fields?.name,
                    trackId: platformTrackId
                },
            }
        }),
        loopmaker: []
    }  

    return songObj;
}