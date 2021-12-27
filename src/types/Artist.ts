import Image from "./Image";

type Artist = {
    id: string
    name: string
    viewCount: number
    slug: string
    photo?: Image | null
  }

export default Artist;