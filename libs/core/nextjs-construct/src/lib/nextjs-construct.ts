import { Construct } from 'constructs'
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib'
import { ManagedPolicy, PermissionsBoundary } from 'aws-cdk-lib/aws-iam'
import {
  BehaviorOptions,
  OriginProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import { HttpOrigin, S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins'

import { createStaticFileBucketAndConfiguration } from './configure-s3-buckets'
import { createOpenNextApiGatewaysAndConfiguration } from './configure-api-gateways'
import { createCloudfrontDistributionAndConfiguration } from './configure-cloudfront'

import { setupISR } from './configure-isr'
import type { Config } from './read-config'
import { createWarmerFunction } from './configure-warmer-function'

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
    { buildPath, warmerConcurrency = 50, ...props }: NextJsConstructProps,
  ) {
    super(scope, id, props)

    // PermissionsBoundary.of(this).apply(
    //   ManagedPolicy.fromManagedPolicyName(
    //     this,
    //     'PermissionsBoundary',
    //     'infrastructure/CinchRoleBoundary',
    //   ),
    // )

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

    const {
      imageApiGateway,
      serverApiGateway,
      imageFunction,
      serverFunction,
      logGroup,
    } = createOpenNextApiGatewaysAndConfiguration(this, this.id, {
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
    const { function: ISRFunction } = setupISR(this, this.id, {
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
    const { distribution: cloudfront } =
      createCloudfrontDistributionAndConfiguration(this, {
        basePath: props.basePath,
        domainName: props.url,
        hostedZoneProps: {
          hostedZoneId: props.hostedZoneId,
          zoneName: props.hostedZoneName,
        },
        stackPrefix: props.stackPrefix,
        serverFunctionOrigin,
        imageFunctionOrigin,
        s3BucketOrigin,
        behaviourOverrides: props.behaviourOverrides ?? {},
        additionalBehaviours: props.additionalBehaviours,
      })

    new CfnOutput(this, `cloudfront-domain`, {
      value: cloudfront.domainName,
      exportName: `${id}-${props.environment}-cloudfront-domain`,
    })

    new CfnOutput(this, `service-url`, {
      value: new URL(props.basePath ?? '/', `https://${props.url}`).toString(),
      exportName: `${id}-${props.environment}-service-url`,
    })
  }
}
