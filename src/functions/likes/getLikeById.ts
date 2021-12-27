import { DynamoDB } from "aws-sdk";
import IsLiked from "../../types/IsLiked"

const dynamoDb = new DynamoDB.DocumentClient();

export default async function getLikeById(
    userId: string,
    itemId: string
): Promise<IsLiked | undefined> {
  const params = {
    Key: { 
      userId,
      itemId 
    },
    TableName: process.env.LIKES_TABLE as string,
  };

  const { Item } = await dynamoDb.get(params).promise();

  if (!Item) {
      return { isLiked: false }
  }

  return { isLiked: true}
}