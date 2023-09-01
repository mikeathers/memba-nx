import executor from './executor'

describe('InvalidateCloudfront Executor', () => {
  it.skip('can run', async () => {
    const output = await executor({
      outputsFile: '',
      region: 'eu-west-1',
      exportName: 'distroId',
    })
    expect(output.success).toBe(true)
  })
})
