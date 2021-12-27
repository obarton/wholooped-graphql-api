import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function deleteLike(userId: string, itemId: string): Promise<string> {
  const params = {
    Key: { 
      userId,
      itemId 
    },
    TableName: process.env.LIKES_TABLE as string,
  };

  await dynamoDb.delete(params).promise();

  return itemId;
}