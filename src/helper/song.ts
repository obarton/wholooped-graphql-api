import Artist from "../types/Artist";
import Loop from "../types/Loop";
import Loopmaker from "../types/Loopmaker";
import Producer from "../types/Producer";
import Song from "../types/Song";
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulSongResponseObjToSongObj = (contentfulSongResponseObj: any): Song | null=> {
    try {
    const { id } = contentfulSongResponseObj.sys;
    const {
        producer,
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
        likesCount: 0,
        isLiked: true,
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
                        name: loopmaker?.fields?.name,
                        slug: loopmaker?.fields?.slug
                    }
                }),
                platform: {
                    id: platform?.sys.id,
                    name: platform?.fields?.name,
                    trackId: platformTrackId
                },
                loopPack: null
            }
        }),
        loopmaker: [],
        producer: producer?.map((producer:any): Producer => {
            return {
                id: producer?.sys.id,
                name: producer?.fields?.name
            }
        })
    } 
    return songObj; 
    }
    
    catch (error) {
        console.log(`error when mapping contentfulSongResponse ${JSON.stringify(contentfulSongResponseObj, null, 2)} - ${JSON.stringify(error, null, 2)}`);                
        return null;
    }
}