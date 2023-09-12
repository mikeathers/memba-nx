import {Stack} from 'aws-cdk-lib'
import {Certificate, ICertificate} from 'aws-cdk-lib/aws-certificatemanager'
import {
  AllowedMethods,
  BehaviorOptions,
  CachedMethods,
  CachePolicy,
  CachePolicyProps,
  Distribution,
  FunctionEventType,
  ICachePolicy,
  IOrigin,
  IOriginRequestPolicy,
  OriginRequestPolicy,
  ViewerProtocolPolicy,
  Function as CloudfrontFunction,
  FunctionCode as CloudfrontFunctionCode,
} from 'aws-cdk-lib/aws-cloudfront'
import {OriginGroup} from 'aws-cdk-lib/aws-cloudfront-origins'
import {
  ARecord,
  HostedZone,
  HostedZoneAttributes,
  IHostedZone,
  RecordTarget,
} from 'aws-cdk-lib/aws-route53'
import {CloudFrontTarget} from 'aws-cdk-lib/aws-route53-targets'
import {Construct} from 'constructs'
import {pathPattern} from './util'

type DistributionProps = {
  basePath?: string
  domainName: string
  certificateArn: string
  hostedZoneProps: HostedZoneAttributes
  cachePolicyProps?: CachePolicyProps
  serverFunctionOrigin: IOrigin
  imageFunctionOrigin: IOrigin
  s3BucketOrigin: IOrigin
  // webAclArn: string
  behaviourOverrides: Partial<BehaviorOptions>
  additionalBehaviours?: Record<string, BehaviorOptions>
  serverCachePolicyId: string
  imageCachePolicyId: string
}

export function createCloudfrontDistributionAndConfiguration(
  scope: Construct,
  props: DistributionProps,
) {
  const certificate = createCertificate(scope, 'Certificate', props.certificateArn)
  const hostedZone = createHostedZone(scope, 'HostedZone', props.hostedZoneProps)
  const originRequestPolicy = createServerOriginRequestPolicy(scope)

  const {serverCachePolicy, imageCachePolicy} = resolveCachePolicies(scope, {
    serverCachePolicyId: props.serverCachePolicyId,
    imageCachePolicyId: props.imageCachePolicyId,
  })

  const serverFnBehaviour = createBehaviour(props.serverFunctionOrigin, {
    cachePolicy: serverCachePolicy,
    originRequestPolicy,
    ...props.behaviourOverrides,
  })

  const imageFnBehaviour = createBehaviour(props.imageFunctionOrigin, {
    cachePolicy: imageCachePolicy,
    originRequestPolicy,
    ...props.behaviourOverrides,
  })

  const staticFileBehaviour = createBehaviour(props.s3BucketOrigin, {
    cachePolicy: CachePolicy.CACHING_OPTIMIZED,
    allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    originRequestPolicy,
    ...props.behaviourOverrides,
  })

  const distribution = createDistribution(scope, certificate, serverCachePolicy, {
    ...props,
    serverFnBehaviour,
    imageFnBehaviour,
    staticFileBehaviour,
    originRequestPolicy,
  })

  createARecord(scope, {
    hostedZone,
    domainName: props.domainName,
    distribution,
  })

  return {
    distribution,
    serverCachePolicy,
    imageCachePolicy,
    hostedZone,
    certificate,
  }
}

function createCertificate(scope: Construct, id: string, arn: string) {
  return Certificate.fromCertificateArn(scope, id, arn)
}

function createHostedZone(scope: Construct, id: string, props: HostedZoneAttributes) {
  return HostedZone.fromHostedZoneAttributes(scope, id, props)
}

type CreateDistributionProps = DistributionProps & {
  serverFnBehaviour: BehaviorOptions
  imageFnBehaviour: BehaviorOptions
  staticFileBehaviour: BehaviorOptions
  originRequestPolicy: IOriginRequestPolicy
}

function createDistribution(
  scope: Construct,
  certificate: ICertificate,
  cachePolicy: ICachePolicy,
  {basePath = '', ...props}: CreateDistributionProps,
) {
  const normalizedPath = pathPattern(basePath)
  return new Distribution(scope, 'Distribution', {
    defaultRootObject: '',
    comment: `Open-next Cloudfront Distribution for ${Stack.of(scope).stackName}`,
    certificate,
    domainNames: [props.domainName],
    defaultBehavior: {
      origin: new OriginGroup({
        primaryOrigin: props.serverFunctionOrigin,
        fallbackOrigin: props.s3BucketOrigin,
        fallbackStatusCodes: [503],
      }),
      viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      compress: true,
      cachePolicy,
      originRequestPolicy: props.originRequestPolicy,
      functionAssociations: [
        {
          function: createViewerRequestLambda(scope),
          eventType: FunctionEventType.VIEWER_REQUEST,
        },
      ],
      ...props.behaviourOverrides,
    },
    additionalBehaviors: {
      [normalizedPath('/api/*')]: props.serverFnBehaviour,
      [normalizedPath('/_next/image*')]: props.imageFnBehaviour,
      [normalizedPath('/_next/data/*')]: props.serverFnBehaviour,
      [normalizedPath('/_next/*')]: props.staticFileBehaviour,
      ...props.additionalBehaviours,
    },
    // webAclId: props.webAclArn,
  })
}

type ARecordProps = {
  hostedZone: IHostedZone
  domainName: string
  distribution: Distribution
}
function createARecord(scope: Construct, props: ARecordProps) {
  return new ARecord(scope, `CustomAliasRecord`, {
    zone: props.hostedZone,
    recordName: props.domainName,
    target: RecordTarget.fromAlias(new CloudFrontTarget(props.distribution)),
  })
}

function createServerOriginRequestPolicy(scope: Construct) {
  // CloudFront's Managed-AllViewerExceptHostHeader policy
  return OriginRequestPolicy.fromOriginRequestPolicyId(
    scope,
    `ServerOriginRequestPolicy`,
    'b689b0a8-53d0-40ab-baf2-68738e2966ac',
  )
}

function createBehaviour(
  origin: IOrigin,
  props: Omit<BehaviorOptions, 'origin'>,
): BehaviorOptions {
  return {
    origin,
    viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    allowedMethods: AllowedMethods.ALLOW_ALL,
    cachedMethods: CachedMethods.CACHE_GET_HEAD_OPTIONS,
    compress: true,
    ...props,
  }
}

type ResolveCachePoliciesProps = {
  serverCachePolicyId: string
  imageCachePolicyId: string
}

function resolveCachePolicies(scope: Construct, props: ResolveCachePoliciesProps) {
  const serverCachePolicy = CachePolicy.fromCachePolicyId(
    scope,
    'ServerCachePolicy',
    props.serverCachePolicyId,
  )

  const imageCachePolicy = CachePolicy.fromCachePolicyId(
    scope,
    'ImageCachePolicy',
    props.imageCachePolicyId,
  )

  return {
    serverCachePolicy,
    imageCachePolicy,
  }
}

function createViewerRequestLambda(scope: Construct) {
  return new CloudfrontFunction(scope, `viewer-request-function`, {
    code: CloudfrontFunctionCode.fromInline(`
        function handler(event) {
          var request = event.request;
          request.headers["x-forwarded-host"] = request.headers.host;
          return request;
        }
    `),
  })
}
