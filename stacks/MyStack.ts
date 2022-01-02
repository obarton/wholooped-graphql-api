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

    // Create a likes Count table
    const likesCountTable = new sst.Table(this, "LikesCount", {
      fields: {
        itemId: sst.TableFieldType.STRING,
        count: sst.TableFieldType.NUMBER
      },
      primaryIndex: { partitionKey: "itemId" },
    })

    // // Create Topic
    // const likedTopic = new sst.Topic(this, "Liked", {
    //   subscribers: ["src/persistLike.main"],
    // });

    // // Create the HTTP API
    // const interactionsApi = new sst.Api(this, "InteractionsApi", {
    //   defaultFunctionProps: {
    //     // Pass in the topic arn to our API
    //     environment: {
    //       topicArn: likedTopic.snsTopic.topicArn,
    //       LIKES_TABLE: likesTable.dynamodbTable.tableName,
    //       LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
    //     },
    //   },
    //   routes: {
    //     "POST /like": "src/like.main",
    //   },
    // });

    // interactionsApi.attachPermissions([likedTopic])


    // // Create Queue
    // const queue = new sst.Queue(this, "Queue", {
    //   consumer: "src/interactionsQueueConsumer.main",
    // });

    // // Create the HTTP API
    // const queueApi = new sst.Api(this, "QueueApi", {
    //   defaultFunctionProps: {
    //     // Pass in the queue to our API
    //     environment: {
    //       queueUrl: queue.sqsQueue.queueUrl,
    //       LIKES_TABLE: likesTable.dynamodbTable.tableName,
    //       LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
    //     },
    //   },
    //   routes: {
    //     "POST /": "src/interactionsQueue.main",
    //   },
    // });

    // // Allow the API to publish to the queue
    // queueApi.attachPermissions([likesTable, likesCountTable, queue, likedTopic]);
     
    // Create the AppSync GraphQL API
    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      graphqlApi: {
        schema: "graphql/schema.graphql",
      },
      defaultFunctionProps: {
        // Pass the table name to the function
        environment: {
          //topicArn: likedTopic.snsTopic.topicArn,
          //queueUrl: queue.sqsQueue.queueUrl,
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string
        },
      },
      dataSources: {
        loopPacks: "src/handlers/loopPacks.handler",
        likes: "src/handlers/likes.handler",
        songs: "src/handlers/songs.handler",
        artists: "src/handlers/artists.handler",
        userProfile: "src/handlers/userProfile.handler",
        //interactions: "src/handlers/interactions.handler"
      },
      resolvers: {
        "Query    listLikes": "likes",
        "Query    getLikeById": "likes",
        "Mutation createLike": "likes",
        "Mutation updateLike": "likes",
        "Mutation deleteLike": "likes",
        "Query    listSongs": "songs",
        "Query    getSongById": "songs",
        "Query    querySongByArtist": "songs",
        "Query    listArtists": "artists",
        "Query    listLoopPacks": "loopPacks",
        "Query    getUserProfileById": "userProfile",
        //"Mutation sendInteraction": "interactions"
      },
    });

    // Enable the AppSync API to access the DynamoDB table
    api.attachPermissions([likesTable, likesCountTable]);
    //interactionsApi.attachPermissions([likesTable, likesCountTable, queue, likedTopic])
    //queueApi.attachPermissions([likesTable, likesCountTable, queue, likedTopic]);

    // Show the AppSync API Id in the output
    this.addOutputs({
      //LikesTable: likesTable.dynamodbTable.tableName,
      //LikesCountTable: likesCountTable.dynamodbTable.tableName,
      ApiId: api.graphqlApi.apiId,
      //InteractionsApiEndpoint: interactionsApi.url,
      //QueueApiEndpoint: queueApi.url,
    });
  }
}