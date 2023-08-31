import { RemovalPolicy, Stack } from 'aws-cdk-lib'
import { PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { Bucket, IBucket, HttpMethods } from 'aws-cdk-lib/aws-s3'
import {
  BucketDeployment,
  CacheControl,
  Source,
} from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'

import { createArchive, normalizeBasePath, normalizedPathPattern } from './util'
import * as path from 'node:path'
import * as os from 'node:os'
import * as fs from 'node:fs'

type Props = {
  basePath?: string
  buildPath: string
}

export function createStaticFileBucketAndConfiguration(
  scope: Construct,
  { basePath, ...props }: Props,
) {
  const bucket = createBucket(scope)

  const deploymentBucketProps = {
    basePath,
    bucket,
  }

  const { publicAssets, nextCache, nextStatics } = prepareZips(
    scope,
    props.buildPath,
  )

  const staticContentDeployment = createStaticContentDeployment(scope, {
    ...deploymentBucketProps,
    pathToZip: publicAssets,
  })

  const hashedContentDeployment = createHashedFilesDeployment(scope, {
    ...deploymentBucketProps,
    pathToZip: nextStatics,
  })

  const cacheContentDeployment = createCacheDeployment(scope, {
    ...deploymentBucketProps,
    pathToZip: nextCache,
  })

  const accessPolicy = createS3AccessPolicy(bucket)

  return {
    bucket,
    staticContentDeployment,
    hashedContentDeployment,
    cacheContentDeployment,
    accessPolicy,
  }
}

function createBucket(scope: Construct) {
  return new Bucket(scope, 'StaticFileBucket', {
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
    cors: [
      {
        allowedHeaders: ['*'],
        allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
        allowedOrigins: ['*'],
      },
    ],
  })
}

type DeploymentProps = {
  basePath?: string
  bucket: IBucket
  pathToZip: string
}

function createStaticContentDeployment(
  scope: Construct,
  { basePath, bucket, pathToZip }: DeploymentProps,
) {
  const normalizedBasePath = normalizeBasePath(basePath)

  return new BucketDeployment(scope, 'StaticContentDeployment', {
    sources: [Source.asset(pathToZip)],
    destinationBucket: bucket,
    destinationKeyPrefix: normalizedBasePath,
    cacheControl: [
      CacheControl.fromString(
        'public,max-age=0,s-maxage=31536000,must-revalidate',
      ),
    ],
    prune: false,
  })
}

function createHashedFilesDeployment(
  scope: Construct,
  { basePath, bucket, pathToZip }: DeploymentProps,
) {
  return new BucketDeployment(scope, 'HashedContentDeployment', {
    sources: [Source.asset(pathToZip)],
    destinationBucket: bucket,
    destinationKeyPrefix: normalizedPathPattern(basePath, '_next'),
    cacheControl: [
      CacheControl.fromString('public,max-age=31536000,immutable'),
    ],
    prune: false,
  })
}

function createCacheDeployment(
  scope: Construct,
  { basePath, bucket, pathToZip }: DeploymentProps,
) {
  return new BucketDeployment(scope, 'CacheDeployment', {
    sources: [Source.asset(pathToZip)],
    destinationBucket: bucket,
    destinationKeyPrefix: normalizedPathPattern(basePath, 'cache'),
    cacheControl: [
      CacheControl.fromString('public,max-age=31536000,immutable'),
    ],
    prune: false,
  })
}

function createS3AccessPolicy(bucket: IBucket) {
  const s3AccessPolicy = new PolicyStatement()

  s3AccessPolicy.addActions('s3:GetBucket*')
  s3AccessPolicy.addActions('s3:GetObject*')
  s3AccessPolicy.addActions('s3:List*')
  s3AccessPolicy.addResources(bucket.bucketArn)
  s3AccessPolicy.addResources(`${bucket.bucketArn}/*`)

  return s3AccessPolicy
}

function prepareZips(scope: Construct, buildPath: string) {
  const publicAssets = createArchive({
    directory: `${buildPath}/.open-next/assets`,
    zipFileName: 'assets.zip',
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
    excludeGlob: '*_next*',
  })

  const nextStatics = createArchive({
    directory: `${buildPath}/.open-next/assets/_next`,
    zipFileName: 'assets.zip',
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  const nextCache = createArchive({
    directory: `${buildPath}/.open-next/cache`,
    zipFileName: 'assets.zip',
    zipOutDir: fs.mkdtempSync(
      path.join(os.tmpdir(), Stack.of(scope).stackName + '-'),
    ),
  })

  return { publicAssets, nextStatics, nextCache }
}
