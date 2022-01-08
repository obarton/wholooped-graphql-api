import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();

export default async function deleteSubmission(submissionId: string): Promise<string> {
  const params = {
    Key: { id: submissionId },
    TableName: process.env.SUBMISSIONS_TABLE as string,
  };

  // await dynamoDb.delete(params).promise();

  return submissionId;
}