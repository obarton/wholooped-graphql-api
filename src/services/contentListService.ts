import { getClient } from "../contentful/client"
import Song from "../types/Song";
import { mapContentfulSongResponseObjToSongObj } from "../helper/song";
import { Content } from "../types/Content";
import ContentList from "../types/ContentList";
import Artist from "../types/Artist";
import { mapContentfulArtistResponseObjToArtistObj } from "../helper/artist";
import { mapContentfulLoopPackResponseObjToLoopPackObj } from "../helper/loopPacks";
import LoopPack from "../types/LoopPack";
import { mapContentfulLoopmakerResponseObjToLoopmakerObj } from "../helper/loopmaker";
import Loopmaker from "../types/Loopmaker";
import { mapContentfulGenreResponseObjToGenreObj } from "../helper/genre";
import Genre from "../types/Genre";
import { mapContentfulLoopResponseToLoopObj } from "../helper/loop";
import Loop from "../types/Loop";
import { DEFAULT_IMG_URL } from "../helper/image";

const client = getClient();

export async function  getContentListParameters(): Promise<any> {
    const contentListParametersResponse = await client.getEntries({
        content_type: 'contentList',
        limit: 15
      })
      
    const contentListParameters = contentListParametersResponse.items.map((item: any): any => {

        const { id } = item.sys;
        const { title, type, listParameters } = item.fields;
        return {
            id,
            title, 
            type,
            listParameters
        }
    }).filter(n => n) 
    
    console.log(`contentListParameters ${JSON.stringify(contentListParameters, null, 2)}`);

    return contentListParametersResponse;
}

export async function  getSongContentItems(): Promise<Content[]> {
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

export async function  getArtistContentItems(): Promise<Content[]> {
    const artistEntriesResponse = await client.getEntries({
        content_type: 'artist',
        limit: 15
      })

    const artistLists = artistEntriesResponse.items.map((artistResponse : any): Artist | null => {
        return mapContentfulArtistResponseObjToArtistObj(artistResponse)
    }).filter(n => n)

    return artistLists.map((a: any) : Content => {
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
}

export async function  getLoopPackContentItems(): Promise<Content[]> {
    const loopPackEntriesResponse = await client.getEntries({
        content_type: 'loopPack',
        limit: 15
    })
    
    const loopPackLists = loopPackEntriesResponse.items.map((loopPackResponse : any): LoopPack | null => {
        return mapContentfulLoopPackResponseObjToLoopPackObj(loopPackResponse)
    }).filter(n => n).filter(l => l?.imageUrl !== DEFAULT_IMG_URL)

    return loopPackLists.map((l: any) : Content => {
        const loopPack = l as LoopPack;

        return {
            id: loopPack.id,
            title: loopPack.title,
            subTitle: loopPack.loopmaker.map(l => l.name).join(", "),
            thumbnailUrl: loopPack.imageUrl as string,
            url: `/loopmakers/${(loopPack.loopmaker[0].slug as string)}/packs/${loopPack.slug}`,
            type: "looppack"
        }
    })
}

export async function  getLoopmakerContentItems(): Promise<Content[]> {
    const loopMakerEntriesResponse = await client.getEntries({
        content_type: 'loopmaker',
        "fields.isFeatured": true,
        limit: 15
    })   

    const loopmakerFilter = (loopmaker: any) => {
        return loopmaker.profilePhoto?.url !== null && loopmaker.id !== "2a356d22-645b-4eee-babf-edf4d6797d09"
    }

    const loopmakerLists = loopMakerEntriesResponse.items.map((loopmakerResponse : any): Loopmaker | null => {
        return mapContentfulLoopmakerResponseObjToLoopmakerObj(loopmakerResponse)
    }).filter(n => n)

    return loopmakerLists.filter((l: any) => loopmakerFilter(l)).map((l: any) : Content => {
        const loopmaker = l as Loopmaker;

        return {
            id: loopmaker.id,
            title: loopmaker.name,
            subTitle: "",
            thumbnailUrl: loopmaker.profilePhoto?.url as string,
            url: `/loopmakers/${loopmaker.slug}`,
            type: "loopmaker"
        }
    })
}

export async function  getGenreContentItems(): Promise<Content[]> {
    const genreEntriesResponse = await client.getEntries({
        content_type: 'genre',
        //order: 'sys.fields.name',
        limit: 15
    })   

    const genreLists = genreEntriesResponse.items.map((genreResponse : any): Genre | null => {
        return mapContentfulGenreResponseObjToGenreObj(genreResponse)
    }).filter(n => n)


    return genreLists.map((g: any): Content => {
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

}

export async function  getLoopContentItems(): Promise<Content[]> {
    const loopEntriesResponse = await client.getEntries({
        content_type: 'loop',
        'metadata.tags.sys.id[all]': "acousticGuitar",
        limit: 15
    })   

    const loopLists = loopEntriesResponse.items.map((loopResponse : any): Loop | null => {
        return mapContentfulLoopResponseToLoopObj(loopResponse)
    }).filter(n => n)

    return loopLists.map((l: any): Content => {
        const loop = l as Loop;

        return {
            id: loop.id,
            title: loop.title,
            subTitle: loop.loopmaker.map((l: any) => l.name).join(", "),
            thumbnailUrl: loop.loopPack?.imageUrl as string,
            url: `/loopmakers/${loop.loopmaker[0].slug}/${loop.slug}`,
            type: "loop"
        }
    })
}

export async function  getDynamicLoopContentContentItems(): Promise<Content[]> {
    const loopEntriesResponse = await client.getEntries({
        content_type: 'loop',
        'metadata.tags.sys.id[all]': "vintage",
        limit: 15
    })   

    const loopLists = loopEntriesResponse.items.map((loopResponse : any): Loop | null => {
        return mapContentfulLoopResponseToLoopObj(loopResponse)
    }).filter(n => n)

    return loopLists.map((l: any): Content => {
        const loop = l as Loop;

        return {
            id: loop.id,
            title: loop.title,
            subTitle: loop.loopmaker.map((l: any) => l.name).join(", "),
            thumbnailUrl: loop.loopPack?.imageUrl as string,
            url: `/loopmakers/${loop.loopmaker[0].slug}/${loop.slug}`,
            type: "loop"
        }
    })
}

export async function getDefaultContentLists(): Promise<ContentList[]> {
    const songContentItems = await getSongContentItems();
    const artistContentItems = await getArtistContentItems();
    const loopPackContentItems = await getLoopPackContentItems();
    const loopmakerContentItems = await getLoopmakerContentItems();
    const genreContentItems = await getGenreContentItems();
    //const loopContentItems = await getLoopContentItems();
    const dynamicContentItems = await getDynamicLoopContentContentItems();

    const songContentList = {
        id: "1",
        title: "Added This Week",
        description: "This week's latest uploads",
        type: "song",
        items: songContentItems
    }

    const loopPackContentList = {
        id: "2",
        title: "Trending Loop Packs",
        description: "Popular loop packs on Who Looped",
        type: "looppack",
        items: loopPackContentItems,
        showMoreLink: "/packs"
    }

    const loopContentList = {
        id: "3",
        title: "Vintage Sounds",
        description: "Loops with warmth and textures reminiscent of classic analog hardware",
        type: "loop",
        items: dynamicContentItems
        //showMoreLink: "/looppacks"
    }

    const artistContentList = {
        id: "4",
        title: "Trending Artists",
        description: "Popular artists on Who Looped",
        type: "artist",
        items: artistContentItems,
        showMoreLink: "/artists"
    }

    const loopmakerContentList = {
        id: "5",
        title: "Featured Loop Makers",
        description: "A few of our favorite loop makers",
        type: "loopmaker",
        items: loopmakerContentItems
    }

    const genreContentList = {
        id: "6",
        title: "Genres",
        description: "Explore loops by genre",
        type: "genre",
        items: genreContentItems
    }
    

    return [
        songContentList,
        loopContentList,
        loopPackContentList,
        artistContentList,
        loopmakerContentList,
        genreContentList
    ]
}