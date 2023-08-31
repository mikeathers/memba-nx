import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing'
import { Tree, readProjectConfiguration } from '@nrwl/devkit'

import generator from './generator'
import { AppGeneratorSchema } from './schema'
import convertAppToOpenNext from '../convert-to-opennext/generator'

jest.mock('../convert-to-opennext/generator', () => ({ default: jest.fn() }))
const mockedGenerator = jest.mocked(convertAppToOpenNext)

jest.mock('child_process', () => ({
  ...jest.requireActual('child_process'),
  execSync: jest.fn(() => Buffer.from('1.0.0')),
}))

describe('app generator', () => {
  let appTree: Tree
  const options: AppGeneratorSchema = {
    name: 'test',
    directory: 'test',
  }

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace()
  })

  it('should run successfully', async () => {
    await generator(appTree, options)
    const config = readProjectConfiguration(appTree, 'acquire-and-engage-test')
    expect(config).toBeDefined()
  })

  it('if ran with directory, it should pass correct project name to generator', async () => {
    await generator(appTree, { name: 'test', directory: 'test' })

    expect(mockedGenerator).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ name: 'acquire-and-engage-test' }),
    )
  })
})