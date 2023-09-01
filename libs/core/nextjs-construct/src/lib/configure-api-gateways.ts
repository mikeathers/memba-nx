import { Construct } from 'constructs'

import { Duration, RemovalPolicy, Stack } from 'aws-cdk-lib'
import {
  CfnStage,
  EndpointType,
  IRestApi,
  LambdaIntegration,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway'
import {
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import {
  Architecture,
  Function as CdkFunction,
  Code,
  Runtime,
} from 'aws-cdk-lib/aws-lambda'
import { ILogGroup, LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs'
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment'

import { createArchive, normalizedPathPattern } from './util'
import { IBucket } from 'aws-cdk-lib/aws-s3'

import * as os from 'node:os'
import * as fs from 'node:fs'
import * as path from 'node:path'

type NextApiProps = {
  basePath?: string
  buildPath: string
  region: string
  urlSuffix: string
  bucket: IBucket
  imageOptimisationProps: Omit<ImageOptimisationProps, 'buildPath' | 'bucket'>
  serverProps: {
    hashedContentDeployment: BucketDeployment
    cacheContentDeployment: BucketDeployment
  }
}

export function createOpenNextApiGatewaysAndConfiguration(
  scope: Construct,
  id: string,
  { basePath = '/', buildPath, bucket, ...props }: NextApiProps,
) {
  const logGroup = createLogGroup(scope, `${id}-open-next-apigw-access`)

  const imageFunction = createImageOptimisationFunction(scope, {
    buildPath,
    basePath,
    bucket,
    ...props.imageOptimisationProps,
  })

  const imageApiGateway = createImageApiGateway(scope, id, {
    function: imageFunction,
    region: props.region,
    urlSuffix: props.urlSuffix,
  })

  const serverFunction = createServerFunction(scope, {
    basePath,
    buildPath,
    bucket,
    ...props.serverProps,
  })

  const serverApiGateway = createServerApiGateway(scope, id, {
    function: serverFunction,
    region: props.region,
    urlSuffix: props.urlSuffix,
  })

  enableLogging({ logGroup, apiGateway: imageApiGateway.apiGateway })
  enableLogging({ logGroup, apiGateway: serverApiGateway.apiGateway })

  return {
    imageFunction,
    serverFunction,
    serverApiGateway,
    imageApiGateway,
    logGroup,
  }
}

type ImageOptimisationProps = {
  buildPath: string
  basePath?: string
  bucket: IBucket
  s3AccessPolicy: PolicyStatement
  staticContentDeployment: BucketDeployment
}

function createImageOptimisationFunction(
  scope: Construct,
  { buildPath, ...props }: ImageOptimisationProps,
) {
  const zippedFunctionPath = createArchive({
    zipFileName: 'function.zip',
    directory: `${buildPath}/.open-next/image-optimization-function`,
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  const imageOptimisationFunction = new CdkFunction(
    scope,
    `image-optimization-function`,
    {
      description: 'Image optimisation handler for Next.js',
      handler: 'index.handler',
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
      logRetention: RetentionDays.THREE_DAYS,
      code: Code.fromAsset(zippedFunctionPath),
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1536,
      timeout: Duration.seconds(30),
      architecture: Architecture.ARM_64,
      environment: {
        BUCKET_NAME: props.bucket.bucketName,
      },
      role: new Role(scope, `image-optimisation-s3-access-role`, {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          ManagedPolicy.fromManagedPolicyArn(
            scope,
            'ImageFunctionPolicy',
            'arn:aws:iam::aws:policy/AWSLambdaExecute',
          ),
        ],

        inlinePolicies: {
          s3Access: new PolicyDocument({
            statements: [props.s3AccessPolicy],
          }),
        },
      }),
    },
  )

  imageOptimisationFunction.node.addDependency(props.staticContentDeployment)
  props.bucket.grantReadWrite(imageOptimisationFunction)

  return imageOptimisationFunction
}

type ServerFunctionProps = {
  buildPath: string
  bucket: IBucket
  basePath?: string
  hashedContentDeployment: BucketDeployment
  cacheContentDeployment: BucketDeployment
}

function createServerFunction(
  scope: Construct,
  {
    buildPath,
    basePath,
    bucket,
    hashedContentDeployment,
    cacheContentDeployment,
  }: ServerFunctionProps,
) {
  const zippedFunctionPath = createArchive({
    zipFileName: 'function.zip',
    directory: `${buildPath}/.open-next/server-function`,
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  const code = Code.fromAsset(zippedFunctionPath)
  const region = Stack.of(scope).region
  const cacheBucketPrefix = normalizedPathPattern(basePath, 'cache')

  const serverFunction = new CdkFunction(scope, `server-function`, {
    description: 'OpenNext Server function for Next.js',
    handler: 'index.handler',
    logRetention: RetentionDays.THREE_DAYS,
    code,
    runtime: Runtime.NODEJS_18_X,
    architecture: Architecture.ARM_64,
    memorySize: 512,
    timeout: Duration.seconds(60),
    environment: {
      CACHE_BUCKET_NAME: bucket.bucketName,
      CACHE_BUCKET_KEY_PREFIX: cacheBucketPrefix,
      CACHE_BUCKET_REGION: region,
    },
  })

  serverFunction.node.addDependency(
    hashedContentDeployment,
    cacheContentDeployment,
  )

  return serverFunction
}

function createApiGateway(scope: Construct, id: string) {
  return new RestApi(scope, `${id}-api-gateway`, {
    description: `APIGateway for ${Stack.of(scope).stackName}`,
    binaryMediaTypes: ['*/*'],
    endpointTypes: [EndpointType.REGIONAL],
    cloudWatchRole: true,
  })
}

function createLogGroup(scope: Construct, id: string) {
  return new LogGroup(scope, id, {
    removalPolicy: RemovalPolicy.DESTROY,
    retention: RetentionDays.ONE_MONTH,
  })
}

function enableLogging({
  logGroup,
  apiGateway,
}: {
  logGroup: ILogGroup
  apiGateway: IRestApi
}) {
  const stage = apiGateway.deploymentStage.node.defaultChild as CfnStage

  stage.accessLogSetting = {
    destinationArn: logGroup.logGroupArn,
    format: JSON.stringify({
      requestId: '$context.requestId',
      ip: '$context.identity.sourceIp',
      caller: '$context.identity.caller',
      user: '$context.identity.user',
      requestTime: '$context.requestTimeEpoch',
      httpMethod: '$context.httpMethod',
      resourcePath: '$context.resourcePath',
      status: '$context.status',
      protocol: '$context.protocol',
      responseLength: '$context.responseLength',
    }),
  }

  logGroup.grantWrite(new ServicePrincipal('apigateway.amazonaws.com'))

  return logGroup
}

type ServerApiProps = {
  function: CdkFunction
  region: string
  urlSuffix: string
}

function createServerApiGateway(
  scope: Construct,
  id: string,
  props: ServerApiProps,
) {
  const apiGateway = createApiGateway(scope, `${id}-server`)
  const url = `${apiGateway.restApiId}.execute-api.${props.region}.${props.urlSuffix}`

  const serverFunctionIntegration = new LambdaIntegration(props.function)

  const serverFunctionEndpoint = apiGateway.root.resourceForPath('/')
  const serverGreedyRoute = serverFunctionEndpoint.addResource('{route+}')

  serverFunctionEndpoint.addMethod('ANY', serverFunctionIntegration)
  serverGreedyRoute.addMethod('ANY', serverFunctionIntegration)

  return {
    domain: url,
    path: `/prod${serverFunctionEndpoint.path}`,
    apiGateway,
  }
}

type ImageApiGatewayProps = {
  function: CdkFunction
  region: string
  urlSuffix: string
}

function createImageApiGateway(
  scope: Construct,
  id: string,
  props: ImageApiGatewayProps,
) {
  const apiGateway = createApiGateway(scope, `${id}-image-optimisation`)
  const url = `${apiGateway.restApiId}.execute-api.${props.region}.${props.urlSuffix}`

  const functionIntegration = new LambdaIntegration(props.function)

  const defaultEndpoint = apiGateway.root.resourceForPath('/')
  const greedyEndpoint = defaultEndpoint.addResource('{route+}')

  defaultEndpoint.addMethod('ANY', functionIntegration)
  greedyEndpoint.addMethod('ANY', functionIntegration)

  return {
    apiGateway,
    domain: url,
    path: `/prod${defaultEndpoint.path}`,
  }
}
