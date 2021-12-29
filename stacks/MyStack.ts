import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a likes table
    const likesTable = new sst.Table(this, "Likes", {
      fields: {
        userId: sst.TableFieldType.STRING,
        itemId: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "itemId" },
    });

    // Create the AppSync GraphQL API
    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      graphqlApi: {
        schema: "graphql/schema.graphql",
      },
      defaultFunctionProps: {
        // Pass the table name to the function
        environment: {
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string
        },
      },
      dataSources: {
        loopPacks: "src/handlers/loopPacks.handler",
        likes: "src/handlers/likes.handler",
        songs: "src/handlers/songs.handler",
        artists: "src/handlers/artists.handler",
        userProfile: "src/handlers/userProfile.handler"
      },
      resolvers: {
        "Query    listLikes": "likes",
        "Query    getLikeById": "likes",
        "Mutation createLike": "likes",
        "Mutation updateLike": "likes",
        "Mutation deleteLike": "likes",
        "Query    listSongs": "songs",
        "Query    querySongByArtist": "songs",
        "Query    listArtists": "artists",
        "Query    listLoopPacks": "loopPacks",
        "Query    getUserProfileById": "userProfile",
      },
    });

    // Enable the AppSync API to access the DynamoDB table
    api.attachPermissions([likesTable]);

    // Show the AppSync API Id in the output
    this.addOutputs({
      ApiId: api.graphqlApi.apiId,
    });
  }
}