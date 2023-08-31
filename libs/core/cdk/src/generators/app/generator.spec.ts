import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'

import generator from './generator'
import { AppGeneratorSchema } from './schema'

describe('app generator', () => {
  let appTree: Tree
  const options: AppGeneratorSchema = { name: 'test-cdk' }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test-cdk')
    expect(config).toBeDefined()

    const expectedFiles = [
      appTree.exists('apps/test-cdk/cdk.json'),
      appTree.exists('apps/test-cdk/tsconfig.json'),
      appTree.exists('apps/test-cdk/tsconfig.spec.json'),
      appTree.exists('apps/test-cdk/jest.config.ts'),
      appTree.exists('apps/test-cdk/bin/test-cdk.ts'),
      appTree.exists('apps/test-cdk/lib/test-cdk-stack.ts'),
    ]

    expect(expectedFiles.every(Boolean)).toEqual(true)
  })
})
