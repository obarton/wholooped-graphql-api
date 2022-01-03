
import AWS from "aws-sdk";
import Interaction from "./types/Interaction";

const sqs = new AWS.SQS();

export async function main(event: any) {
      // Send a message to queue
    const messageBody: Interaction = JSON.parse(event.body)

    if (messageBody.interactionType && messageBody.data) { 
        console.log(`Queueing ${messageBody.interactionType} message...`);
       
        await sqs
        .sendMessage({
            // Get the queue url from the environment variable
            QueueUrl: process.env.queueUrl || "",
            MessageBody: JSON.stringify({ 
                interactionType: messageBody.interactionType,
                data: messageBody.data
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