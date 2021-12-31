import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function getLikesCountById(
    itemId: string
): Promise<number | undefined> {
  const params = {
    Key: { 
      itemId 
    },
    TableName: process.env.LIKES_COUNT_TABLE as string,
  };

  const { Item } = await dynamoDb.get(params).promise();

  if (!Item) {
      return 0;
  }

  return Item.count;
}