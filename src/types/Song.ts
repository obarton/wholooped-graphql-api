import Artist from "./Artist"

type Song = {
    id: string
    title: string
    url: string
    loopStartTimeSeconds: number
    isActive: boolean
    slug: string
    isFeatured: boolean
    artist: Artist[]
}

export default Song;