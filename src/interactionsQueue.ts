
import AWS from "aws-sdk";
import Interaction from "./types/Interaction";

const sqs = new AWS.SQS();

export async function main(event: any) {
      // Send a message to queue
    const messageBody: Interaction = JSON.parse(event.body)

    if (messageBody.interactionType && messageBody.data) { 
        console.log(`Queueing ${messageBody.interactionType} message...`);
        console.log(`LIKES_TABLE ${process.env.LIKES_TABLE as string} message...`);
        console.log(`LIKES_COUNT_TABLE ${process.env.LIKES_COUNT_TABLE as string} message...`);
       
        await sqs
        .sendMessage({
            // Get the queue url from the environment variable
            QueueUrl: process.env.queueUrl || "",
            MessageBody: JSON.stringify({ 
                interactionType: messageBody.interactionType,
                data: messageBody.data,
                likesTable: process.env.LIKES_TABLE as string,
                likesCountTable: process.env.LIKES_COUNT_TABLE as string
            }),
        })
        .promise();
    }

    console.log(`Message queued! ${JSON.stringify(messageBody, null, 2)}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  }