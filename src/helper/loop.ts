import Loop from "../types/Loop"
import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapContentfulLoopsResponseToLoopObj = (contentfulLoopResponse: any): Loop[] => {
    return [mapContentfulLoopResponseToLoopObj(contentfulLoopResponse)]
}

export const mapContentfulLoopResponseToLoopObj = (contentfulLoopResponse: any): Loop => {
    const { id } = contentfulLoopResponse.sys;
    const { 
        title, 
        url, 
        releaseDate, 
        isActive, 
        loopmaker, 
        slug, 
        platform, 
        platformTrackId, 
        loopPack
    } = contentfulLoopResponse.fields;

    return {
        id,
        title:title,
        url: url,
        releaseDate: releaseDate,
        isActive: isActive,
        loopmaker: [{
            id: loopmaker[0].sys.id,
            name: loopmaker[0].fields.name,
            slug: loopmaker[0].fields.slug
        }],
        slug: slug,
        platform: {
            id: platform.sys.id,
            name: platform.fields.name,
            trackId: platformTrackId
        },
        loopPack: {
            id: loopPack.sys.id,
            title: loopPack.fields.title,
            slug: loopPack.fields.slug,
            url: "",
            imageUrl: convertContentfulFileUrlToImageUrl(loopPack.fields.artwork?.fields?.file?.url) || "",
            releaseDate: loopPack.fields.releaseDate,
            loopmaker: loopmaker
        }
    }
}