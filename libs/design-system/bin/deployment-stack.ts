import {Construct} from 'constructs'
import {Stack, StackProps} from 'aws-cdk-lib'
import {Certificate} from 'aws-cdk-lib/aws-certificatemanager'
import {HostedZone, HostedZoneAttributes} from 'aws-cdk-lib/aws-route53'

import {
  createARecordForDistribution,
  createBucket,
  createBucketDeployment,
  createDistribution,
  handleAccessIdentity,
  getSecurityHeader,
} from './aws'
import CONFIG from './config'
import {join} from 'node:path'
import {MONOREPO_ROOT} from '../../../tools/scripts/determine-affected/nx'

function createCertificate(scope: Construct, id: string, arn: string) {
  return Certificate.fromCertificateArn(scope, id, arn)
}

function createHostedZone(scope: Construct, id: string, props: HostedZoneAttributes) {
  return HostedZone.fromHostedZoneAttributes(scope, id, props)
}

export class DeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const hostedZone = createHostedZone(this, `${CONFIG.STACK_PREFIX}HostedZone`, {
      hostedZoneId: CONFIG.HOSTED_ZONE_ID,
      zoneName: CONFIG.HOSTED_ZONE_NAME,
    })

    const responseHeadersPolicy = getSecurityHeader(this)

    const bucket = createBucket({
      bucketName: `${CONFIG.STACK_PREFIX}Bucket`,
      scope: this,
    })

    const accessIdentity = handleAccessIdentity({
      scope: this,
      bucket,
      name: `${CONFIG.STACK_PREFIX}CloudFrontOriginAccessIdentity`,
    })

    const certificate = createCertificate(
      this,
      `${CONFIG.STACK_PREFIX}Certificate`,
      CONFIG.CERTIFICATE_ARN,
    )

    const distribution = createDistribution({
      scope: this,
      bucket,
      url: CONFIG.STORYBOOK_URL,
      certificate,
      accessIdentity,
      securityHeadersPolicy: responseHeadersPolicy,
      distributionName: `${CONFIG.STACK_PREFIX}CloudfrontDistribution`,
    })

    const MONOREPO_ROOT = join(__dirname, '../../../')
    createBucketDeployment({
      scope: this,
      bucket,
      filePath: join(MONOREPO_ROOT, 'dist/storybook/design-system'),
      deploymentName: `${CONFIG.STACK_PREFIX}BucketDeployment`,
    })

    createARecordForDistribution({
      scope: this,
      hostedZone,
      url: CONFIG.STORYBOOK_URL,
      distribution,
      name: `${CONFIG.STACK_PREFIX}ARecord`,
    })
  }
}
