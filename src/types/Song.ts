import Artist from "./Artist"
import Album from "./Album"

type Song = {
    id: string
    title: string
    url: string
    loopStartTimeSeconds: number
    isActive: boolean
    slug: string
    isFeatured: boolean
    artist: Artist[]
    album: Album
}

export default Song;