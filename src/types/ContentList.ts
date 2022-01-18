import { Content } from "./Content"

type ContentList = {
    id: string
    title: string
    description: string
    type: string
    items: Content[]
}

export default ContentList;