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

    // Create a submissions table
    const submissionsTable = new sst.Table(this, "Submissions", {
      fields: {
        userId: sst.TableFieldType.STRING,
        id: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "userId", sortKey: "submissionId" },
    });

    // Create Queue
    const queue = new sst.Queue(this, "Queue", {
      consumer: "src/interactionsQueueConsumer.main",
    });

    // Create the HTTP API
    const authApi = new sst.Api(this, "AuthApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          NODEBB_SESSION_SHARE_SECRET_KEY: process.env.NODEBB_SESSION_SHARE_SECRET_KEY as string, 
        },
      },
      routes: {
        "POST /sessiontoken": "src/functions/auth/getSessionToken.main"
      },
    });

    // Create the HTTP API
    const queueApi = new sst.Api(this, "QueueApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          queueUrl: queue.sqsQueue.queueUrl,
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
        },
      },
      routes: {
        "POST /": "src/interactionsQueue.main",
      },
    });

    // Create the HTTP API
    const userProfileManagementApi = new sst.Api(this, "UserProfileManagementApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "PUT /userProfile/{id}": "src/functions/userProfile/management/update.main",
        "GET /userProfile/{id}": "src/functions/userProfile/management/getProfileById.main",
        "GET /userProfile/auth/{id}": "src/functions/userProfile/management/getProfileByAuthId.main",
      },
    });

    // Create the HTTP API
    const userProfileApi = new sst.Api(this, "UserProfileApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /userProfile/{id}": "src/functions/userProfile/getUserProfileData.main"
      },
    });

    // Create the HTTP API
    const usersApi = new sst.Api(this, "UsersApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /users/{username}": "src/functions/users/getUserByUsername.main"
      },
    });

    // Create the HTTP API
    const signUpApi = new sst.Api(this, "SignUpApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /userProfile/{username}": "src/functions/signUp/isUsernameValid.main"
      },
    });

    // Create the HTTP API
    const searchApi = new sst.Api(this, "SearchApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string,  
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /search/{searchText}": "src/functions/search/search.main"
      },
    });

    // Create the AppSync GraphQL API
    const api = new sst.AppSyncApi(this, "AppSyncApi", {
      graphqlApi: {
        schema: "graphql/schema.graphql",
      },
      defaultFunctionProps: {
        // Pass the table name to the function
        environment: {
          queueUrl: queue.sqsQueue.queueUrl,
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
          SUBMISSIONS_TABLE: submissionsTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string
        },
      },
      dataSources: {
        loopPacks: "src/handlers/loopPacks.handler",
        likes: "src/handlers/likes.handler",
        songs: "src/handlers/songs.handler",
        artists: "src/handlers/artists.handler",
        genres: "src/handlers/genres.handler",
        submissions: "src/handlers/submissions.handler"
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
        "Query    listGenres": "genres",
        "Query    listSubmissions": "submissions",
        "Query    getSubmissionById": "submissions",
        "Mutation createSubmission": "submissions",
        "Mutation updateSubmission": "submissions",
        "Mutation deleteSubmission": "submissions",
      },
    });

    // Enable the AppSync API to access the DynamoDB table
    api.attachPermissions([likesTable, likesCountTable, submissionsTable]);
    queueApi.attachPermissions([likesTable, likesCountTable, queue]);

    // Show the AppSync API Id in the output
    this.addOutputs({
      LikesTable: likesTable.dynamodbTable.tableName,
      LikesCountTable: likesCountTable.dynamodbTable.tableName,
      SubmissionsTable: submissionsTable.dynamodbTable.tableName,
      ApiId: api.graphqlApi.apiId,
      QueueApiEndpoint: queueApi.url,
      UserProfileManagementApiEndpoint: userProfileManagementApi.url,
      UserProfileEndpoint: userProfileApi.url,
      SignUpEndpoint: signUpApi.url,
      SearchEndpoint: searchApi.url,
      UsersEndpoint: usersApi.url,
      AuthEndpint: authApi.url
    });
  }
}