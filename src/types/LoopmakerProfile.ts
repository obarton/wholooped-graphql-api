import Image from "./Image";

type LoopmakerProfile = {
  id: string
  name: string
  username: string
  websiteUrl: string
  profilePhoto?: Image | null
  headerPhoto?: Image | null
  bio?: string
  twitterUrl: string
  facebookUrl: string
  instagramUrl: string
}

export default LoopmakerProfile;