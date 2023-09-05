import {Construct} from 'constructs'
import {Stack, StackProps, CfnOutput} from 'aws-cdk-lib'
import {ManagedPolicy, PermissionsBoundary} from 'aws-cdk-lib/aws-iam'
import {BehaviorOptions, OriginProtocolPolicy} from 'aws-cdk-lib/aws-cloudfront'
import {HttpOrigin, S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins'

import {createStaticFileBucketAndConfiguration} from './configure-s3-buckets'
import {createOpenNextApiGatewaysAndConfiguration} from './configure-api-gateways'
import {createCloudfrontDistributionAndConfiguration} from './configure-cloudfront'
// import {createDatadogIntegration} from './configure-datadog'

import {setupISR} from './configure-isr'
import type {Config} from './read-config'
import {createWarmerFunction} from './configure-warmer-function'

type NextJsConstructProps = StackProps &
  Config & {
    basePath?: string
    buildPath: string
    behaviourOverrides?: Partial<BehaviorOptions>
    additionalBehaviours?: Record<string, BehaviorOptions>
    warmerConcurrency?: number
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

    console.log('ACCOUNT ID: ', JSON.stringify(this.id))

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
    const {function: ISRFunction} = setupISR(this, this.id, {
      buildPath,
      serverFunction,
      bucket,
    })

    const warmerFunction = createWarmerFunction(this, {
      buildPath,
      serverFunction,
      concurrency: warmerConcurrency,
    })

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
