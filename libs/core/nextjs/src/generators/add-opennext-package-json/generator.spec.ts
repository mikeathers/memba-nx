import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'
import { applicationGenerator as NextAppGenerator } from '@nrwl/next'

import generator from './generator'
import { AddOpennextPackageJsonGeneratorSchema } from './schema'

describe('add-opennext-package-json generator', () => {
  let appTree: Tree
  const options: AddOpennextPackageJsonGeneratorSchema = { name: 'test' }

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace()
    await NextAppGenerator(appTree, { name: 'test', swc: true, style: 'css' })
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test')
    expect(config).toBeDefined()
  })

  it('should create package.json file for the app', async () => {
    await generator(appTree, options)
    const updatedFile = appTree.read(`apps/test/package.json`)?.toString()
    expect(updatedFile).toContain(`"name": "${options.name}"`)
    expect(updatedFile).toContain(`"build": "true"`)
  })
})
