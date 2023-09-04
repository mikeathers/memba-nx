import {createTreeWithEmptyWorkspace} from '@nrwl/devkit/testing'
import {Tree, readProjectConfiguration} from '@nrwl/devkit'

import generator from './generator'
import {AddOutputMetadataTargetGeneratorSchema} from './schema'

import generateCDKApp from '../cdk-stack/generator'

describe('add-output-metadata-target generator', () => {
  let appTree: Tree
  const options: AddOutputMetadataTargetGeneratorSchema = {
    name: 'id-web-test',
  }

  beforeEach(() => {
    process.env['NX_INTERACTIVE'] = 'false'

    appTree = createTreeWithEmptyWorkspace()

    generateCDKApp(appTree, {
      name: 'test',
      appName: 'id-web',
      tags: '',
    })
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'id-web-test')
    const outputMetadata = config?.targets?.['output-metadata']
    expect(outputMetadata).toBeDefined()
    expect(outputMetadata?.configurations?.development?.outputs).toBeDefined()
    expect(outputMetadata?.configurations?.production?.outputs).toBeDefined()
  })
})
