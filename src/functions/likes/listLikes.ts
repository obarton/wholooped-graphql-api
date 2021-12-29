import { DynamoDB } from "aws-sdk";
import { getClient } from "../../contentful/client"
import { mapContentfulSongResponseObjToSongObj } from "../../helper/song";
import Song from "../../types/Song";

const dynamoDb = new DynamoDB.DocumentClient();
const client = getClient();

export default async function listLikes(
  userId: string
): Promise<Song[] | null> {
  const params = {
    TableName: process.env.LIKES_TABLE as string,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const likedIds = await dynamoDb.query(params).promise();

  const likedSongIds = likedIds.Items?.map(like => { 
      const songId = like.itemId.split(':')[0];

      return songId;
  })
  
  const songEntriesResponse = await client.getEntries({
      content_type: 'song',
      'sys.id[in]': `${likedSongIds}`
  })

  const likedSongs = songEntriesResponse.items.map(item => mapContentfulSongResponseObjToSongObj(item))

  return likedSongs;
}