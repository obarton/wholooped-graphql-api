import Loopmaker from "./Loopmaker"

type LoopPack = {
    id: string
    title: string
    releaseDate: string
    url: string
    slug: string
    imageUrl: string | null
    loopmaker: Loopmaker[]
}

export default LoopPack;