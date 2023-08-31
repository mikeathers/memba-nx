import { NextJsConstruct } from './nextjs-construct'
import { App } from 'aws-cdk-lib'

describe('NextjsConstruct', () => {
  // TODO: create a dummy open-next build?
  it.skip('should create a CDK Stack', () => {
    const app = new App()
    const construct = new NextJsConstruct(app, 'NextJSTestConstruct', {
      basePath: '/test',
      buildPath: '../../../test',
      tribe: 'sausages',
      squad: 'lincolnshire',
      certificateArn: '',
      domainName: 'google.com',
      hostedZoneId: '',
      hostedZoneName: '',
      webAclArn: '',
      version: '1234',
      serviceName: 'testConfig',
      environment: 'development',
      datadogApiKeySecretArn: 'sometime...',
      imageCachePolicyId: 'iamacachepolicy',
      serverCachePolicyId: '🥲',
    })

    expect(construct).toBeTruthy()
  })
})
