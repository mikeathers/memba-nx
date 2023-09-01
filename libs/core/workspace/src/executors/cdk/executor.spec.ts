import { CdkSynthExecutorSchema } from './schema'
import executor from './executor'
import { ExecutorContext } from '@nrwl/devkit'
import path from 'node:path'

import { runCommandProcess as _runCommandProcess } from './util'

const options: CdkSynthExecutorSchema = {
  command: 'destroy',
  output: 'dist/apps/landing/www/cdk.out',
  context: {
    stageName: 'production',
  },
}

jest.mock('./util', () => ({
  runCommandProcess: jest.fn(),
}))

const runCommandProcess = jest.mocked(_runCommandProcess)

describe('CdkSynth Executor', () => {
  let context: ExecutorContext
  jest.setTimeout(60_000)

  beforeEach(() => {
    context = {
      root: path.join(__dirname, '../../../../../../'),
      projectName: 'landing-www',
      targetName: 'cdk-synth',
      workspace: {
        version: 2,
        projects: {
          'landing-www': {
            root: 'apps/landing/www',
            targets: {
              'cdk-synth': {
                executor: '@cinch-nx/core-cdk:cdk-synth',
                options: {
                  landing: 'landing',
                  app: 'www',
                },
              },
            },
          },
        },
      },
      cwd: 'apps/landing/www',
      isVerbose: true,
    }
  })

  it.each(['destroy', 'diff', 'synth', 'deploy'])(
    'can spawn cdk %s',
    async (command) => {
      runCommandProcess.mockResolvedValue(true)

      await executor(
        {
          ...options,
          command: command as 'destroy' | 'diff' | 'synth' | 'deploy',
        },
        context,
      )

      expect(runCommandProcess).toHaveBeenCalledWith(
        [
          'cdk',
          command,
          '--context stageName=production',
          '--output=../../../dist/apps/landing/www/cdk.out',
        ].join(' '),
        'apps/landing/www',
      )
    },
  )
})
