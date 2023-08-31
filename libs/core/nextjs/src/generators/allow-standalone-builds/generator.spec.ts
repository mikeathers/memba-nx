import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'
import { applicationGenerator as NextAppGenerator } from '@nrwl/next'
import generator, {
  EMPTY_INDEX_CONTENT,
  RESOLVE_NEXT_CONFIG_STATEMENT,
} from './generator'
import { AllowStandaloneBuildsGeneratorSchema } from './schema'

describe('allow-standalone-builds generator', () => {
  let appTree: Tree
  const options: AllowStandaloneBuildsGeneratorSchema = { name: 'test' }

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace()
    await NextAppGenerator(appTree, { name: 'test', swc: true, style: 'css' })
  })
  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test')
    expect(config).toBeDefined()
  })
  it('should update the next.config.js file', async () => {
    await generator(appTree, options)
    const updatedConfigFile = appTree
      .read(`apps/test/next.config.js`)
      ?.toString()
    expect(updatedConfigFile).toContain('const path = require("node:path")')
    expect(updatedConfigFile).toContain('"output": "standalone"')
    expect(updatedConfigFile).not.toContain('"target": "serverless"')
    expect(updatedConfigFile).toContain('"experimental"')
    expect(updatedConfigFile).toContain('externalDir: true')
    expect(updatedConfigFile).toContain(
      'outputFileTracingRoot: path.join(__dirname, "../../")',
    )
  })

  it('should update the index.tsx file', async () => {
    await generator(appTree, options)
    const updatedIndexFile = appTree
      .read(`apps/test/pages/index.tsx`)
      ?.toString()

    expect(updatedIndexFile).toContain(RESOLVE_NEXT_CONFIG_STATEMENT)
  })

  it('should not duplicate the content if the changes are there', async () => {
    const currentIndexFile = appTree
      .read(`apps/test/pages/index.tsx`)
      ?.toString()
    await generator(appTree, options)
    const updatedIndexFile = appTree
      .read(`apps/test/pages/index.tsx`)
      ?.toString()

    expect(updatedIndexFile).toMatch(
      `${RESOLVE_NEXT_CONFIG_STATEMENT}\n${currentIndexFile}`,
    )
  })
})

describe('allow-standalone-builds generator without index.tsx file', () => {
  let appTree: Tree
  const options: AllowStandaloneBuildsGeneratorSchema = { name: 'test' }

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace()
    await NextAppGenerator(appTree, { name: 'test', swc: true, style: 'css' })
    appTree.delete('apps/test/pages/index.tsx')
  })

  it('should create index.tsx file if no exitst', async () => {
    await generator(appTree, options)
    const updatedIndexFile = appTree
      .read(`apps/test/pages/index.tsx`)
      ?.toString()

    expect(updatedIndexFile).toContain(RESOLVE_NEXT_CONFIG_STATEMENT)

    expect(updatedIndexFile).toContain(EMPTY_INDEX_CONTENT)
  })
})
