
import AWS from "aws-sdk";
import Interaction from "./types/Interaction";

const sqs = new AWS.SQS();

const LIKES_TABLE = process.env.LIKES_TABLE as string;
const LIKES_COUNT_TABLE = process.env.LIKES_COUNT_TABLE as string;

export async function main(event: any) {
      // Send a message to queue
    const messageBody: Interaction = JSON.parse(event.body)

    const queueMessageBody = { 
      interactionType: messageBody.interactionType,
      data: messageBody.data,
      likesTable: LIKES_TABLE,
      likesCountTable: LIKES_COUNT_TABLE
  }

    if (messageBody.interactionType && messageBody.data) { 
        await sqs
        .sendMessage({
            // Get the queue url from the environment variable
            QueueUrl: process.env.queueUrl || "",
            MessageBody: JSON.stringify(queueMessageBody),
        })
        .promise();
    }

    console.log(`Message queued! ${JSON.stringify(queueMessageBody, null, 2)}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  }