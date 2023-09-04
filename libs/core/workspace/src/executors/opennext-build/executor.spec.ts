import {OpennextBuildExecutorSchema} from './schema'
import {ExecutorContext} from '@nrwl/devkit'
import {
  doOpenNextBuild as _doOpenNextBuild,
  doFixRequiredServerFiles as _doFixRequiredServerFiles,
  doUpdatePublicFilesJSON as _doUpdatePublicFilesJSON,
} from './commands'
import executor from './executor'

jest.mock('./commands', () => ({
  doOpenNextBuild: jest.fn(),
  doFixRequiredServerFiles: jest.fn(),
  doUpdatePublicFilesJSON: jest.fn(),
  doFixDatadog: jest.fn(),
}))

const doOpenNextBuild = jest.mocked(_doOpenNextBuild)
const doFixRequiredServerFiles = jest.mocked(_doFixRequiredServerFiles)
const doUpdatePublicFilesJSON = jest.mocked(_doUpdatePublicFilesJSON)

jest.mock('@nrwl/devkit', () => ({
  ...jest.requireActual('@nrwl/devkit'),
  runExecutor: jest.fn(),
}))

describe('OpennextBuild Executor', () => {
  let context: ExecutorContext
  let options: OpennextBuildExecutorSchema = {}

  beforeEach(() => {
    context = {
      root: 'apps/id-web/www',
      projectName: 'id-web-www',
      targetName: 'opennext-build',
      workspace: {
        version: 2,
        projects: {
          'id-web-www': {
            root: 'apps/id-web/www',
            targets: {
              'opennext-build': {
                executor: '@memba-nx/core/workspace:opennext-build',
              },
            },
          },
        },
      },
      cwd: 'apps/id-web/www',
      isVerbose: true,
    }

    options = {}
  })

  it('can run', async () => {
    // we should check that the right functions are called.
    doOpenNextBuild.mockResolvedValue(true)
    doFixRequiredServerFiles.mockResolvedValue(true)
    doUpdatePublicFilesJSON.mockResolvedValue(true)

    const result = await executor(options, context)

    expect(doOpenNextBuild).toHaveBeenCalled()
    expect(doFixRequiredServerFiles).toHaveBeenCalled()
    expect(doUpdatePublicFilesJSON).toHaveBeenCalled()
    expect(result).toEqual({success: true})
  })

  it('passes the options to the correct command', async () => {
    doOpenNextBuild.mockResolvedValue(true)
    doFixRequiredServerFiles.mockResolvedValue(true)
    doUpdatePublicFilesJSON.mockResolvedValue(true)

    options.minify = true

    const result = await executor(options, context)

    expect(doOpenNextBuild).toHaveBeenLastCalledWith(context, {
      minify: true,
      debug: false,
      cwd: 'apps/id-web/www/dist/apps/id-web/www',
    })
    expect(doFixRequiredServerFiles).toHaveBeenCalled()
    expect(doUpdatePublicFilesJSON).toHaveBeenCalled()
    expect(result).toEqual({success: true})
  })

  it('if any of the commands fail, the whole executor fails', async () => {
    doOpenNextBuild.mockResolvedValue(true)
    doFixRequiredServerFiles.mockResolvedValue(true)
    doUpdatePublicFilesJSON.mockResolvedValue(false)

    const result = await executor(options, context)

    expect(result).toEqual({success: false})
  })
})
