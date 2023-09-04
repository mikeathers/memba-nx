import {exec} from 'node:child_process'

import {optionsToArgs} from './_util/cmd-util'

interface GitOptions {
  suppressOutput?: boolean
}

function git(
  subcommands: string,
  options: GitOptions = {suppressOutput: true},
): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = `git ${subcommands}`
    console.log(`> ${cmd}`)

    let stderr: string = '',
      stdout: string = ''

    const prog = exec(cmd, {env: process.env})

    prog.stderr?.on('data', (data) => {
      stderr += data
      if (!options.suppressOutput) {
        console.error(data)
      }
    })

    prog.stdout?.on('data', (data) => {
      stdout += data
      if (!options.suppressOutput) {
        console.log(data)
      }
    })

    prog.once('close', (exitCode) => {
      if (exitCode === 0) {
        resolve(stdout)
      }

      reject(stderr)
    })
  })
}

export async function add(...files: string[]) {
  await git(`add ${files.join(' ')} `)
}

export async function commit(message: string) {
  await git(`commit -m "${message}" `)
}

export async function tag(name: string, description: string) {
  await git(`tag -a "${name}" HEAD -m "${description}"`)
}

type sortOptions = 'taggerdate' | '-taggerdate' | 'v:refname' | '-v:refname'

export async function listTags(filter: string, sort: sortOptions) {
  return await git(`tag -l ${filter} --sort=${sort}`)
}

interface DescribeOptions {
  match: string
  all: boolean
  abbrev: number
  candidates: number
  exactMatch: boolean
}

export async function describe(
  commit = 'HEAD',
  options?: Partial<DescribeOptions>,
): Promise<string> {
  const args = optionsToArgs(options ?? {})

  return await git(`describe ${args} ${commit}`, {suppressOutput: true}).then(
    (stdout) => {
      if (typeof stdout !== 'string') {
        throw new Error('unexpected non-string response from git command')
      }

      return stdout
    },
  )
}

type parseOptOptions = {
  /**
   * Enables ParseOptMode
   */
  parseopt: true
  /**
   * Disables SQ Mode;
   */
  sqQuote?: never
  /**
   *  Tells the option parser to echo out the first -- met instead of skipping it.
   */
  keepDashdash: boolean
  /**
   * Lets the option parser stop at the first non-option argument. This can be used to parse sub-commands that take options themselves.
   */
  stopAtNonOption: boolean
  /**
   * Output the options in their long form if available, and with their arguments stuck.
   */
  stuckLong: boolean
}

type shellQuotingMode = {
  parseopt?: never
  sqQuote: true
}

type FilteringOptions = {
  revsOnly: boolean
  noRevs: boolean
  flags: boolean
  noFlags: boolean
}

type OutputOptions = {
  default: string
  prefix: string
  verify: boolean
  quiet: boolean
  short: boolean | number
  symbolic: boolean
  symbolicFullName: boolean
  abbrevRef: boolean | 'strict' | 'loose'
}

type revParseArguments = Partial<
  (parseOptOptions | shellQuotingMode) & FilteringOptions & OutputOptions
>

export async function revParse(ref: string = 'HEAD', args: revParseArguments = {}) {
  return git(`rev-parse ${optionsToArgs(args)} ${ref}`)
}

type PushOptions = {
  force?: boolean
  followTags?: boolean
  noVerify?: boolean
  delete?: boolean
  repo?: string
}

export async function push(options: PushOptions = {}) {
  return git(`push ${optionsToArgs(options)} `)
}
