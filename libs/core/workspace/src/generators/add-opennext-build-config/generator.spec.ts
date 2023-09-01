import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'
import { Linter } from '@nrwl/linter'

import { applicationGenerator as NextAppGenerator } from '@nrwl/next'
import { applicationGenerator as ReactAppGenerator } from '@nrwl/react'
import generator from './generator'
import { AddOpennextBuildConfigGeneratorSchema } from './schema'

describe('add-opennext-build-config generator', () => {
  let appTree: Tree
  const options: AddOpennextBuildConfigGeneratorSchema = { name: 'test' }

  beforeEach(async () => {
    appTree = createTreeWithEmptyWorkspace()
    await NextAppGenerator(appTree, { name: 'test', swc: true, style: 'css' })
  })

  it('should add correct build targets', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'test')
    expect(config.targets?.['opennext-build']).toEqual({
      executor: '@cinch-nx/core-nextjs:opennext-build',
      outputs: ['dist/apps/test/.open-next/'],
      options: {
        debug: true,
      },
      configurations: {
        production: {
          debug: false,
          minify: true,
        },
      },
    })
  })

  it('should fail if provided project does not exist', async () => {
    await expect(() =>
      generator(appTree, { name: 'non-existant-app' }),
    ).rejects.toThrow("Cannot find configuration for 'non-existant-app'")
  })

  it('should fail if provided project is not a nextjs application', async () => {
    await ReactAppGenerator(appTree, {
      name: 'react-app',
      style: 'css',
      skipFormat: true,
      unitTestRunner: 'none',
      e2eTestRunner: 'none',
      linter: Linter.EsLint,
    })

    await expect(() =>
      generator(appTree, { name: 'react-app' }),
    ).rejects.toThrow('Provided project is not a NextJS Application!')
  })
})
