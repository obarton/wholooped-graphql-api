import AWS from "aws-sdk";
import Interaction from "./types/Interaction";

const sqs = new AWS.SQS();

export async function main(interaction: Interaction) {
      // Send a message to queue
    await sqs
    .sendMessage({
        // Get the queue url from the environment variable
        QueueUrl: process.env.queueUrl || "",
        MessageBody: JSON.stringify({ 
            interactionType: interaction.interactionType, //"LIKE",
            userId: interaction.data.userId,//"444",
            itemId: interaction.data.itemId, //"53g9ppnyWbuTtX1jjGuvLL",
            likeId: interaction.data.itemId //"124"
        }),
    })
    .promise();

    console.log(`Message queued! ${JSON.stringify(interaction, null, 2)}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ status: "successful" }),
    };
  }