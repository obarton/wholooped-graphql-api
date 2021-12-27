import listArtists from "../functions/artists/listArtists";

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
    case "listArtists":
      return await listArtists();
    default:
      return null;
  }
}