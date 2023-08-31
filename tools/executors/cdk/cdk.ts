import { ExecutorContext, offsetFromRoot } from '@nrwl/devkit'
import { spawn } from 'child_process'
import * as path from 'path'
import { join } from 'path'

import { Schema } from './schema'

const isTruthy = (input: string | null | undefined): input is string =>
  !!input === true

/**
 * Checks the Input string whether or not the includes string is present, it does so in a case-insensitive way.
 * @param stderr string to check
 * @param includes string to check for
 * @returns {boolean} whether or not the string contains the likeness of `includes`
 */
const includes = (
  stderr: string,
  strToCheck: string,
  ignore: string[] = [],
  ignoreSurrounding: number = 10,
) => {
  const regex = new RegExp(strToCheck, 'gmi')
  const result = regex.exec(stderr)

  if (result !== null) {
    const surrounding = stderr.substring(
      result.index - ignoreSurrounding,
      result.index + strToCheck.length + ignoreSurrounding,
    )
    if (ignore.some((ignoredInput) => surrounding.includes(ignoredInput))) {
      return false
    }
  }

  return result !== null
}
const containsErrorMessage = (stio: string) => {
  const ERROR_MESSAGES = [
    'error',
    'Error',
    'ERROR',
    'fail',
    'Since this app includes more than a single stack, specify which stacks to use',
  ]

  const IGNORE = ['_error']

  return ERROR_MESSAGES.some((message) => includes(stio, message, IGNORE))
}

export default async function runExecutor(
  options: Schema,
  context: ExecutorContext,
) {
  const projectName = context.projectName ?? ''
  const pathRelativeToProject = (inputPath: string) =>
    path.join(offsetFromRoot(projectRoot), inputPath)

  if (!projectName) {
    console.error('Unable to determine Project Name')
    return { success: false }
  }

  const projectRoot = context.workspace.projects[projectName].root
  const outPath = pathRelativeToProject(options.outputPath ?? '')

  const appArg = options.app ? `--app=${options.app}` : null
  const profileArg = options.profile ? `--profile=${options.profile}` : null
  const outputPathArg = options.outputPath ? `--output=${outPath}` : null
  const outputsFile = options.outputsFile
    ? `--outputs-file=${pathRelativeToProject(options.outputsFile)}`
    : null
  const traceArg = options.trace ? `--trace` : null
  const debugArg = options.debug ? `--debug` : null
  const jsonArg = options.json ? '--json' : null
  const forceArg = options.force ? '--force' : null
  const contextArg = options.context
    ? toKeyValuePairs(options.context).reduce<string[]>(
        (acc, kv) => [...acc, '--context', kv],
        [],
      )
    : []

  const allArg = options.all ? '--all' : null

  const arbitraryArgs = options.arbitrary ? options.arbitrary : null

  const cdkArgs = [
    options.command,
    options.stacks,
    appArg,
    ...contextArg,
    profileArg,
    traceArg,
    debugArg,
    jsonArg,
    forceArg,
    outputPathArg,
    outputsFile,
    allArg,
    arbitraryArgs,
  ].filter(isTruthy)

  const success = await spawnCDK(cdkArgs, projectRoot)
  return { success }
}

const toKeyValuePairs = (input: Record<string, unknown>): string[] =>
  Object.keys(input).map((key) => {
    if (typeof input[key] !== 'string') {
      return `${key}.${toKeyValuePairs(input[key] as Record<string, unknown>)}`
    } else {
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        input[key] as string,
      )}`
    }
  })

const spawnCDK = (args: string[] | string[], cwd: string) => {
  return new Promise((resolve) => {
    const CDK_CMD = join(__dirname, '../../../node_modules/.bin/cdk')
    console.log(`>> cdk ${args.join(' ')}\n\n`)
    const cdk = spawn('npx', [CDK_CMD, ...args], { cwd, stdio: 'pipe' })

    let stderr: string
    let stdout: string

    cdk.stderr.pipe(process.stdout)
    cdk.stdout.pipe(process.stdout)

    cdk.stderr.on('data', (data: Buffer) => {
      stderr += data.toString()
    })

    cdk.stdout.on('data', (data: Buffer) => {
      stdout += data.toString()
    })

    cdk.on('error', (error) => {
      console.error(error)
      resolve(false)
    })

    cdk.on('exit', (code) => {
      console.log('>> Command exited with code: ' + code)
      const exitedCleanly = code === 0
      const hasNoErrorMessages =
        !containsErrorMessage(stdout) || containsErrorMessage(stderr)
      resolve(exitedCleanly && hasNoErrorMessages)
    })
  })
}
