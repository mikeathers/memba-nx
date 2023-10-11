import {Construct} from 'constructs'
import {Bucket, BucketAccessControl, HttpMethods} from 'aws-cdk-lib/aws-s3'
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  CorsOptions,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import path, {join} from 'path'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import {CfnOutput, Duration, RemovalPolicy} from 'aws-cdk-lib'
import {Runtime, Tracing} from 'aws-cdk-lib/aws-lambda'
import {
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import {RetentionDays} from 'aws-cdk-lib/aws-logs'
import {UserPool} from 'aws-cdk-lib/aws-cognito'

interface ConfigureImageUploadsProps {
  scope: Construct
  domainName: string
  certificateArn: string
  userPoolArn: string
}

export const configureImageUploads = (props: ConfigureImageUploadsProps) => {
  const {scope, domainName, userPoolArn} = props

  const userPool = UserPool.fromUserPoolArn(scope, `IdStackCognitoUserPool`, userPoolArn)

  const bucketName = 'idwebstack-nextjs-image-uploads'

  const logsBucket = new Bucket(scope, `${bucketName}-logs`, {
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  })

  const allowedOrigins = [
    `https://${domainName}`,
    'http://localhost:4200',
    'http://localhost:4300',
    'http://localhost:4400',
  ]

  const s3Bucket = new Bucket(scope, bucketName, {
    bucketName,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    accessControl: BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    cors: [
      {
        allowedMethods: [HttpMethods.GET, HttpMethods.POST, HttpMethods.PUT],
        allowedOrigins: ['*'],
        allowedHeaders: ['*'],
      },
    ],
    publicReadAccess: true,
    serverAccessLogsBucket: logsBucket,
  })

  const s3AccessPolicy = new PolicyStatement()

  s3AccessPolicy.addActions('s3:GetBucket*')
  s3AccessPolicy.addActions('s3:GetObject*')
  s3AccessPolicy.addActions('s3:PutObject*')
  s3AccessPolicy.addActions('s3:List*')
  s3AccessPolicy.addResources(s3Bucket.bucketArn)
  s3AccessPolicy.addResources(`${s3Bucket.bucketArn}/*`)

  const optionsWithCors: CorsOptions = {
    allowOrigins: allowedOrigins,
    allowMethods: Cors.ALL_METHODS,
    allowHeaders: [
      ...Cors.DEFAULT_HEADERS,
      'Content-Type',
      'X-Amz-Date',
      'Authorization',
      'X-Api-Key',
    ],
    allowCredentials: true,
  }

  const authorizer = new CognitoUserPoolsAuthorizer(scope, `PresignedUrlApiAuthorizer`, {
    cognitoUserPools: [userPool],
    authorizerName: `PresignedUrlApiAuthorizer`,
    identitySource: 'method.request.header.Authorization',
  })

  const cognitoMethodOptions: MethodOptions = {
    authorizationType: AuthorizationType.COGNITO,
    authorizer: {
      authorizerId: authorizer.authorizerId,
    },
  }

  const restApiName = 'NextJs Image Upload API'
  const restApi = new RestApi(scope, 'rest-api-for-image-uploads', {
    restApiName,
    defaultCorsPreflightOptions: optionsWithCors,
  })

  authorizer._attachToApi(restApi)

  const getPresignedUrlFunction = new NodejsFunction(scope, 'get-presigned-url', {
    runtime: Runtime.NODEJS_16_X,
    memorySize: 1024,
    timeout: Duration.seconds(5),
    handler: 'main',
    reservedConcurrentExecutions: 1,
    tracing: Tracing.DISABLED, // Disables Xray
    logRetention: RetentionDays.FIVE_DAYS,
    bundling: {
      minify: true,
      externalModules: ['aws-sdk'],
      keepNames: true,
      sourceMap: true,
    },
    depsLockFilePath: join(__dirname, '..', '..', '..', '..', '..', 'yarn.lock'),
    deadLetterQueueEnabled: true,
    retryAttempts: 0,
    entry: path.join(__dirname, './get-presigned-url-s3.ts'),
    environment: {BUCKET_NAME: s3Bucket.bucketName},
    role: new Role(scope, `nestjs-image-upload-s3-access-role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromManagedPolicyArn(
          scope,
          'PresignedUrlFunctionPolicy',
          'arn:aws:iam::aws:policy/AWSLambdaExecute',
        ),
      ],

      inlinePolicies: {
        s3Access: new PolicyDocument({
          statements: [s3AccessPolicy],
        }),
      },
    }),
  })

  s3Bucket.grantReadWrite(getPresignedUrlFunction)
  getPresignedUrlFunction.grantInvoke(new ServicePrincipal('apigateway.amazonaws.com'))

  restApi.root
    .addResource('get-presigned-url-s3')
    .addMethod(
      'GET',
      new LambdaIntegration(getPresignedUrlFunction),
      cognitoMethodOptions,
    )

  new CfnOutput(scope, 'apiUrl', {
    value: restApi.url,
  })
  new CfnOutput(scope, 'bucketName', {value: s3Bucket.bucketName})
}
