import listGenres from "../functions/genres/listGenres";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<any> {
  switch (event.info.fieldName) {
    case "listGenres":
      return await listGenres();
    default:
      return null;
  }
}