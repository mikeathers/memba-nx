import { Duration, Stack } from 'aws-cdk-lib'
import {
  AllowedMethods,
  Behavior,
  BehaviorOptions,
  CacheCookieBehavior,
  CachedMethods,
  CacheHeaderBehavior,
  CachePolicy,
  CachePolicyProps,
  CacheQueryStringBehavior,
  Distribution,
  DistributionProps,
  FunctionEventType,
  ICachePolicy,
  IDistribution,
  IFunction,
  IOrigin,
  IOriginRequestPolicy,
  OriginAccessIdentity,
  OriginRequestPolicy,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { IBucket } from 'aws-cdk-lib/aws-s3'
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager'
import { OriginGroup, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { getJSONContentHeader } from '../headers'
import { Construct } from 'constructs'
import { HostedZoneAttributes } from 'aws-cdk-lib/aws-route53'

export interface CreateDistributionProps {
  scope: Stack
  bucket: IBucket
  url: string
  certificate: ICertificate
  accessIdentity: OriginAccessIdentity
  securityHeadersPolicy: ResponseHeadersPolicy
  functionAssociation?: IFunction
  stage: string
  distributionName: string
  needsAppleAASAReturningAsJSON?: boolean
  stackPrefix: string
}

export const createDistribution = (
  props: CreateDistributionProps,
): IDistribution => {
  const {
    scope,
    bucket,
    url,
    certificate,
    accessIdentity,
    securityHeadersPolicy,
    functionAssociation,
    stage,
    distributionName,
    needsAppleAASAReturningAsJSON,
    stackPrefix,
  } = props

  const origin = new S3Origin(bucket, {
    originAccessIdentity: accessIdentity,
  })

  const distributionProps: DistributionProps = {
    certificate,
    domainNames: [url, `*.${url}`],
    defaultRootObject: 'index.html',
    defaultBehavior: {
      origin,
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      responseHeadersPolicy: securityHeadersPolicy,
    },
    errorResponses: [
      {
        httpStatus: 404,
        responseHttpStatus: 404,
        responsePagePath: '/404.html',
      },
    ],
  }

  const defaultBehavior = (funcAssociation: IFunction) => ({
    ...distributionProps.defaultBehavior,
    functionAssociations: [
      {
        function: funcAssociation,
        eventType: FunctionEventType.VIEWER_REQUEST,
      },
    ],
  })

  const getDistributionProps = (): DistributionProps => {
    if (needsAppleAASAReturningAsJSON && functionAssociation) {
      const returnAppleSiteAssociationAsJSON = {
        '/.well-known/apple-app-site-association': {
          origin,
          responseHeadersPolicy: getJSONContentHeader(scope, stackPrefix),
          viewerProtocolPolicy: ViewerProtocolPolicy.HTTPS_ONLY,
        },
      }

      return {
        ...distributionProps,
        defaultBehavior: { ...defaultBehavior(functionAssociation) },
        additionalBehaviors: {
          ...returnAppleSiteAssociationAsJSON,
        },
      }
    }

    if (!needsAppleAASAReturningAsJSON && functionAssociation) {
      return {
        ...distributionProps,
        defaultBehavior: { ...defaultBehavior(functionAssociation) },
      }
    }

    return distributionProps
  }

  const name = `${distributionName}-${stage}`
  return new Distribution(scope, name, getDistributionProps())
}

export const createCachePolicy = (
  scope: Construct,
  id: string,
  props?: CachePolicyProps,
) => {
  return new CachePolicy(scope, id, {
    queryStringBehavior: CacheQueryStringBehavior.all(),
    headerBehavior: CacheHeaderBehavior.allowList('Accept'),
    cookieBehavior: CacheCookieBehavior.all(),
    defaultTtl: Duration.days(0),
    maxTtl: Duration.days(365),
    minTtl: Duration.days(0),
    enableAcceptEncodingBrotli: true,
    enableAcceptEncodingGzip: true,
    comment: 'OpenNext server response cache policy',
    ...props, // Any Overrides
  })
}

type OpenNextDistributionProps = {
  basePath?: string
  domainName: string
  certificateArn: string
  hostedZoneProps: HostedZoneAttributes
  cachePolicyProps?: CachePolicyProps
  serverFunctionOrigin: IOrigin
  imageFunctionOrigin: IOrigin
  s3BucketOrigin: IOrigin
  webAclArn?: string
  additionalBehaviours?: Record<string, BehaviorOptions>
}

type CreateOpenNextDistributionProps = OpenNextDistributionProps & {
  serverFnBehaviour: BehaviorOptions
  imageFnBehaviour: BehaviorOptions
  staticFileBehaviour: BehaviorOptions
  originRequestPolicy: IOriginRequestPolicy
}
export const createOpenNextDistribution = (
  scope: Construct,
  certificate: ICertificate,
  cachePolicy: ICachePolicy,
  basePath: string,
  props: CreateOpenNextDistributionProps,
) => {
  return new Distribution(scope, 'Distribution', {
    defaultRootObject: '',
    certificate: certificate,
    domainNames: [props.domainName],
    defaultBehavior: {
      origin: new OriginGroup({
        primaryOrigin: props.serverFunctionOrigin,
        fallbackOrigin: props.s3BucketOrigin,
        fallbackStatusCodes: [503],
      }),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      compress: true,
      cachePolicy: cachePolicy,
      originRequestPolicy: props.originRequestPolicy,
    },
    additionalBehaviors: {
      [`api/*`]: props.serverFnBehaviour,
      [`_next/image*`]: props.imageFnBehaviour,
      [`_next/data/*`]: props.serverFnBehaviour,
      [`_next/*`]: props.staticFileBehaviour,
      ...props.additionalBehaviours,
    },
    // webAclId: props.webAclArn,
  })
}

export const createServerOriginRequestPolicy = (scope: Construct) => {
  // CloudFront's Managed-AllViewerExceptHostHeader policy
  return OriginRequestPolicy.fromOriginRequestPolicyId(
    scope,
    `ServerOriginRequestPolicy`,
    'b689b0a8-53d0-40ab-baf2-68738e2966ac',
  )
}

export const createBehaviour = (
  origin: IOrigin,
  props: Omit<BehaviorOptions, 'origin'>,
): BehaviorOptions => {
  return {
    origin,
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_ALL,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    compress: true,
    ...props,
  }
}
