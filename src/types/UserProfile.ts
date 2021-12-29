import Attribute from "./Attribute";
import Image from "./Image";

type UserProfile = {
    id: string
    authId: string
    name: string
    slug: string
    photo?: Image | null
    bio?: string
    attributes?: Attribute[]
  }

export default UserProfile;