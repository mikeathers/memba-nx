import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing'
import {Tree, readProjectConfiguration, readJson} from '@nrwl/devkit'

import generator from './generator'
import {OpennextAppGeneratorSchema} from './schema'
import GenerateNextJSApp from '../next-app/generator'

jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  execSync: jest.fn(() => Buffer.from('1.0.0')),
}))

describe('opennext-app generator', () => {
  let appTree: Tree
  const options: OpennextAppGeneratorSchema = {
    name: 'www-cdk',
    frontEndProjectName: 'acquire-and-engage-www',
    projectFolderName: 'acquire-and-engage',
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await GenerateNextJSApp(appTree, {
      name: 'www',
      appName: 'acquire-and-engage',
    })

    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'acquire-and-engage-www-cdk')
    expect(config).toBeDefined()
    expect(
      appTree.read('apps/acquire-and-engage/www-cdk/bin/www-cdk.ts')?.toString(),
    ).toContain('../../../dist/apps/acquire-and-engage/www')
  })

  it('should have squad and tribe defined in the cdk.json', async () => {
    await GenerateNextJSApp(appTree, {
      name: 'www',
      appName: 'acquire-and-engage',
    })

    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'acquire-and-engage-www-cdk')
    const cdkJson = readJson(appTree, `${config.root}/cdk.json`)

    expect(cdkJson).toHaveProperty('context.squad', 'acquire-and-engage')
    expect(cdkJson).toHaveProperty('context.tribe', 'explore-and-decide')
  })
})
