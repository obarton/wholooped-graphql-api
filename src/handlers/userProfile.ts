// import getUserProfileById from "../functions/userProfile/getUserProfileById";
// // import updateUserProfile from "../functions/userProfile/updateUserProfile";
// // import UserProfile from "../types/UserProfile";

// type AppSyncEvent = {
//   info: {
//     fieldName: string;
//   };
//   arguments: {
//     userId: string;
//     // userProfile: UserProfile; 
//   };
// };

// export async function handler(
//   event: AppSyncEvent
// ): Promise<any> {
//   switch (event.info.fieldName) {
//     case "getUserProfileById":
//       return await getUserProfileById();
//     default:
//       return null;
//   }
// }