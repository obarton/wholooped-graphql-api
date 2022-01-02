import createLike from "./functions/likes/createLike";
import Like from "./types/Like";

export async function main(event: any) {
    for (let i = 0; i < event.Records.length; i++) {
        const record = event.Records[i];
        const { interactionType, userId, itemId, likeId } = JSON.parse(record.body)
        const data: Like = {
            userId,
            itemId,
            id: likeId
        }

        const result = await createLike(data)
        console.log(result);
        console.log("Message processed!");
      }

    return {};
  }

  