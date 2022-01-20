// import getContentLists from "../functions/content/getContentLists";
import ContentList from "../types/ContentList";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<ContentList[] | null> {
  switch (event.info.fieldName) {
    // case "getContentLists":
    //   return await getContentLists();
    default:
      return null;
  }
}