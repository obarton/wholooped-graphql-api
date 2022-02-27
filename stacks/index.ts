import MyStack from "./MyStack";
import * as sst from "@serverless-stack/resources";
import StorageStack from "./StorageStack";

export default function main(app: sst.App): void {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs14.x",
    environment: { 
      CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN || "" 
    },
  });

  new MyStack(app, "my-stack");
  new StorageStack(app, "storage");

  // Add more stacks
}
