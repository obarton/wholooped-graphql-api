import listLoopPacks from "../functions/loopPacks/listLoopPacks";

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
    case "listLoopPacks":
      return await listLoopPacks();
    default:
      return null;
  }
}