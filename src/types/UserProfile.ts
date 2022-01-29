import Attribute from "./Attribute";
import Image from "./Image";
import Loopmaker from "./Loopmaker";

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
  isLoopmaker: boolean
  linkedLoopmaker?: Loopmaker | null
}

export default UserProfile;