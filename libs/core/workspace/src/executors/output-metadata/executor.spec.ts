import {OutputMetadataExecutorSchema} from './schema'
import executor from './executor'
import {setOutput as _setOutput} from '@actions/core'

jest.mock('@actions/core')

const setOutput = jest.mocked(_setOutput)

const options: OutputMetadataExecutorSchema = {
  sharedOutputs: {
    foo: 'bar',
  },
  outputs: {
    bar: 'foo',
  },
  json: false,
}

describe('OutputMetadata Executor', () => {
  it('can run', async () => {
    const output = await executor(options)
    expect(setOutput).toHaveBeenNthCalledWith(1, 'foo', 'bar')
    expect(setOutput).toHaveBeenNthCalledWith(2, 'bar', 'foo')
    expect(output.success).toBe(true)
  })
})
