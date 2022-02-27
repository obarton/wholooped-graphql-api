import { DynamoDB } from "aws-sdk";
import sgMail from '@sendgrid/mail';
import * as uuid from "uuid"

const dynamoDb = new DynamoDB.DocumentClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function createNftSubmission(nftSubmission: any): Promise<any> {
  const id = uuid.v1()
  const params = {
    TableName: process.env.NFT_SUBMISSIONS_TABLE as string,
    Item: { 
            // The attributes of the item to be created
            ...nftSubmission,
            id,
            createdAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params).promise();

    const msg = {
        to: ['obartondev@gmail.com'],
        from: 'info@wholooped.com', // Use the email address or domain you verified above
        subject: `New NFT submission from ${nftSubmission.displayName}`,
        text: `New NFT submission from ${nftSubmission.displayName}`,
        html: `
            <strong>Submitted By</strong> ${nftSubmission.displayName}<br />
            <strong>Submission ID</strong> <p>${id}</p><br />
            <strong>User ID</strong> <p>${nftSubmission.userId}</p><br />
            <strong>Contract Name</strong> <p>${nftSubmission.contractName}</p><br />
            <strong>Symbol</strong> <p>${nftSubmission.symbol}</p><br />
            <strong>Description</strong> <p>${nftSubmission.description}</p><br />
        `,
        };

        //ES6
        await sgMail
        .sendMultiple(msg)
        .then(() => {
            console.log('NFT Submission sent')
        })

  return { id, ...nftSubmission};
}