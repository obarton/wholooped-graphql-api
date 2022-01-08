import { DynamoDB } from "aws-sdk";
import Submission from "../../types/Submission";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function updateNote(submission: Submission): Promise<Submission> {
  const params = {
    Key: { id: submission.id },
    ReturnValues: "UPDATED_NEW",
    UpdateExpression: "SET artist = :artist, songTitle = :songTitle, albumTitle = :albumTitle, linkToSong = :linkToSong, loopmaker = :loopmaker, loopTitle = :loopTitle, linkToLoop = :linkToLoop, comments = :comments",
    TableName: process.env.SUBMISSIONS_TABLE as string,
    ExpressionAttributeValues: { 
        ":artist": submission.artist,
        ":songTitle": submission.songTitle,
        ":albumTitle": submission.albumTitle,
        ":linkToSong": submission.linkToSong,
        ":loopmaker": submission.loopmaker,
        ":loopTitle": submission.loopTitle,
        ":loopPackTitle": submission.loopPackTitle, 
        ":linkToLoop": submission.linkToLoop, 
        ":comments": submission.comments 
    },
  };

  await dynamoDb.update(params).promise();

  return submission as Submission;
}