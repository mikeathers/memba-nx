import {ExecOptions, exec} from 'node:child_process'

import {optionsToArgs} from './_util/cmd-util'

function yarn(
  subcommands: TemplateStringsArray | string,
  options: ExecOptions = {
    env: process.env,
  },
) {
  return new Promise((resolve, reject) => {
    const cmd = `yarn ${subcommands}`
    console.log(`> ${cmd}`)

    let stderr: string = '',
      stdout: string = ''

    const prog = exec(cmd, options)

    prog.stderr?.on('data', (data) => {
      stderr += data
      console.error(data)
    })

    prog.stdout?.on('data', (data) => {
      stdout += data
      console.log(data)
    })

    prog.once('error', (error) => {
      reject(error)
    })

    prog.once('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(stdout)
      }

      reject(stderr)
    })
  })
}

interface PublishOptions {
  version: boolean
  noDefaultRc: boolean
  useYarnrc: string
  verbose: boolean
  offline: boolean
  preferOffline: boolean
  enablePnp: boolean
  strictSemver: boolean
  json: boolean
  ignoreScripts: boolean
  har: boolean
  ignorePlatform: boolean
  ignoreEngines: boolean
  force: boolean
  skipIntegrityCheck: boolean
  flat: boolean
  production: boolean
  noLockfile: boolean
  frozenLockfile: boolean
  updateChecksums: boolean
  linkDuplicates: boolean
  nonInteractive: boolean
  emoji: boolean
  silent: boolean
  cwd: string
}

export async function publish(options: Partial<PublishOptions> = {}) {
  const args = optionsToArgs(options)

  return yarn(`publish ${args}`)
    .then(() => true)
    .catch(() => false)
}
