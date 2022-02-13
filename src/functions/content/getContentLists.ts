
import ContentList from "../../types/ContentList";
import { getContentListParameters, getDefaultContentLists } from "../../services/contentListService";

export async function main(event: any): Promise<ContentList[] | null> {

    try {
        //const dynamicContentListParameters = getContentListParameters();

        const defaultContentLists = await getDefaultContentLists();
        
        return defaultContentLists; 
    } catch (error) {
        console.error(error);    

        return null;
    }
}