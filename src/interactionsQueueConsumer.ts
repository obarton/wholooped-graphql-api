import Like from "./types/Like";
import {DynamoDBClient, GetItemCommand, PutItemCommand, TransactWriteItemsCommand} from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({ region: "us-west-2"});
const LIKES_COUNT_TABLE = "dev-wholooped-graphql-appsync-LikesCount"
const LIKES_TABLE = "dev-wholooped-graphql-appsync-Likes"

export async function main(event: any) {
    for (let i = 0; i < event.Records.length; i++) {
        const record = event.Records[i];
        const { interactionType, data } = JSON.parse(record.body)

        if (data) {
            switch (interactionType) {
                case "LIKE":
                    await addLike(data)
                    break;
                case "UNLIKE":
                    await removeLike(data)
                    break;        
                default:
                    break;
            }
        }

        console.log(`Message processed! - ${interactionType}`);
      }

    return {};
  }

  const addLike = async (data: any) => {
    const likeData: Like = {
        userId: data?.userId,
        itemId: data?.itemId,
        id: uuidv4()
    }

    const currentDateTime = new Date(Date.now()).toISOString()
    likeData.createdAt = currentDateTime; // Current Unix timestamp  

    const item = await client.send(new GetItemCommand({
        TableName: LIKES_COUNT_TABLE,
        Key: marshall({itemId: likeData.itemId }),
    }));
    
    if (!item.Item) {
        // initialize count to 0
        await client.send(new PutItemCommand({
        TableName: LIKES_COUNT_TABLE,
        Item: marshall({itemId: likeData.itemId, count: 0}),
        ConditionExpression: "attribute_not_exists(#pk)",
        ExpressionAttributeNames: {"#pk": "itemId"},
        }));
    }

    // insert new like
    const transactionResponse = await client.send(new TransactWriteItemsCommand({
        TransactItems: [
            {
                Put: {
                    TableName: LIKES_TABLE,
                    ConditionExpression: "attribute_not_exists(userId)",
                    Item: marshall(likeData),
                }
            },
            {
                Update: {
                    TableName: LIKES_COUNT_TABLE,
                    UpdateExpression: "ADD #count :count",
                    ExpressionAttributeNames: {"#count": "count"},
                    ExpressionAttributeValues: marshall({":count": 1}),
                    Key: marshall({itemId: likeData.itemId}),
                }
            }
        ]
    }));
  }

  const removeLike = async (data: any) => {    
    const transactionResponse = await client.send(new TransactWriteItemsCommand({
        TransactItems: [
            {
                Delete: {
                    TableName: LIKES_TABLE,
                    ConditionExpression: "attribute_exists(userId)",
                    Key: marshall({ userId: data.userId, itemId: data.itemId }),
                }
            },
            {
                Update: {
                    TableName: LIKES_COUNT_TABLE,
                    UpdateExpression: "ADD #count :count",
                    ExpressionAttributeNames: {"#count": "count"},
                    ExpressionAttributeValues: marshall({":count": -1}),
                    Key: marshall({itemId: data.itemId}),
                }
            }
        ]
    }));
  }