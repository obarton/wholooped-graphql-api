import { DynamoDB } from "aws-sdk";
import { getClient } from "../../contentful/client"
import { mapContentfulLoopResponseToLoopObj } from "../../helper/loop";
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
  
  const likeLoopIds = likedIds.Items?.map(like => { 
      const loopId = like.itemId.split(':')[1];
      return loopId;
  })

  const songEntriesResponse = await client.getEntries({
      content_type: 'song',
      'sys.id[in]': `${likedSongIds}`
  })

  const loopEntriesResponse = await client.getEntries({
    content_type: 'loop',
    'sys.id[in]': `${likeLoopIds}`
})

  //console.log(`loopEntriesResponse ${JSON.stringify(loopEntriesResponse, null, 2)}`);
  const likedSongs = songEntriesResponse.items?.map(item => {
    const s = mapContentfulSongResponseObjToSongObj(item);
    const loopLookups = loopEntriesResponse.items.filter(loopResponse => s.loop.map(l => l.id).includes(loopResponse.sys.id))
    //console.log(`loopLookup ${JSON.stringify(loopLookup, null, 2)}`);
    s.loop = mapContentfulLoopResponseToLoopObj(loopLookups[0])

    return s;
  })

  return likedSongs;
}