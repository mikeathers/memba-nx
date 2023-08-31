import { Construct } from 'constructs'
import { BucketDeployment } from 'aws-cdk-lib/aws-s3-deployment'
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
import { Duration, RemovalPolicy } from 'aws-cdk-lib'
import { RetentionDays } from 'aws-cdk-lib/aws-logs'

type ImageOptimisationProps = {
  scope: Construct
  bucketName: string
  s3AccessPolicy: PolicyStatement
  staticContentDeployment: BucketDeployment
  basePath: string
  stackPrefix: string
}

export const createImageOptimisationFunction = (
  props: ImageOptimisationProps,
) => {
  const {
    scope,
    stackPrefix,
    bucketName,
    staticContentDeployment,
    s3AccessPolicy,
    basePath,
  } = props
  const imageOptimisationFunction = new CdkFunction(
    scope,
    `${stackPrefix}OpenNextImageFunction`,
    {
      description: 'Image optimisation handler for Next.js',
      handler: 'index.handler',
      currentVersionOptions: {
        removalPolicy: RemovalPolicy.DESTROY,
      },
      logRetention: RetentionDays.THREE_DAYS,
      code: Code.fromAsset(`${basePath}/image-optimization-function`),
      runtime: Runtime.NODEJS_18_X,
      memorySize: 1536,
      timeout: Duration.seconds(30),
      architecture: Architecture.ARM_64,
      environment: {
        BUCKET_NAME: bucketName,
      },
      role: new Role(scope, `${stackPrefix}ImageOptimisationS3AccessRole`, {
        assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
          ManagedPolicy.fromManagedPolicyArn(
            scope,
            `${stackPrefix}ImageFunctionPolicy`,
            'arn:aws:iam::aws:policy/AWSLambdaExecute',
          ),
        ],

        inlinePolicies: {
          s3Access: new PolicyDocument({
            statements: [s3AccessPolicy],
          }),
        },
      }),
    },
  )

  imageOptimisationFunction.node.addDependency(staticContentDeployment)

  return imageOptimisationFunction
}

type ServerFunctionProps = {
  scope: Construct
  basePath: string
  stackPrefix: string
}

export const createServerFunction = (props: ServerFunctionProps) => {
  const { scope, stackPrefix, basePath } = props
  // We can just straight up use fromAsset as yarn does not use symlinks
  const code = Code.fromAsset(`${basePath}/server-function`)

  return new CdkFunction(scope, `${stackPrefix}OpenNextServerFunction`, {
    description: 'OpenNext Server function for Next.js',
    handler: 'index.handler',
    logRetention: RetentionDays.THREE_DAYS,
    code,
    runtime: Runtime.NODEJS_18_X,
    architecture: Architecture.ARM_64,
    memorySize: 512,
    timeout: Duration.seconds(60),
  })
}
