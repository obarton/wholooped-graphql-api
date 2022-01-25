import Attribute from "./Attribute";
import Image from "./Image";

type UserProfile = {
  id: string
  authId: string
  name: string
  displayName: string
  slug: string
  photo?: Image | null
  bio?: string
  attributes?: Attribute[]
  isVerified? : boolean
}

export default UserProfile;