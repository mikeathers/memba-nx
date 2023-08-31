import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration, readJson } from '@nrwl/devkit'

import generator from './generator'
import { AddStagePropsGeneratorSchema } from './schema'

import generateCDKApp from '../app/generator'

describe('add-stage-props generator', () => {
  let appTree: Tree
  const options: AddStagePropsGeneratorSchema = {
    projectName: 'test-app',
    stageName: 'ephemeral',
    domainName: 'aDomainName',
    certificateArn: 'aCertificateArn',
    hostedZoneId: 'aHostedZoneId',
    hostedZoneName: 'aHostedZoneName',
    webAclArn: 'aWebAclArn',
    datadogApiKeySecretArn: 'aDirtyDogSecret',
    imageCachePolicyId: 'i-am-a-cachepolicy',
    serverCachePolicyId: 'i-am-a-cachepolicy',
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generateCDKApp(appTree, { name: 'test-app' })
    const config = readProjectConfiguration(appTree, 'test-app')
    expect(config).toBeDefined()
    const cdkJSON = readJson(appTree, `${config.root}/cdk.json`)
    expect(cdkJSON.context.stageProps).toBeUndefined()
    console.log(cdkJSON)

    await generator(appTree, options)
    const cdkJSON2 = readJson(appTree, `${config.root}/cdk.json`)

    console.log(cdkJSON2)

    expect(cdkJSON2.context.stageProps).toBeDefined()
    expect(cdkJSON2.context.stageProps.ephemeral).toBeDefined()
  })
})
