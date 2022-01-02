import sendInteraction from "../functions/interactions/sendInteraction";
import Interaction from "../types/Interaction";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    interaction: Interaction
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<any> {
  switch (event.info.fieldName) {
    case "sendInteraction":
      return await sendInteraction(event.arguments.interaction);
    default:
      return null;
  }
}