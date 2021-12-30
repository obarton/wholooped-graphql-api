import LoopPack from "./LoopPack";
import Platform from "./Platform";

type Loop = {
    id: string
    title: string
    url: string
    releaseDate: string
    isActive: boolean
    loopmaker: any
    slug: string
    platform: Platform
    loopPack: LoopPack
}

export default Loop;