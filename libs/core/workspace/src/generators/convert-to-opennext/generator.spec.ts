import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'
import { applicationGenerator as nextAppGenerator } from '@nrwl/next'

import generator from './generator'
import { ConvertToOpennextGeneratorSchema } from './schema'

describe('convert-to-opennext generator', () => {
  let appTree: Tree
  const options: ConvertToOpennextGeneratorSchema = { name: 'test-app' }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
    nextAppGenerator(appTree, { swc: true, style: 'css', name: 'test-app' })
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test-app')
    expect(config).toBeDefined()
  })
})
