import getUserProfileById from "../functions/userProfile/getUserProfileById";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    userId: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<any> {
  switch (event.info.fieldName) {
    case "getUserProfileById":
      return await getUserProfileById();
    default:
      return null;
  }
}