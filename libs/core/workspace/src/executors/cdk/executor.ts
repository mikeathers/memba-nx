import {ExecutorContext, offsetFromRoot, joinPathFragments} from '@nrwl/devkit'
import {CdkSynthExecutorSchema} from './schema'
import {runCommandProcess} from './util'

export default async function runExecutor(
  options: CdkSynthExecutorSchema,
  context: ExecutorContext,
) {
  const projectName = context.projectName ?? ''
  const projectRoot = context.workspace?.projects[projectName].root
  const outPath = joinPathFragments(offsetFromRoot(projectRoot || ''), options.output)

  const contextArgs = Object.entries(options.context ?? {}).map(
    ([key, value]) => `--context ${key}=${value}`,
  )
  const extraArgs = Object.entries(options.args ?? {}).map(
    // if the value is true, we just output --${key}
    // e.g if verbose = true, then we just output --verbose rather than --verbose true
    ([key, value]) => `--${key} ${value === true ? '' : value}`,
  )

  const cdkArgs = [...contextArgs, outPath && `--output=${outPath}`, ...extraArgs].filter(
    Boolean,
  )

  if (options.profile && options.profile !== 'undefined') {
    cdkArgs.push(`--profile ${options.profile}`)
  }

  const success = await executeCdkCommand(options.command, cdkArgs, projectRoot || '')

  return {success}
}

export async function executeCdkCommand(cmd: string, args: string[], cwd: string) {
  const command = `cdk ${cmd} ${args.join(' ')}`
  return runCommandProcess(command, cwd)
}
