import { DynamoDB } from "aws-sdk";
import Like from "../../types/Like";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function updateLike(like: Like): Promise<Like> {
  const params = {
    Key: { id: like.id },
    ReturnValues: "UPDATED_NEW",
    UpdateExpression: "SET itemId = :itemId",
    TableName: process.env.LIKES_TABLE as string,
    ExpressionAttributeValues: { ":itemId": like.itemId },
  };

  await dynamoDb.update(params).promise();

  return like as Like;
}