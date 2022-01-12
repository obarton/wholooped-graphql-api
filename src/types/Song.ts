import Artist from "./Artist"
import Album from "./Album"
import Loop from "./Loop"
import Platform from "./Platform"
import Loopmaker from "./Loopmaker"
import Producer from "./Producer"
import User from "./User"

type Song = {
    id: string
    title: string
    url: string
    loopStartTimeSeconds: number
    isActive: boolean
    slug: string
    isFeatured: boolean
    platform: Platform
    artist: Artist[]
    album: Album
    loop: Loop[]
    loopmaker: Loopmaker[]
    producer: Producer[]
    likesCount?: number
    isLiked?: boolean
    primaryContributor: User
}

export default Song;