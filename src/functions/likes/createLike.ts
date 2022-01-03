import { DynamoDB } from "aws-sdk";
import {DynamoDBClient, GetItemCommand, PutItemCommand, TransactWriteItemsCommand, paginateScan, BatchWriteItemCommand} from "@aws-sdk/client-dynamodb";
import Like from "../../types/Like";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const client = new DynamoDBClient({ region: "us-west-2"});

export default async function createLike(like: Like): Promise<Like> {
  const currentDateTime = new Date(Date.now()).toISOString()
  like.createdAt = currentDateTime; // Current Unix timestamp  
  like.id = uuidv4();

  const item = await client.send(new GetItemCommand({
    TableName: process.env.LIKES_COUNT_TABLE as string,
    Key: marshall({itemId: like.itemId }),
  }));
  
  if (!item.Item) {
    // initialize count to 0
    await client.send(new PutItemCommand({
      TableName: process.env.LIKES_COUNT_TABLE as string,
      Item: marshall({itemId: like.itemId, count: 0}),
      ConditionExpression: "attribute_not_exists(#pk)",
      ExpressionAttributeNames: {"#pk": "itemId"},
    }));
  }

  // insert new like
const transactionResponse = await client.send(new TransactWriteItemsCommand({
	TransactItems: [
		{
			Put: {
				TableName: process.env.LIKES_TABLE,
				// ConditionExpression: "attribute_not_exists(#iid)",
				// ExpressionAttributeNames: {"#iid": "itemId"},
				Item: marshall(like),
			}
		},
		{
			Update: {
				TableName: process.env.LIKES_COUNT_TABLE,
				UpdateExpression: "ADD #count :count",
				ExpressionAttributeNames: {"#count": "count"},
				ExpressionAttributeValues: marshall({":count": 1}),
				Key: marshall({itemId: like.itemId}),
			}
		}
	]
}));

  
  // const params = {
  //   Item: like as Record<string, unknown>,
  //   TableName: process.env.LIKES_TABLE as string,
  // };

  // await dynamoDb.put(params).promise();

  return like;
}