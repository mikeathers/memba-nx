import {
  HeadersFrameOption,
  HeadersReferrerPolicy,
  ResponseCustomHeader,
  ResponseHeadersPolicy,
} from 'aws-cdk-lib/aws-cloudfront'
import {Duration, Stack} from 'aws-cdk-lib'
import CONFIG from '../../config'

export const getSecurityHeader = (scope: Stack): ResponseHeadersPolicy => {
  const name = `${CONFIG.STACK_PREFIX}SecurityHeadersResponseHeaderPolicy`

  return new ResponseHeadersPolicy(scope, name, {
    comment: 'Security headers response header policy',
    responseHeadersPolicyName: name,
    securityHeadersBehavior: {
      strictTransportSecurity: {
        override: true,
        accessControlMaxAge: Duration.days(2 * 365),
        includeSubdomains: true,
        preload: true,
      },
      contentTypeOptions: {
        override: true,
      },
      referrerPolicy: {
        override: true,
        referrerPolicy: HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN,
      },
      xssProtection: {
        override: true,
        protection: true,
        modeBlock: true,
      },
      frameOptions: {
        override: true,
        frameOption: HeadersFrameOption.SAMEORIGIN,
      },
    },
  })
}

export const getJSONContentHeader = (scope: Stack): ResponseHeadersPolicy => {
  const name = `${CONFIG.STACK_PREFIX}-JSONContentResponseHeaderPolicy`

  const header: ResponseCustomHeader = {
    header: 'Content-Type',
    value: 'application/json',
    override: true,
  }

  return new ResponseHeadersPolicy(scope, name, {
    comment: 'JSON Content response header policy',
    responseHeadersPolicyName: name,
    customHeadersBehavior: {
      customHeaders: [header],
    },
  })
}
