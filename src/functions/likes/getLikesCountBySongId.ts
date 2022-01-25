import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export async function main(
    event: any
): Promise<number | undefined> {
  const { itemId }  = event.pathParameters;

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