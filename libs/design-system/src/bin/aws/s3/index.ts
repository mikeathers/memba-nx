import {RemovalPolicy, Stack} from 'aws-cdk-lib'
import {
  Bucket,
  BucketAccessControl,
  BucketEncryption,
  IBucket,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3'
import {BucketDeployment, CacheControl, Source} from 'aws-cdk-lib/aws-s3-deployment'
import {IDistribution} from 'aws-cdk-lib/aws-cloudfront'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam'

export interface CreateBucketProps {
  scope: Stack
  bucketName: string
}

export interface CreateBucketDeploymentProps {
  scope: Stack
  bucket: IBucket
  filePath: string
  deploymentName: string
  distribution?: IDistribution
}

export const createBucket = (props: CreateBucketProps): IBucket => {
  const {scope, bucketName} = props

  const parsedBucketName = bucketName.toLowerCase()

  return new Bucket(scope, bucketName, {
    bucketName: parsedBucketName,
    publicReadAccess: false,
    autoDeleteObjects: true,
    removalPolicy: RemovalPolicy.DESTROY,
    accessControl: BucketAccessControl.PRIVATE,
    objectOwnership: ObjectOwnership.BUCKET_OWNER_ENFORCED,
    encryption: BucketEncryption.S3_MANAGED,
  })
}

export const createBucketDeploymentWithDistribution = (
  props: CreateBucketDeploymentProps,
): BucketDeployment => {
  const {scope, bucket, filePath, deploymentName, distribution} = props

  return new BucketDeployment(scope, `${deploymentName}`, {
    destinationBucket: bucket,
    sources: [Source.asset(filePath)],
    distribution,
    distributionPaths: ['/*'],
  })
}

export const createBucketDeployment = (
  props: Omit<CreateBucketDeploymentProps, 'distribution'>,
): BucketDeployment => {
  const {scope, bucket, filePath, deploymentName} = props

  return new BucketDeployment(scope, `${deploymentName}`, {
    destinationBucket: bucket,
    sources: [Source.asset(filePath)],
    prune: true,
    cacheControl: [CacheControl.fromString('public,max-age=300,immutable')],
  })
}

export const createS3AccessPolicy = (bucket: IBucket) => {
  const s3AccessPolicy = new PolicyStatement()

  s3AccessPolicy.addActions('s3:GetBucket*')
  s3AccessPolicy.addActions('s3:GetObject*')
  s3AccessPolicy.addActions('s3:List*')
  s3AccessPolicy.addResources(bucket.bucketArn)
  s3AccessPolicy.addResources(`${bucket.bucketArn}/*`)

  return s3AccessPolicy
}
