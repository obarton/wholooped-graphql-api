import Loop from "../types/Loop"

export const mapContentfulLoopResponseToLoopObj = (contentfulLoopResponse: any): Loop[] => {
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

    return [{
        id: contentfulLoopResponse.sys.id,
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
            imageUrl: loopPack.fields.file?.url,
            releaseDate: loopPack.fields.releaseDate
        }
    }]
}