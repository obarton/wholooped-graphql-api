import { DynamoDB } from "aws-sdk";
import Submission from "../../types/Submission";
import * as uuid from "uuid"

const dynamoDb = new DynamoDB.DocumentClient();

export default async function createSubmission(submission: Submission): Promise<Submission> {
  const params = {
    TableName: process.env.SUBMISSIONS_TABLE as string,
    Item: { 
            // The attributes of the item to be created
            ...submission,
            submissionId: uuid.v1(),
            createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params).promise();

  return submission;
}