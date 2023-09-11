import {Stack} from 'aws-cdk-lib'
import {
  Distribution,
  DistributionProps,
  IDistribution,
  OriginAccessIdentity,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import {IBucket} from 'aws-cdk-lib/aws-s3'
import {ICertificate} from 'aws-cdk-lib/aws-certificatemanager'
import {S3Origin} from 'aws-cdk-lib/aws-cloudfront-origins'

export interface CreateDistributionProps {
  scope: Stack
  bucket: IBucket
  url: string
  certificate: ICertificate
  accessIdentity: OriginAccessIdentity
  securityHeadersPolicy: ResponseHeadersPolicy
  distributionName: string
}

export const createDistribution = (props: CreateDistributionProps): IDistribution => {
  const {
    scope,
    bucket,
    url,
    certificate,
    accessIdentity,
    securityHeadersPolicy,
    distributionName,
  } = props

  const origin = new S3Origin(bucket, {
    originAccessIdentity: accessIdentity,
  })

  const distributionProps: DistributionProps = {
    certificate,
    domainNames: [url],
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

  const name = distributionName
  return new Distribution(scope, name, distributionProps)
}
