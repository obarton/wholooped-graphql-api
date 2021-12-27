import { DynamoDB } from "aws-sdk";
import Like from "../../types/Like";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function createLike(like: Like): Promise<Like> {
  const currentDateTime = new Date(Date.now()).toISOString()
  like.createdAt = currentDateTime; // Current Unix timestamp  
  
  const params = {
    Item: like as Record<string, unknown>,
    TableName: process.env.LIKES_TABLE as string,
  };

  await dynamoDb.put(params).promise();

  return like;
}