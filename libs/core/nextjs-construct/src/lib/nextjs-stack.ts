import { Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
// import CONFIG from './config'
import {
  createARecordForDistribution,
  createBehaviour,
  createBucket,
  createBucketDeployment,
  createCachePolicy,
  createCertificate,
  createImageApiGateway,
  createImageOptimisationFunction,
  createOpenNextDistribution,
  createS3AccessPolicy,
  createServerApiGateway,
  createServerFunction,
  createServerOriginRequestPolicy,
  getHostedZone,
} from './aws'
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import {
  AllowedMethods,
  CacheCookieBehavior,
  CachedMethods,
  CachePolicy,
  OriginProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { Config } from './read-config'

type NextJsStackProps = StackProps &
  Config & {
    stage: string
    basePath: string
    url: string
    hostedZoneUrl: string
    stackPrefix: string
    region: string
  }

export class NextJsStack extends Stack {
  constructor(scope: Construct, id: string, props: NextJsStackProps) {
    super(scope, id, props)
    const { stage, basePath, url, hostedZoneUrl, stackPrefix, region } = props
    // const isProduction = stage === 'prod'
    // const url = isProduction ? CONFIG.PROD_URL : CONFIG.DEV_URL
    // const hostedZoneUrl = isProduction ? CONFIG.PROD_HOSTED_ZONE : CONFIG.DEV_HOSTED_ZONE
    // const basePath = '.open-next'

    ////////////////////////////////////////////////////////////////
    // Create Static Files (assets) S3 Bucket and Bucket Deployment
    ////////////////////////////////////////////////////////////////
    const staticFilesBucket = createBucket({
      bucketName: `Memba${stackPrefix}StaticFiles-${stage}`,
      scope: this,
    })

    const s3StaticFilesAccessPolicy = createS3AccessPolicy(staticFilesBucket)

    const staticFilesBucketDeployment = createBucketDeployment({
      scope: this,
      bucket: staticFilesBucket,
      filePath: `${basePath}/assets`,
      deploymentName: `${stackPrefix}StaticFilesBucketDeployment`,
    })

    ////////////////////////////////////////////////////////////////
    // Create Api Gateway for Images and Server functions
    ////////////////////////////////////////////////////////////////
    const imageOptimisationFunction = createImageOptimisationFunction({
      scope: this,
      bucketName: staticFilesBucket.bucketName,
      s3AccessPolicy: s3StaticFilesAccessPolicy,
      staticContentDeployment: staticFilesBucketDeployment,
      basePath,
      stackPrefix,
    })

    const imageApiGateway = createImageApiGateway({
      scope: this,
      cdkFunction: imageOptimisationFunction,
      region,
      urlSuffix: this.urlSuffix,
      desiredPath: '/',
      stackPrefix,
    })

    const serverFunction = createServerFunction({
      scope: this,
      basePath,
      stackPrefix,
    })

    const serverApiGateway = createServerApiGateway({
      scope: this,
      cdkFunction: serverFunction,
      region,
      urlSuffix: this.urlSuffix,
      desiredPath: '/',
      stackPrefix,
    })

    ////////////////////////////////////////////////////////////////
    // Create Origins for Assets and Images / Server functions
    ////////////////////////////////////////////////////////////////
    const serverFunctionOrigin = new HttpOrigin(serverApiGateway.domain, {
      originPath: serverApiGateway.path,
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })

    const imageFunctionOrigin = new HttpOrigin(imageApiGateway.domain, {
      originPath: imageApiGateway.path,
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })

    const s3BucketOrigin = new S3Origin(staticFilesBucket)

    ////////////////////////////////////////////////////////////////
    // Create CloudFront Distribution and HTTP Config
    ////////////////////////////////////////////////////////////////
    const hostedZone = getHostedZone({
      scope: this,
      domainName: hostedZoneUrl,
      stackPrefix,
    })

    const certificate = createCertificate({
      scope: this,
      url,
      hostedZone,
      name: `${stackPrefix}Certificate`,
    })

    const serverCachePolicy = createCachePolicy(
      this,
      `${stackPrefix}ServerCachePolicy`,
    )
    const imageCachePolicy = createCachePolicy(
      this,
      `${stackPrefix}ImageCachePolicy`,
      {
        cookieBehavior: CacheCookieBehavior.none(),
      },
    )

    const originRequestPolicy = createServerOriginRequestPolicy(this)

    const serverFnBehaviour = createBehaviour(serverFunctionOrigin, {
      cachePolicy: serverCachePolicy,
      originRequestPolicy,
    })

    const imageFnBehaviour = createBehaviour(imageFunctionOrigin, {
      cachePolicy: imageCachePolicy,
      originRequestPolicy,
    })

    const staticFileBehaviour = createBehaviour(s3BucketOrigin, {
      cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
      cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
      originRequestPolicy,
    })
    const distribution = createOpenNextDistribution(
      this,
      certificate,
      serverCachePolicy,
      basePath,
      {
        domainName: url,
        hostedZoneProps: {
          hostedZoneId: hostedZone.hostedZoneId,
          zoneName: hostedZone.zoneName,
        },
        // webAclArn: props.webAclArn,
        certificateArn: certificate.certificateArn,
        serverFunctionOrigin,
        imageFunctionOrigin,
        s3BucketOrigin,
        cachePolicyProps: {},
        additionalBehaviours: {},
        serverFnBehaviour,
        imageFnBehaviour,
        staticFileBehaviour,
        originRequestPolicy,
      },
    )

    createARecordForDistribution({
      scope: this,
      hostedZone,
      url,
      distribution,
      name: `${stackPrefix}ARecord`,
    })
  }
}
