
import Genre from "../../types/Genre"
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import { convertContentfulFileUrlToImageUrl } from "../../helper/image";

export default async function listGenres(): Promise<Genre[] | null> {

    try {
        const client = getClient();

        const genreEntriesResponse = await client.getEntries({
            content_type: 'genre'
          })
          
        const listGenresResponse = genreEntriesResponse.items.map((genre: any): Genre => {
            const { id } = genre.sys
            const { name, coverImage, slug } = genre.fields

            

            return {
                id,
                name,
                slug,
                coverImage: {
                    id: coverImage?.sys.id,
                    title: coverImage?.fields?.title,
                    url: convertContentfulFileUrlToImageUrl(coverImage?.fields?.file?.url)
                }
            }
        })

        console.log(`listGenresResponse ${JSON.stringify(listGenresResponse, null, 2)}`);
        
        return listGenresResponse;
    } catch (error) {
        console.error(error);    

        return null;
    }
}