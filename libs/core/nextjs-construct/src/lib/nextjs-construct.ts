import {Construct} from 'constructs'
import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib'
import {BehaviorOptions, OriginProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront'
import {HttpOrigin, S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins'

import {createStaticFileBucketAndConfiguration} from './configure-s3-buckets'
import {createOpenNextApiGatewaysAndConfiguration} from './configure-api-gateways'
import {createCloudfrontDistributionAndConfiguration} from './configure-cloudfront'
// import {setupISR} from './configure-isr'
import type {Config} from './read-config'
import {configureImageUploads} from './configure-image-uploads'
// import {createWarmerFunction} from './configure-warmer-function'

type NextJsConstructProps = StackProps &
  Config & {
    basePath?: string
    buildPath: string
    behaviourOverrides?: Partial<BehaviorOptions>
    additionalBehaviours?: Record<string, BehaviorOptions>
    warmerConcurrency?: number
    withWildCardDomain?: boolean
    withImageUploads?: boolean
  }

export class NextJsConstruct extends Stack {
  constructor(
    scope: Construct,
    private id: string,
    {buildPath, warmerConcurrency = 50, ...props}: NextJsConstructProps,
  ) {
    super(scope, id, props)

    // PermissionsBoundary.of(this).apply(
    //   ManagedPolicy.fromManagedPolicyName(
    //     this,
    //     'PermissionsBoundary',
    //     'infrastructure/CinchRoleBoundary',
    //   ),
    // )

    if (props.withImageUploads) {
      configureImageUploads({
        scope: this,
        domainName: props.domainName,
        certificateArn: props.certificateArn,
        userPoolArn: props.userPoolArn,
      })
    }

    const {
      bucket,
      staticContentDeployment,
      hashedContentDeployment,
      cacheContentDeployment,
      accessPolicy,
    } = createStaticFileBucketAndConfiguration(this, {
      basePath: props.basePath,
      buildPath,
    })

    const {imageApiGateway, serverApiGateway, imageFunction, serverFunction, logGroup} =
      createOpenNextApiGatewaysAndConfiguration(this, this.id, {
        buildPath,
        basePath: props.basePath,
        bucket,
        region: this.region,
        urlSuffix: this.urlSuffix,
        imageOptimisationProps: {
          s3AccessPolicy: accessPolicy,
          staticContentDeployment,
        },
        serverProps: {
          hashedContentDeployment,
          cacheContentDeployment,
        },
      })

    /**
     * Sets up the ISR Functions
     */
    // const {function: ISRFunction} = setupISR(this, this.id, {
    //   buildPath,
    //   serverFunction,
    //   bucket,
    // })
    //
    // const warmerFunction = createWarmerFunction(this, {
    //   buildPath,
    //   serverFunction,
    //   concurrency: warmerConcurrency,
    // })

    const serverFunctionOrigin = new HttpOrigin(serverApiGateway.domain, {
      originPath: serverApiGateway.path,
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })

    const imageFunctionOrigin = new HttpOrigin(imageApiGateway.domain, {
      originPath: imageApiGateway.path,
      protocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
    })

    const s3BucketOrigin = new S3Origin(bucket)

    const {distribution: cloudfront} = createCloudfrontDistributionAndConfiguration(
      this,
      {
        basePath: props.basePath,
        domainName: props.domainName,
        hostedZoneProps: {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.hostedZoneName,
        },
        // webAclArn: props.webAclArn,
        certificateArn: props.certificateArn,
        serverFunctionOrigin,
        imageFunctionOrigin,
        s3BucketOrigin,
        behaviourOverrides: props.behaviourOverrides ?? {},
        additionalBehaviours: props.additionalBehaviours,
        serverCachePolicyId: props.serverCachePolicyId,
        imageCachePolicyId: props.imageCachePolicyId,
        withWildCardDomain: props.withWildCardDomain,
      },
    )

    // if (props.datadogApiKey) {
    //   createDatadogIntegration(this, {
    //     apiKey: props.datadogApiKey,
    //     serviceName: props.serviceName,
    //     environment: props.environment,
    //     version: props.version,
    //     lambdaFunctions: [imageFunction, serverFunction, ISRFunction, warmerFunction],
    //     nonLambdaLogGroups: [logGroup],
    //     tribe: props.tribe,
    //     squad: props.squad,
    //   })
    // }

    new CfnOutput(this, 'distroId', {
      value: cloudfront.distributionId,
    })

    new CfnOutput(this, `cloudfront-domain`, {
      value: cloudfront.domainName,
      exportName: `${id}-${props.environment}-cloudfront-domain`,
    })

    new CfnOutput(this, `service-url`, {
      value: new URL(props.basePath ?? '/', `https://${props.domainName}`).toString(),
      exportName: `${id}-${props.environment}-service-url`,
    })
  }
}
