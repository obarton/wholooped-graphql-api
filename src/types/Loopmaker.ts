import Image from "./Image";

type Loopmaker = {
    id: string
    name: string
    username?: string
    slug: string
    websiteUrl?: string
    profilePhoto?: Image | null
    headerPhoto?: Image | null
    bio?: string
    twitterUrl?: string
    facebookUrl?: string
    instagramUrl?: string
    isFeatured?: boolean
}

export default Loopmaker;