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
    const submissionApi = new sst.Api(this, "SubmissionApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
          SUBMISSIONS_TABLE: submissionsTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string,
          SENDGRID_API_KEY: process.env.SENDGRID_API_KEY as string
        },
      },
      routes: {
        "POST /postsubmission": "src/functions/submissions/postSubmission.main",
        "POST /submitcredit": "src/functions/submissions/submitCredit.main"   
      },
    });

    // Create the HTTP API
    const likesApi = new sst.Api(this, "LikesApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
          SUBMISSIONS_TABLE: submissionsTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /like/{userId}/{itemId}": "src/functions/likes/getIsLiked.main",
        "GET /likes/{userId}": "src/functions/likes/getLikes.main",
        "GET /likes/songs/{itemId}": "src/functions/likes/getLikesCountBySongId.main"
      },
    });

    // Create the HTTP API
    const songApi = new sst.Api(this, "SongApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          LIKES_TABLE: likesTable.dynamodbTable.tableName,
          LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
          SUBMISSIONS_TABLE: submissionsTable.dynamodbTable.tableName,
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
          CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN as string, 
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /song/{userId}/{id}": "src/functions/songs/getSong.main",
        "GET /songs/{artistSlug}/{songSlug}": "src/functions/songs/getSongBySlugs.main"
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
        "PUT /loopmakerProfile/{id}": "src/functions/loopmakerProfile/management/updateLoopmakerProfile.main",
        "POST /loopmakerProfile": "src/functions/loopmakerProfile/management/createLoopmakerProfile.main",
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
        "GET /search/{searchText}": "src/functions/search/search.main",
        "GET /search": "src/functions/search/searchAll.main"
      },
    });

    // Create the HTTP API
    const contentApi = new sst.Api(this, "ContentApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string,  
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /content": "src/functions/content/getContentLists.main",
        "GET /content/{id}": "src/functions/content/getContentById.main"
      },
    });

    // Create the HTTP API
    const loopmakerApi = new sst.Api(this, "LoopmakerApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string,  
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /loopmakers/{username}": "src/functions/loopmaker/getLoopmakerByUsername.main",
        "GET /loopmaker/{id}/credits": "src/functions/loopmaker/getLoopmakerCredits.main",
      },
    });

    // Create the HTTP API
    const loopPackApi = new sst.Api(this, "LoopPackApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string,  
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /looppacks/{loopmakerSlug}/{loopPackSlug}": "src/functions/loopPacks/getLoopPackBySlug.main",
      },
    });

    // Create the HTTP API
    const loopApi = new sst.Api(this, "LoopApi", {
      defaultFunctionProps: {
        // Pass in the queue to our API
        environment: {
          CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string,  
          CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string,
          CONTENTFUL_ENV_ID: process.env.CONTENTFUL_ENV_ID as string
        },
      },
      routes: {
        "GET /loops/{loopmakerSlug}/{loopSlug}": "src/functions/loops/getLoopBySlug.main",
      },
    });

    // // Create the AppSync GraphQL API
    // const api = new sst.AppSyncApi(this, "AppSyncApi", {
    //   graphqlApi: {
    //     schema: "graphql/schema.graphql",
    //   },
    //   defaultFunctionProps: {
    //     // Pass the table name to the function
    //     environment: {
    //       queueUrl: queue.sqsQueue.queueUrl,
    //       LIKES_TABLE: likesTable.dynamodbTable.tableName,
    //       LIKES_COUNT_TABLE: likesCountTable.dynamodbTable.tableName,
    //       SUBMISSIONS_TABLE: submissionsTable.dynamodbTable.tableName,
    //       CONTENTFUL_CDA_ACCESS_TOKEN: process.env.CONTENTFUL_CDA_ACCESS_TOKEN as string, 
    //       CONTENTFUL_SPACE_ID: process.env.CONTENTFUL_SPACE_ID as string
    //     },
    //   },
    //   dataSources: {
    //     loopPacks: "src/handlers/loopPacks.handler",
    //     likes: "src/handlers/likes.handler",
    //     songs: "src/handlers/songs.handler",
    //     artists: "src/handlers/artists.handler",
    //     genres: "src/handlers/genres.handler",
    //     submissions: "src/handlers/submissions.handler",
    //     content: "src/handlers/content.handler"
    //   },
    //   resolvers: {
    //     "Query    listLikes": "likes",
    //     "Query    getLikeById": "likes",
    //     "Mutation createLike": "likes",
    //     "Mutation updateLike": "likes",
    //     "Mutation deleteLike": "likes",
    //     "Query    listSongs": "songs",
    //     "Query    getSongById": "songs",
    //     "Query    querySongByArtist": "songs",
    //     "Query    listArtists": "artists",
    //     "Query    listLoopPacks": "loopPacks",
    //     "Query    listGenres": "genres",
    //     "Query    listSubmissions": "submissions",
    //     "Query    getSubmissionById": "submissions",
    //     "Mutation createSubmission": "submissions",
    //     "Mutation updateSubmission": "submissions",
    //     "Mutation deleteSubmission": "submissions",
    //     "Query    getContentLists": "content",
    //   },
    // });

    // Enable the AppSync API to access the DynamoDB table
    // api.attachPermissions([likesTable, likesCountTable, submissionsTable]);
    queue.attachPermissions([likesTable, likesCountTable, queue]);
    queueApi.attachPermissions([likesTable, likesCountTable, queue]);
    songApi.attachPermissions([likesTable, likesCountTable]);
    submissionApi.attachPermissions([submissionsTable])
    likesApi.attachPermissions([likesTable, likesCountTable])

    // Show the AppSync API Id in the output
    this.addOutputs({
      LikesTable: likesTable.dynamodbTable.tableName,
      LikesCountTable: likesCountTable.dynamodbTable.tableName,
      SubmissionsTable: submissionsTable.dynamodbTable.tableName,
      // ApiId: api.graphqlApi.apiId,
      QueueApiEndpoint: queueApi.url,
      LikesEndpoint: likesApi.url,
      UserProfileManagementApiEndpoint: userProfileManagementApi.url,
      UserProfileEndpoint: userProfileApi.url,
      SignUpEndpoint: signUpApi.url,
      SearchEndpoint: searchApi.url,
      UsersEndpoint: usersApi.url,
      AuthEndpint: authApi.url,
      ContentEndpoint: contentApi.url,
      SongEndpoint: songApi.url,
      SubmissionsEndpoint: submissionApi.url,
      LoopmakerEndpoint: loopmakerApi.url,
      LoopPackEndpoint: loopPackApi.url,
      LoopEndpoint: loopApi.url
    });
  }
}