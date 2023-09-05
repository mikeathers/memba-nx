import {App} from 'aws-cdk-lib'
import {readConfig, StageProps} from './read-config'

const stageProps: StageProps = {
  development: {
    certificateArn: '',
    domainName: 'i.am.development',
    hostedZoneId: '',
    hostedZoneName: '',
    imageCachePolicyId: 'iamacachepolicy',
    serverCachePolicyId: '🥲',
    accountId: '123',
  },
  production: {
    certificateArn: '',
    domainName: 'i.am.production',
    hostedZoneId: '',
    hostedZoneName: '',
    imageCachePolicyId: 'iamacachepolicy',
    serverCachePolicyId: '🥲',
    accountId: '123',
  },
}

describe('read-config', () => {
  let context = {
    stageName: 'development',
    serviceName: 'very-cool-service-name',
    stageProps,
  }

  beforeEach(() => {
    context = {
      stageName: 'development',
      serviceName: 'very-cool-service-name',
      stageProps,
    }
  })

  it('should throw if stageName is incorrect', () => {
    context.stageName = 'sausages'
    context.stageProps = stageProps
    const app = new App({
      context,
    })

    expect(() => readConfig(app)).toThrow(
      `Error: Expected one of "development" | "production" but received: '${context.stageName}'`,
    )
  })

  it('should throw if the getConfig for the provided stageName does not exist', () => {
    context.stageName = 'production'
    context.stageProps = {
      development: stageProps.development,
    } as Required<StageProps>
    const app = new App({
      context,
    })

    expect(() => readConfig(app)).toThrow(
      'Error: [production] we are missing the stage config for selected stage',
    )
  })

  it.each(['development', 'production'])(
    'should pass the correct data for the stageName %s',
    (stageName) => {
      context.stageName = stageName
      context.stageProps = stageProps
      const app = new App({
        context,
      })

      const results = readConfig(app)
      expect(results).toHaveProperty('domainName', `i.am.${stageName}`)
    },
  )
})
