import Attribute from "./Attribute";
import Image from "./Image";

type User = {
  id: string
  name: string
  displayName: string
  slug: string
  photo: Image | null
  attributes?: Attribute[]
}

export default User;