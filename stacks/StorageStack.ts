import * as sst from "@serverless-stack/resources";

export default class StorageStack extends sst.Stack {
    // Public reference to the bucket
    bucket;

    constructor(scope: any, id: any, props?: any) {
      super(scope, id, props);

      // Create an S3 bucket
      this.bucket = new sst.Bucket(this, "Uploads", {
        s3Bucket: {
          // Allow client side access to the bucket from a different domain
          cors: [
            {
              maxAge: 3000,
              allowedOrigins: ["*"],
              allowedHeaders: ["*"],
              allowedMethods: ["GET" as any, "PUT" as any, "POST" as any, "DELETE" as any, "HEAD" as any],
            },
          ],
        },
      });
    }
}