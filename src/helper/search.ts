import { convertContentfulFileUrlToImageUrl } from "./image";

export const mapArtistItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/artists/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.photo?.fields?.file?.url)
    }
}

export const mapSongItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        slug: `/artists/${(item.fields as any)?.artist[0]?.fields.slug}/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.album?.fields.artwork.fields.file.url),
    }
}

export const mapAlbumItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        thumbnailUrl: convertContentfulFileUrlToImageUrl(item?.fields.artwork.fields.file.url),
    }
}

export const mapUserItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.displayName,
        slug: `/users/${(item.fields as any)?.name}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.photo?.fields.file.url)
    }
}

export const mapLoopmakerItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
        slug: `/loopmakers/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.profilePhoto?.fields.file.url)
    }
}

export const mapLoopPackItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.title,
        slug: `/looppacks/${(item.fields as any)?.loopmaker[0]?.fields.slug}/${(item.fields as any)?.slug}`,
        thumbnailUrl: convertContentfulFileUrlToImageUrl((item.fields as any)?.artwork?.fields?.file?.url)
    }
}

export const mapProducerItem = (item: any) => {
    return {
        id: item.sys.id,
        type: item.sys.contentType.sys.id,
        title: (item.fields as any)?.name,
    }
}
