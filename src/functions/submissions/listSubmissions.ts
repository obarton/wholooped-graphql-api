import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function listSubmissions(userId: string): Promise<
  Record<string, unknown>[] | undefined
> {
  const params = {
    TableName: process.env.SUBMISSIONS_TABLE as string,
    KeyConditionExpression: "userId = :userId",
    // 'ExpressionAttributeValues' defines the value in the condition
    // - ':userId': defines 'userId' to be the id of the author
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const data = await dynamoDb.query(params).promise();

  return data.Items;
}