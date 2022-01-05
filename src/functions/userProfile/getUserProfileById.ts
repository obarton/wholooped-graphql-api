
// import { getClient } from "../../contentful/client"
// import { convertContentfulFileUrlToImageUrl } from "../../helper/image";
// import UserProfile from "../../types/UserProfile";

// export default async function getUserProfileById(): Promise<UserProfile | null> {

//     try {
//         const client = getClient();

//         const userResponse = await client.getEntry("Qj26Gvw2abBqJBhTaQPie")

//         const profile : UserProfile = {
//             id: userResponse.sys.id,
//             authId: (userResponse.fields as any).id,
//             name: (userResponse.fields as any).name,
//             slug: (userResponse.fields as any).slug,
//             photo: {
//                 id: (userResponse.fields as any).photo.sys.id,
//                 title: (userResponse.fields as any).photo.fields.title,
//                 url: convertContentfulFileUrlToImageUrl((userResponse.fields as any).photo.fields.file.url),
//             },
//             bio: (userResponse.fields as any).bio,
//             attributes: (userResponse.fields as any).attributes.map((attribute: any) => {
//                 return {
//                     id: attribute.sys.id,
//                     name: attribute.fields.name
//                 }
//             })
//         }
        
//         return profile;
//     } catch (error) {
//         console.error(error);    

//         return null;
//     }
// }