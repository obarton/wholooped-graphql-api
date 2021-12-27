import Like from "../types/Like";
import IsLiked from "../types/IsLiked";
import listLikes from "../functions/likes/listLikes";
import createLike from "../functions/likes/createLike";
import updateLike from "../functions/likes/updateLike";
import deleteLike from "../functions/likes/deleteLike";
import getLikeById from "../functions/likes/getLikeById";

type AppSyncEvent = {
  info: {
    fieldName: string;
  };
  arguments: {
    like: Like;
    userId: string;
    likeId: string;
    itemId: string;
  };
};

export async function handler(
  event: AppSyncEvent
): Promise<Record<string, unknown>[] | Like | IsLiked | string | null | undefined> {
  switch (event.info.fieldName) {
    case "listLikes":
      return await listLikes(event.arguments.userId);
    case "createLike":
      return await createLike(event.arguments.like);
    case "updateLike":
      return await updateLike(event.arguments.like);
    case "deleteLike":
      return await deleteLike(event.arguments.userId, event.arguments.itemId);
    case "getLikeById":
      return await getLikeById(event.arguments.userId, event.arguments.itemId);
    default:
      return null;
  }
}