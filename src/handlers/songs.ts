import listSongs from "../functions/songs/listSongs";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string;
    likeId: string;
    itemId: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<any> {
  switch (event.info.fieldName) {
    case "listSongs":
      return await listSongs();
    default:
      return null;
  }
}