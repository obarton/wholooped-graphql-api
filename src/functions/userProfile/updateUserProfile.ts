
// import { getManagementClient } from "../../contentful/managementClient"
// import { convertContentfulFileUrlToImageUrl } from "../../helper/image";
// import UserProfile from "../../types/UserProfile";

// export default async function updateUserProfile(): Promise<UserProfile> {

//     try {
//         const client = getManagementClient();
//         const spaceId = process.env.CONTENTFUL_SPACE_ID || "";
//         const environmentId = process.env.CONTENTFUL_ENV_ID || "";

//        // const userResponse = await client.getEntry("Qj26Gvw2abBqJBhTaQPie");

//         await client.getSpace(spaceId)
//         .then((space) => space.getEnvironment(environmentId))
//         .then((environment) => environment.getEntry("Qj26Gvw2abBqJBhTaQPie")
//         .then((entry) => {
//             console.log(`updating entry ${JSON.stringify(entry)}`);
            
//             entry.fields.name = "userProfile.name";
//             entry.fields.bio = "userProfile.bio";
//             // entry.fields.attributes = 
//             return entry.update()
//         })

//         // const profile : UserProfile = {
//         //     id: userResponse.sys.id,
//         //     authId: (userResponse.fields as any).id,
//         //     name: (userResponse.fields as any).name,
//         //     slug: (userResponse.fields as any).slug,
//         //     photo: {
//         //         id: (userResponse.fields as any).photo.sys.id,
//         //         title: (userResponse.fields as any).photo.fields.title,
//         //         url: convertContentfulFileUrlToImageUrl((userResponse.fields as any).photo.fields.file.url),
//         //     },
//         //     bio: (userResponse.fields as any).bio,
//         //     attributes: (userResponse.fields as any).attributes.map((attribute: any) => {
//         //         return {
//         //             id: attribute.sys.id,
//         //             name: attribute.fields.name
//         //         }
//         //     })
//         // }
        
//         return userProfile;
//     } catch (error) {
//         console.error(error);    

//         return userProfile;
//     }
// }