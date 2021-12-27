import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function listLikes(
  userId: string
): Promise<
  Record<string, unknown>[] | undefined
> {
  const params = {
    TableName: process.env.LIKES_TABLE as string,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const data = await dynamoDb.query(params).promise();

  return data.Items;
}