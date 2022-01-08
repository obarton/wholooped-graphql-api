import { DynamoDB } from "aws-sdk";
import Submission from "../../types/Submission";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function getSubmissionById(
  submissionId: string
): Promise<Submission | undefined> {
  const params = {
    Key: { id: submissionId },
    TableName: process.env.SUBMISSIONS_TABLE as string,
  };

  const { Item } = await dynamoDb.get(params).promise();

  return Item as Submission;
}