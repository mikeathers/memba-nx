import { App } from 'aws-cdk-lib'
import { readConfig, StageProps } from './read-config'

const stageProps: StageProps = {
  ephemeral: {
    certificateArn: '',
    domainName: 'i.am.ephemeral',
    webAclArn: '',
    hostedZoneId: '',
    hostedZoneName: '',
    datadogApiKeySecretArn: '',
    imageCachePolicyId: 'iamacachepolicy',
    serverCachePolicyId: '🥲',
  },
  development: {
    certificateArn: '',
    domainName: 'i.am.development',
    webAclArn: '',
    hostedZoneId: '',
    hostedZoneName: '',
    datadogApiKeySecretArn: '',
    imageCachePolicyId: 'iamacachepolicy',
    serverCachePolicyId: '🥲',
  },
  production: {
    certificateArn: '',
    domainName: 'i.am.production',
    webAclArn: '',
    hostedZoneId: '',
    hostedZoneName: '',
    datadogApiKeySecretArn: '',
    imageCachePolicyId: 'iamacachepolicy',
    serverCachePolicyId: '🥲',
  },
}

describe('read-config', () => {
  let context = {
    stageName: 'ephemeral',
    tribe: 'im-a-cool-tribe',
    squad: 'im-a-cool-squad',
    serviceName: 'very-cool-service-name',
    stageProps,
  }

  beforeEach(() => {
    context = {
      stageName: 'ephemeral',
      tribe: 'im-a-cool-tribe',
      squad: 'im-a-cool-squad',
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
      `Error: Expected one of "ephemeral" | "development" | "production" but received: '${context.stageName}'`,
    )
  })

  it('should throw if the geConfig for the provided stageName does not exist', () => {
    context.stageName = 'production'
    context.stageProps = {
      ephemeral: stageProps.ephemeral,
      development: stageProps.development,
    } as Required<StageProps>
    const app = new App({
      context,
    })

    expect(() => readConfig(app)).toThrow(
      'Error: [production] we are missing the stage config for selected stage',
    )
  })

  it.each(['ephemeral', 'development', 'production'])(
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

  describe('kebab-case values', () => {
    it('should throw the correct error when BOTH tribe, and squad is not kebab-case', () => {
      context = {
        ...context,
        tribe: 'not a cool tribe',
        squad: 'not a cool squad',
      }

      const app = new App({
        context,
      })

      expect(() => readConfig(app)).toThrow(`Multiple Errors:
 -  [squad] "squad" should be kebab-case.
 -  [tribe] "tribe" should be kebab-case.`)
    })

    it.each(['squad', 'tribe'])(
      'should throw the correct error when ONLY "%s" is not camel case',
      (property) => {
        context = {
          ...context,
          [property]: 'not a cool string',
        }

        const app = new App({
          context,
        })

        expect(() => readConfig(app)).toThrow(
          `"${property}" should be kebab-case`,
        )
      },
    )
  })
})
